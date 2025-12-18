import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Get configuration
  const nodeEnv = configService.get<string>('nodeEnv');
  const port = configService.get<number>('port') || 3000;
  const swaggerEnabled = configService.get<boolean>('swagger.enabled');
  const corsOrigin = configService.get<string>('cors.origin') || '*';

  // Security middleware (production)
  if (nodeEnv === 'production') {
    app.use(helmet());
  }

  // Compression middleware
  app.use(compression());

  // CORS configuration
  app.enableCors({
    origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Set global prefix for all routes
  app.setGlobalPrefix('api/v1');

  // Swagger Configuration (conditional based on environment)
  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('Reservation System API')
      .setDescription(
        'RESTful API for managing hotel/restaurant reservations, guests, and bookings',
      )
      .setVersion('1.0')
      .setContact(
        'QuintraLabs',
        'https://github.com/KevinFernandoNT/reservation_system_quintralabs',
        'support@quintralabs.com',
      )
      .addTag('Health', 'Health check endpoints')
      .addTag('Reservations', 'Reservation management endpoints')
      .addTag('Guests', 'Guest management endpoints')
      .addTag('Rooms', 'Room management endpoints')
      .addServer('http://localhost:3000', 'Local Development Server')
      .addServer('https://api.reservation.com', 'Production Server')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      customSiteTitle: 'Reservation System API Docs',
      customfavIcon: 'https://nestjs.com/img/logo-small.svg',
      customCss: '.swagger-ui .topbar { display: none }',
    });
  }

  // Graceful shutdown
  app.enableShutdownHooks();

  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📦 Environment: ${nodeEnv}`);
  if (swaggerEnabled) {
    console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
  }
}
bootstrap();
