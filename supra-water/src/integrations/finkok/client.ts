// =============================================================
// Finkok PAC API Client — SUPRA Water 2026 §7.1
// =============================================================

export interface FinkokConfig {
  username: string;
  password: string;
  environment: 'sandbox' | 'production';
  /** Override base URL (useful for testing) */
  baseUrl?: string;
  /** Max retries on transient failures (default: 3) */
  maxRetries?: number;
  /** Request timeout in ms (default: 30_000) */
  timeoutMs?: number;
}

const BASE_URLS = {
  sandbox: 'https://demo-facturacion.finkok.com',
  production: 'https://facturacion.finkok.com',
} as const;

export interface FinkokResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    incidencias?: FinkokIncidencia[];
  };
}

export interface FinkokIncidencia {
  IdIncidencia: string;
  MensajeIncidencia: string;
  CodigoError: string;
  ExtraInfo?: string;
}

export class FinkokClient {
  private readonly baseUrl: string;
  private readonly username: string;
  private readonly password: string;
  private readonly maxRetries: number;
  private readonly timeoutMs: number;

  constructor(config: FinkokConfig) {
    this.baseUrl = config.baseUrl ?? BASE_URLS[config.environment];
    this.username = config.username;
    this.password = config.password;
    this.maxRetries = config.maxRetries ?? 3;
    this.timeoutMs = config.timeoutMs ?? 30_000;
  }

  /**
   * Make an authenticated request to Finkok with retry + exponential backoff.
   */
  async request<T>(
    path: string,
    body: string,
    options?: { method?: string },
  ): Promise<FinkokResponse<T>> {
    const url = `${this.baseUrl}${path}`;
    const method = options?.method ?? 'POST';

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 10_000);
        const jitter = Math.random() * delay * 0.1;
        await sleep(delay + jitter);
        console.log(`[finkok] Retry ${attempt}/${this.maxRetries} for ${path}`);
      }

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeoutMs);

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'text/xml; charset=utf-8',
          },
          body,
          signal: controller.signal,
        });

        clearTimeout(timer);

        const text = await response.text();

        console.log(
          `[finkok] ${method} ${path} -> ${response.status} (${text.length} bytes)`,
        );

        if (!response.ok) {
          if (response.status >= 500 || response.status === 429) {
            lastError = new Error(
              `Finkok ${response.status}: ${text.substring(0, 200)}`,
            );
            continue; // retry on server errors and rate limits
          }
          return {
            success: false,
            error: {
              code: `HTTP_${response.status}`,
              message: text.substring(0, 500),
            },
          };
        }

        // Return raw XML text; callers parse specific responses
        return {
          success: true,
          data: text as unknown as T,
        };
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (lastError.name === 'AbortError') {
          lastError = new Error(`Finkok request timed out after ${this.timeoutMs}ms`);
        }
        // Network errors are retryable
        continue;
      }
    }

    return {
      success: false,
      error: {
        code: 'MAX_RETRIES_EXCEEDED',
        message: lastError?.message ?? 'Request failed after all retries',
      },
    };
  }

  /**
   * Build a SOAP envelope with Finkok credentials.
   */
  buildSoapEnvelope(operation: string, innerXml: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:stamp="http://facturacion.finkok.com/stamp"
  xmlns:cancel="http://facturacion.finkok.com/cancel">
  <soapenv:Body>
    <${operation}>
      <username>${escapeXml(this.username)}</username>
      <password>${escapeXml(this.password)}</password>
      ${innerXml}
    </${operation}>
  </soapenv:Body>
</soapenv:Envelope>`;
  }
}

// ---- Helpers ----

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export { escapeXml, sleep };
