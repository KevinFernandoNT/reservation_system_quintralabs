import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { ReservationsRepository } from './reservations.repository';
import { ReservationsCleanupService } from './reservations-cleanup.service';

@Module({
    imports: [TypeOrmModule.forFeature([Reservation])],
    controllers: [ReservationsController],
    providers: [
        ReservationsService,
        ReservationsRepository,
        ReservationsCleanupService,
    ],
    exports: [ReservationsService],
})
export class ReservationsModule { }
