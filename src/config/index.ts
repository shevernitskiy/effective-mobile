import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  PORT: z.coerce.number().default(3000),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_URL: z.string().refine(
    (value) => {
      try {
        new URL(value);
        return value.startsWith("postgresql://");
      } catch {
        return false;
      }
    },
    { message: "DB_URL must be a valid URL starting with postgresql://" },
  ),
  JWT_SECRET: z.string().min(10, "JWT Secret must be at least 10 chars"),
  JWT_ACCESS_EXP: z.string().regex(/^\d+[smhd]$/, "Must be 1h, 30m, 15d etc."),
  JWT_REFRESH_EXP: z.string().regex(/^\d+[smhd]$/, "Must be 1h, 30m, 15d etc."),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables:");
  _env.error.issues.forEach((issue) => {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  });
  process.exit(1);
}

type MsStringValue = `${number}${"s" | "m" | "h" | "d" | "w" | "M" | "y"}`;

export const config = {
  env: _env.data.NODE_ENV,
  port: _env.data.PORT,
  logLevel: _env.data.LOG_LEVEL,
  db: {
    url: _env.data.DB_URL,
  },
  auth: {
    jwtSecret: _env.data.JWT_SECRET,
    jwtAccessExp: _env.data.JWT_ACCESS_EXP as MsStringValue,
    jwtRefreshExp: _env.data.JWT_REFRESH_EXP as MsStringValue,
  },
} as const;
