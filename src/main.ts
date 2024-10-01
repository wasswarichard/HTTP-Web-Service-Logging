import 'dotenv-defaults/config';

const mandatoryEnvironmentVariables = [
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_USERNAME',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
  'JWT_SECRET',
];
const missingEnvironmentVariables = mandatoryEnvironmentVariables.filter(
  (variable) => !process.env[variable],
);
if (missingEnvironmentVariables.length > 0) {
  console.error(
    `Environment Variables [${missingEnvironmentVariables.join(',')}] not defined, terminating ...`,
  );
  process.exit(1);
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = parseInt(<string>process.env.PORT) || 3000;
  const app = await NestFactory.create(AppModule);

  // api prefixing
  app.setGlobalPrefix('api', { exclude: [''] });

  // swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('Web service Api')
    .setDescription('The web service API description')
    .setVersion('1.0')
    .addTag('Webservice')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  await app.listen(PORT);
}
bootstrap();
