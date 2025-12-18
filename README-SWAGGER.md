# Swagger API Documentation

This project uses [Swagger/OpenAPI](https://swagger.io/) to provide interactive API documentation.

## Accessing Swagger UI

Once the application is running, you can access the Swagger UI at:

**Local Development:** [http://localhost:3000/api](http://localhost:3000/api)

The OpenAPI JSON schema is available at: [http://localhost:3000/api-json](http://localhost:3000/api-json)

## Features

- 📚 **Interactive Documentation**: Test API endpoints directly from the browser
- 🔍 **Schema Validation**: View request/response schemas and data types
- 🏷️ **Organized by Tags**: Endpoints grouped by functionality (Health, Reservations, Guests, Rooms)
- 🌐 **Multiple Environments**: Switch between local and production servers
- 📝 **Auto-generated**: Documentation updates automatically as you add decorators

## Adding Documentation to New Endpoints

When creating new controllers or endpoints, use these Swagger decorators:

### Controller-Level Decorators

```typescript
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Reservations')  // Groups endpoints under a tag
@Controller('reservations')
export class ReservationsController {
  // ... endpoints
}
```

### Endpoint-Level Decorators

```typescript
import { Get, Post, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@Get(':id')
@ApiOperation({ 
  summary: 'Get reservation by ID',
  description: 'Retrieves a single reservation using its unique identifier'
})
@ApiParam({ 
  name: 'id', 
  type: 'string', 
  description: 'Reservation ID',
  example: '123e4567-e89b-12d3-a456-426614174000'
})
@ApiResponse({ 
  status: 200, 
  description: 'Reservation found',
  type: ReservationDto  // Reference to DTO class
})
@ApiResponse({ 
  status: 404, 
  description: 'Reservation not found'
})
getReservation(@Param('id') id: string) {
  // ... implementation
}
```

### DTO Decorators

Document your Data Transfer Objects (DTOs) for request/response schemas:

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({
    description: 'Guest name',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100
  })
  guestName: string;

  @ApiProperty({
    description: 'Check-in date',
    example: '2024-01-15',
    type: 'string',
    format: 'date'
  })
  checkInDate: string;

  @ApiProperty({
    description: 'Number of guests',
    example: 2,
    minimum: 1,
    maximum: 10
  })
  numberOfGuests: number;

  @ApiProperty({
    description: 'Special requests',
    example: 'Non-smoking room',
    required: false
  })
  specialRequests?: string;
}
```

## Common Decorators Reference

| Decorator | Purpose | Usage |
|-----------|---------|-------|
| `@ApiTags()` | Group endpoints by category | Controller level |
| `@ApiOperation()` | Describe endpoint purpose | Method level |
| `@ApiResponse()` | Document response status/schema | Method level |
| `@ApiParam()` | Document path parameters | Method level |
| `@ApiQuery()` | Document query parameters | Method level |
| `@ApiBody()` | Document request body | Method level |
| `@ApiProperty()` | Document DTO properties | DTO class properties |
| `@ApiHeader()` | Document required headers | Method level |
| `@ApiBearerAuth()` | Mark endpoint as requiring JWT | Method level |

## Best Practices

1. **Always add `@ApiTags()`** to controllers for better organization
2. **Use `@ApiOperation()`** with clear summaries and descriptions
3. **Document all response codes** with `@ApiResponse()`
4. **Add examples** to `@ApiProperty()` decorators in DTOs
5. **Keep descriptions concise** but informative
6. **Use DTOs** instead of inline schemas for better reusability
7. **Document error responses** (400, 404, 500, etc.)

## Configuration

The Swagger configuration is located in `src/main.ts`:

```typescript
const config = new DocumentBuilder()
  .setTitle('Reservation System API')
  .setDescription('RESTful API for managing hotel/restaurant reservations')
  .setVersion('1.0')
  .setContact('QuintraLabs', 'https://github.com/...', 'support@quintralabs.com')
  .addTag('Health', 'Health check endpoints')
  .addTag('Reservations', 'Reservation management endpoints')
  // ... more tags
  .build();
```

## Customization

You can customize the Swagger UI appearance in `src/main.ts`:

```typescript
SwaggerModule.setup('api', app, document, {
  customSiteTitle: 'Reservation System API Docs',
  customfavIcon: 'https://nestjs.com/img/logo-small.svg',
  customCss: '.swagger-ui .topbar { display: none }',  // Hide top bar
});
```

## Resources

- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
