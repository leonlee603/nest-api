import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3000'),
  env: process.env.NODE_ENV ?? 'production',
  apiVersion: process.env.API_VERSION ?? '0.1.0',
}));
