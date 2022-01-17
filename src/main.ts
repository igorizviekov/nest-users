import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription('CRUD & auth')
    //security options swagger
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        description: 'Enter JWT token',
        bearerFormat: 'Token',
        name: 'access-token',
      },
      'access-token'
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
