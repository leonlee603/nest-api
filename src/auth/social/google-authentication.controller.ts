import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthenticationService } from './providers/google-authentication.service';
import { GoogleTokenDto } from './dot/google-token.dto';
import { AuthType } from '../enums/auth-type.enum';
import { Auth } from '../decorator/auth.decorator';

@Auth(AuthType.NONE)
@Controller('auth/google-authentication')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  // This endpoint is used to authenticate a user with Google account.
  @Post()
  async authenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return await this.googleAuthenticationService.authenticate(googleTokenDto);
  }
}
