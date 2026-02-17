import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema/*.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://supra:supra@localhost:5432/supra_water',
  },
  verbose: true,
  strict: true,
});
