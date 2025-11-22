import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupApp } from './core/infrastructure/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  setupApp(app);

  const config = new DocumentBuilder()
    .setTitle('Acme-Unpuchero API')
    .setDescription(
      'API for the Acme-Unpuchero project. A technical assessment for the role of Senior Backend Developer at Tailor.',
    )
    .setVersion('1.0')
    .addTag('Authentication')
    .addTag('Users')
    .addTag('Restaurants')
    .addTag('Reviews')
    .addTag('Statistics')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch(console.error);
