import { forwardRef, Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { TokenType } from '../enums/token-type.enum';
import { HashingProvider } from './hashing.provider';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GenerateTokenProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private hashingProvider: HashingProvider,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  // Sign access or refresh token based on payload, access token and refresh token will have different payloads and different expiresIn.
  async signToken<T>(
    userId: string,
    tokenType: TokenType,
    expiresIn: number,
    payload?: T,
  ) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret:
          tokenType === TokenType.ACCESS
            ? this.jwtConfiguration.secret
            : this.jwtConfiguration.refreshSecret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: expiresIn,
      },
    );
  }

  async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      // Generate access token
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        TokenType.ACCESS,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
        },
      ),
      // Generate refresh token
      this.signToken(
        user.id,
        TokenType.REFRESH,
        this.jwtConfiguration.refreshTokenTtl,
      ),
    ]);

    // Hash refresh token and update user's refresh token hash, compare when user generate new access token with refresh token.
    const refreshTokenHash =
      await this.hashingProvider.hashPassword(refreshToken);
    // user.refreshTokenHash = refreshTokenHash;
    await this.usersService.updateRefreshToken(user.id, refreshTokenHash);

    return {
      accessToken,
      refreshToken,
    };
  }
}
