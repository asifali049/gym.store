import { plainToInstance } from 'class-transformer';
import { IsString, IsOptional, IsNumberString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsOptional()
  @IsNumberString()
  PORT?: string;

  @IsOptional()
  @IsString()
  CORS_ORIGIN?: string;
}

// Fails fast at boot with a clear message instead of a confusing runtime crash
// later (e.g. "Cannot read properties of undefined" deep inside Prisma).
export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    const messages = errors.map((e) => Object.values(e.constraints ?? {}).join(', ')).join('\n');
    throw new Error(`Invalid environment configuration:\n${messages}`);
  }

  return validated;
}
