import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from '../../config/jwt.config';
import { GoogleTokenDto } from '../dot/google-token.dto';
import { UsersService } from '../../../users/users.service';
import { GenerateTokenProvider } from '../../providers/generate-token.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private googleClient: OAuth2Client;

  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private generateTokenProvider: GenerateTokenProvider,
  ) {}

  onModuleInit() {
    this.googleClient = new OAuth2Client(
      this.jwtConfiguration.googleClientId,
      this.jwtConfiguration.googleClientSecret,
    );
  }

  async authenticate(googleTokenDto: GoogleTokenDto) {
    // Verify Google token sent by user.
    const ticket = await this.googleClient.verifyIdToken({
      idToken: googleTokenDto.token,
      audience: this.jwtConfiguration.googleClientId,
    });
    // Extract payload from token.
    const {
      email,
      name,
      sub: googleId,
    } = ticket.getPayload() as { email: string; name: string; sub: string };
    // Check if user exists in database (user with same googleId).
    const user = await this.usersService.findOneByGoogleId(googleId);
    // If user exists, generate and return access token and refresh token.
    if (user) {
      return await this.generateTokenProvider.generateTokens(user);
    }
    // If user does not exist, create user and generate and return access token and refresh token.
    const newUser = await this.usersService.createGoogleUser({
      email,
      name,
      googleId,
    });
    return await this.generateTokenProvider.generateTokens(newUser);
    // Return access token and refresh token.
  }
}
