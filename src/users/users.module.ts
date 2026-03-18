import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';
import { FindOneByGoogleIdProvider } from './providers/find-one-by-google-id.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateGoogleUserProvider,
    FindOneByGoogleIdProvider,
  ],
  exports: [UsersService],
})
export class UsersModule {}
