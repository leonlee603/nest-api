import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { HashingProvider } from './hashing.provider';
import { UsersService } from '../../users/users.service';
import { GenerateTokenProvider } from './generate-token.provider';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private hashingProvider: HashingProvider,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private generateTokenProvider: GenerateTokenProvider,
  ) {}

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    // Verify refresh token and get user id from payload.
    let payload: { sub: string };
    try {
      payload = await this.jwtService.verifyAsync<{ sub: string }>(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.refreshSecret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Get user from database.
    const user = await this.usersService.findOne(payload.sub);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    // Compare refresh token hash with user's refresh token hash.
    const isRefreshTokenValid = await this.hashingProvider.comparePassword(
      refreshTokenDto.refreshToken,
      user.refreshTokenHash,
    );
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    // Generate new access token and refresh token.
    return this.generateTokenProvider.generateTokens(user);
  }
}
