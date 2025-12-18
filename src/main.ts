import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './v1/common/filters/http-exception.filter';
import { TransformInterceptor } from './v1/common/interceptors/transform.interceptor';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // ... existing configuration logic ...
    const nodeEnv = configService.get<string>('nodeEnv');
    const port = configService.get<number>('port') || 3000;
    const swaggerEnabled = configService.get<boolean>('swagger.enabled');
    const corsOrigin = configService.get<string>('cors.origin') || '*';

    // ... security and middleware ...
    if (nodeEnv === 'production') {
      app.use(helmet());
    }
    app.use(compression());
    app.enableCors({
      origin: corsOrigin === '*' ? '*' : corsOrigin.split(','),
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    app.setGlobalPrefix('api/v1');

    if (swaggerEnabled) {
      const config = new DocumentBuilder()
        .setTitle('Reservation System API')
        .setDescription(
          'RESTful API for managing hotel/restaurant reservations, guests, and bookings',
        )
        .setVersion('1.0')
        .setContact(
          'Source Code',
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

    app.enableShutdownHooks();

    await app.listen(port);

    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`📦 Environment: ${nodeEnv}`);
    if (swaggerEnabled) {
      console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
    }
  } catch (error) {
    console.error('❌ Error during application bootstrap:');
    console.error(error);
    process.exit(1);
  }
}
bootstrap();
