import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
    HealthCheckService,
    HealthCheck,
    MemoryHealthIndicator,
    DiskHealthIndicator,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private memory: MemoryHealthIndicator,
        private disk: DiskHealthIndicator,
        private db: TypeOrmHealthIndicator,
    ) { }

    @Get()
    @HealthCheck()
    @ApiOperation({
        summary: 'Health check',
        description: 'Returns the health status of the application including memory and disk usage'
    })
    @ApiResponse({
        status: 200,
        description: 'Application is healthy',
        schema: {
            example: {
                status: 'ok',
                info: {
                    memory_heap: { status: 'up' },
                    memory_rss: { status: 'up' },
                    storage: { status: 'up' }
                },
                error: {},
                details: {
                    memory_heap: { status: 'up' },
                    memory_rss: { status: 'up' },
                    storage: { status: 'up' }
                }
            }
        }
    })
    @ApiResponse({ status: 503, description: 'Application is unhealthy' })
    check() {
        return this.health.check([
            // Check if heap memory usage is below 300MB
            () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
            // Check if RSS memory usage is below 500MB
            () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024),
            // Check if disk storage is below 99% usage (Windows compatible path)
            () => this.disk.checkStorage('storage', { path: 'C:/', thresholdPercent: 0.99 }),
            // Check if database is responding
            () => this.db.pingCheck('database'),
        ]);
    }
}
