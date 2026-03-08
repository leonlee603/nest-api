import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure the Swagger UI
  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('Nest API description')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local')
    // .addServer('https://api.nestjs.com', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Set 'api' as the path for the Swagger UI

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
