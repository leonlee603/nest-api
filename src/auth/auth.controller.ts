import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignInDto } from './dto/signin.dto';
import { Auth } from './decorator/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ActiveUser } from './decorator/active-user.decorator';
import type { ActiveUserData } from './interfaces/active-user-data.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @Auth(AuthType.NONE)
  // Swagger documentation
  @ApiOperation({
    summary: 'Sign up a user',
    description: 'Sign up a user',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully signed up.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('sign-in')
  @Auth(AuthType.NONE)
  @HttpCode(HttpStatus.OK)
  // Swagger documentation
  @ApiOperation({
    summary: 'Sign in a user',
    description: 'Sign in a user',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully signed in.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  // Regenerate access token using refresh token
  @Post('refresh-token')
  @Auth(AuthType.NONE)
  @HttpCode(HttpStatus.OK)
  // Swagger documentation
  @ApiOperation({
    summary: 'Refresh a token',
    description: 'Regenerate access token using refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'The access token has been successfully regenerated.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  // Sign out a user
  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  // Swagger documentation
  @ApiOperation({
    summary: 'Sign out a user',
    description: 'Sign out a user',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully signed out.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  signOut(@ActiveUser() user: ActiveUserData) {
    return this.authService.signOut(user);
  }
}
