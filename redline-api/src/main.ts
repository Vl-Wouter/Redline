import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedocModule } from 'nestjs-redoc';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const port = 4000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: /localhost/,
  });

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Redline API')
    .setDescription('API for Redline, Bachelor Thesis by Wouter Vlaeyen')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const redocOptions = {
    title: 'Redline API',
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
  };

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  await RedocModule.setup('docs', app, document, redocOptions);

  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
