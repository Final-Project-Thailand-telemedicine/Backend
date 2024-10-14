import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v0');
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Medicare API')
    // .setDescription('The cats API description')
    .setVersion('1.0')
    // .addTag('cats')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme();
  const options: SwaggerCustomOptions = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
    swaggerOptions: {
      persistAuthorization: true
    }
  };
  SwaggerModule.setup('swagger', app, document, options);
  await app.listen(3000);
}
bootstrap();
