import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthenticationService } from './providers/google-authentication.service';
import { GoogleTokenDto } from './dot/google-token.dto';
import { AuthType } from '../enums/auth-type.enum';
import { Auth } from '../decorator/auth.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Auth(AuthType.NONE)
@Controller('auth/google-authentication')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
  ) {}

  // This endpoint is used to authenticate a user with Google account.
  @Post()
  // Swagger documentation
  @ApiOperation({
    summary: 'Authenticate a user with Google account',
    description: 'Authenticate a user with Google account',
  })
  @ApiResponse({
    status: 201,
    description:
      'The user has been successfully authenticated with Google account.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  async authenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return await this.googleAuthenticationService.authenticate(googleTokenDto);
  }
}
