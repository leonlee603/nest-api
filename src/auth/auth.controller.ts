import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignInDto } from './dto/signin.dto';
import { Auth } from './decorator/auth.decorator';
import { AuthType } from './enums/auth-type.enum';

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
}
