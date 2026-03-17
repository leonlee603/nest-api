import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/signin.dto';
import { HashingProvider } from './providers/hashing.provider';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import type { ActiveUserData } from './interfaces/active-user-data.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private hashingProvider: HashingProvider,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
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

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      } as ActiveUserData,
      {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );
    return {
      accessToken,
    };
  }
}
