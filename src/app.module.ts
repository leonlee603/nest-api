import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';
import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';

const ENV = process.env.NODE_ENV ?? 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV === 'production' ? '.env' : `.env.${ENV}`, // Locally use .env for production
      //envFilePath: process.env.VERCEL ? undefined : '.env', // Setup for Vercel
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation,
    }),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        autoLoadEntities: true,
        synchronize: configService.get('database.synchronize'),
      }),
    }),
    UsersModule,
    PostsModule,
    TagsModule,
    MetaOptionsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // Remove properties that are not in the DTO
        transform: true, // Transform the request body to the DTO
        forbidNonWhitelisted: true, // Throw an error if a property that is not in the DTO is sent
        transformOptions: {
          enableImplicitConversion: true, // Convert the request body to the DTO
        },
      }), // Use the ValidationPipe to validate the request body
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
  ],
})
export class AppModule {}
