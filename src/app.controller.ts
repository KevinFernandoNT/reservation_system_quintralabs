import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ summary: 'Health check', description: 'Returns a simple greeting message to verify the API is running' })
  @ApiResponse({ status: 200, description: 'API is healthy and running', schema: { example: 'Hello World!' } })
  getHello(): string {
    return this.appService.getHello();
  }
}
