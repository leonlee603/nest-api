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
import { GenerateTokenProvider } from './providers/generate-token.provider';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { ActiveUserData } from './interfaces/active-user-data.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private hashingProvider: HashingProvider,
    private generateTokenProvider: GenerateTokenProvider,
    private refreshTokensProvider: RefreshTokensProvider,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.generateTokenProvider.generateTokens(user);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email);
    if (!user || !user.password) {
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

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }

  async signOut(user: ActiveUserData) {
    return await this.usersService.updateRefreshToken(user.sub, null);
  }
}
