import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BcryptProvider } from './providers/bcrypt.provider';
import { ArgonProviderTs } from './providers/argon.provider.ts';

@Module({
  controllers: [AuthController],
  providers: [AuthService, BcryptProvider, ArgonProviderTs],
})
export class AuthModule {}
