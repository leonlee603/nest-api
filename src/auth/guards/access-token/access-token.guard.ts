import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import type { Request } from 'express';
import { REQUEST_USER_KEY } from '../../constants/auth.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token, this.jwtConfiguration);
      request[REQUEST_USER_KEY] = payload; // request.user = {sub: string, email: string}
      // console.log(payload);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // Authorization: Bearer <token>
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
