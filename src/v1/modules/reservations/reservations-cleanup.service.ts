import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReservationsService } from './reservations.service';

@Injectable()
export class ReservationsCleanupService {
    private readonly logger = new Logger(ReservationsCleanupService.name);

    constructor(private readonly reservationsService: ReservationsService) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async handleCleanup() {
        this.logger.debug('Running background cleanup for expired reservations...');

        try {
            const affected = await this.reservationsService.cleanupExpiredReservations();
            if (affected > 0) {
                this.logger.log(`Successfully cleaned up ${affected} expired reservations.`);
            }
        } catch (error) {
            this.logger.error('Failed to run background cleanup', error.stack);
        }
    }
}
