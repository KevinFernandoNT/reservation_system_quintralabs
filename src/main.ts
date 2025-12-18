import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for development
  app.enableCors();

  // Set global prefix for all routes
  app.setGlobalPrefix('api/v1');

  // Swagger Configuration
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

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📚 Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
