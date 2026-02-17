import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),

  // Auth
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRATION: z.string().default('24h'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),

  // Server
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  // AI
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),

  // CFDI / PAC (Finkok)
  FINKOK_USERNAME: z.string().optional(),
  FINKOK_PASSWORD: z.string().optional(),
  FINKOK_ENVIRONMENT: z.enum(['sandbox', 'production']).default('sandbox'),

  // WhatsApp
  WHATSAPP_API_URL: z.string().url().optional(),
  WHATSAPP_API_KEY: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),

  // Twilio
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),

  // WhatsApp (webhook verification)
  WHATSAPP_APP_SECRET: z.string().optional(),
  WHATSAPP_VERIFY_TOKEN: z.string().optional(),

  // Payments (Conekta)
  CONEKTA_API_KEY: z.string().optional(),
  CONEKTA_PRIVATE_KEY: z.string().optional(),
  SPEI_CLABE: z.string().optional(),

  // Chatwoot (AGORA)
  CHATWOOT_BASE_URL: z.string().url().optional(),
  CHATWOOT_API_TOKEN: z.string().optional(),
  CHATWOOT_ACCOUNT_ID: z.coerce.number().int().positive().optional(),
  CHATWOOT_WEBHOOK_TOKEN: z.string().optional(),

  // Google Maps
  GOOGLE_MAPS_API_KEY: z.string().optional(),

  // Storage (S3-compatible)
  S3_BUCKET: z.string().default('supra-water-files'),
  S3_ENDPOINT: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),

  // Monitoring
  SENTRY_DSN: z.string().url().optional().or(z.literal('')),

  // n8n
  N8N_WEBHOOK_BASE_URL: z.string().url().optional(),
  N8N_API_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment variables:');
    for (const issue of result.error.issues) {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
  }
  return result.data;
}

export const env = loadEnv();
