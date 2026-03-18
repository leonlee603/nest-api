import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/signin.dto';
import { HashingProvider } from './providers/hashing.provider';
// import { JwtService } from '@nestjs/jwt';
// import jwtConfig from './config/jwt.config';
// import type { ConfigType } from '@nestjs/config';
import { GenerateTokenProvider } from './providers/generate-token.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private hashingProvider: HashingProvider,
    // private jwtService: JwtService,
    // @Inject(jwtConfig.KEY)
    // private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private generateTokenProvider: GenerateTokenProvider,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const passwordMatch = await this.hashingProvider.comparePassword(
      signInDto.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateTokenProvider.generateTokens(user);
  }
}
