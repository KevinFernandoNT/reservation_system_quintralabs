import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { ReservationsRepository } from './reservations.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Reservation])],
    controllers: [ReservationsController],
    providers: [ReservationsService, ReservationsRepository],
    exports: [ReservationsService],
})
export class ReservationsModule { }
