import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'root',
        database: 'nest-api',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    PostsModule,
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
  ],
})
export class AppModule {}
