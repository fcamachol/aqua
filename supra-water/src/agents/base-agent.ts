// =============================================================
// Base Agent — SUPRA Water 2026 §5.1
//
// Provides: Claude API integration, tool execution framework,
// conversation history, error handling, token budget tracking.
// =============================================================

import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';
import type {
  AgentConfig,
  AgentContext,
  AgentTool,
  ConversationMessage,
  ToolCallRecord,
  ToolResult,
} from '../types/agents.js';

export abstract class BaseAgent implements AgentConfig {
  readonly name: string;
  readonly description: string;
  readonly triggers: AgentConfig['triggers'];
  readonly tools: AgentTool[];
  readonly systemPrompt: string;
  readonly model: AgentConfig['model'];
  readonly maxTokens: number;
  readonly temperature: number;

  // Metrics
  private _totalInvocations = 0;
  private _errorCount = 0;
  private _totalLatencyMs = 0;
  private _lastActivity?: string;

  // Claude API client (shared across all agents)
  private static _client: Anthropic | null = null;

  constructor(config: AgentConfig) {
    this.name = config.name;
    this.description = config.description;
    this.triggers = config.triggers;
    this.tools = config.tools;
    this.systemPrompt = config.systemPrompt;
    this.model = config.model;
    this.maxTokens = config.maxTokens;
    this.temperature = config.temperature;
  }

  // ─── Claude Client ──────────────────────────────────────────

  protected get client(): Anthropic {
    if (!BaseAgent._client) {
      BaseAgent._client = new Anthropic({
        apiKey: env.ANTHROPIC_API_KEY,
      });
    }
    return BaseAgent._client;
  }

  // ─── Tool Definitions for Claude API ────────────────────────

  private get claudeTools(): Anthropic.Tool[] {
    return this.tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: {
        type: 'object' as const,
        properties: Object.fromEntries(
          tool.parameters.map((p) => [
            p.name,
            {
              type: p.type,
              description: p.description,
              ...(p.enum ? { enum: p.enum } : {}),
            },
          ]),
        ),
        required: tool.parameters.filter((p) => p.required).map((p) => p.name),
      },
    }));
  }

  // ─── Execute a Single Tool ──────────────────────────────────

  private async executeTool(
    toolName: string,
    input: Record<string, unknown>,
    context: AgentContext,
  ): Promise<ToolResult> {
    const tool = this.tools.find((t) => t.name === toolName);
    if (!tool) {
      return { success: false, error: `Unknown tool: ${toolName}` };
    }

    try {
      return await tool.execute(input, context);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[${this.name}] Tool "${toolName}" error:`, message);
      return { success: false, error: message };
    }
  }

  // ─── Run Conversation Turn ──────────────────────────────────

  /**
   * Process a user message through the agent's Claude model.
   * Handles the full tool_use loop: send message -> execute tools -> continue.
   */
  async run(
    userMessage: string,
    context: AgentContext,
    history: ConversationMessage[] = [],
  ): Promise<{ response: string; toolCalls: ToolCallRecord[]; tokensUsed: number }> {
    const startTime = Date.now();
    this._totalInvocations++;
    this._lastActivity = new Date().toISOString();

    try {
      // Build messages array from conversation history
      const messages: Anthropic.MessageParam[] = [
        ...history.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        { role: 'user' as const, content: userMessage },
      ];

      const allToolCalls: ToolCallRecord[] = [];
      let totalTokens = 0;

      // Agentic loop: keep going until we get a final text response
      while (true) {
        const response = await this.client.messages.create({
          model: this.model,
          max_tokens: this.maxTokens,
          temperature: this.temperature,
          system: this.systemPrompt,
          tools: this.claudeTools.length > 0 ? this.claudeTools : undefined,
          messages,
        });

        totalTokens += (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0);

        // If the model wants to use tools
        if (response.stop_reason === 'tool_use') {
          // Collect assistant content blocks
          messages.push({ role: 'assistant', content: response.content });

          // Execute each tool call and build tool results
          const toolResultBlocks: Anthropic.ToolResultBlockParam[] = [];

          for (const block of response.content) {
            if (block.type === 'tool_use') {
              const result = await this.executeTool(
                block.name,
                block.input as Record<string, unknown>,
                context,
              );

              allToolCalls.push({
                toolName: block.name,
                input: block.input as Record<string, unknown>,
                result,
              });

              toolResultBlocks.push({
                type: 'tool_result',
                tool_use_id: block.id,
                content: JSON.stringify(result.success ? result.data : { error: result.error }),
                is_error: !result.success,
              });
            }
          }

          messages.push({ role: 'user', content: toolResultBlocks });
          continue;
        }

        // Extract final text response
        const textBlocks = response.content
          .filter((b): b is Anthropic.TextBlock => b.type === 'text')
          .map((b) => b.text);

        const responseText = textBlocks.join('\n');

        this._totalLatencyMs += Date.now() - startTime;

        return {
          response: responseText,
          toolCalls: allToolCalls,
          tokensUsed: totalTokens,
        };
      }
    } catch (err) {
      this._errorCount++;
      this._totalLatencyMs += Date.now() - startTime;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[${this.name}] Run error:`, message);
      throw err;
    }
  }

  // ─── Run Without Conversation (event-driven agents) ─────────

  /**
   * Process a structured payload (e.g. domain event data) through the agent.
   * Used by non-conversational agents like billing, anomaly detection, etc.
   */
  async process(
    prompt: string,
    context: AgentContext,
  ): Promise<{ response: string; toolCalls: ToolCallRecord[]; tokensUsed: number }> {
    return this.run(prompt, context);
  }

  // ─── Health & Metrics ───────────────────────────────────────

  get health() {
    return {
      name: this.name,
      status: this._errorCount / Math.max(this._totalInvocations, 1) > 0.5
        ? 'unhealthy' as const
        : this._errorCount > 0
          ? 'degraded' as const
          : 'healthy' as const,
      lastActivity: this._lastActivity,
      totalInvocations: this._totalInvocations,
      errorCount: this._errorCount,
      avgLatencyMs: this._totalInvocations > 0
        ? Math.round(this._totalLatencyMs / this._totalInvocations)
        : 0,
    };
  }
}
