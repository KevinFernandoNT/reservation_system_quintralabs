import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationsRepository extends Repository<Reservation> {
    constructor(private dataSource: DataSource) {
        super(Reservation, dataSource.createEntityManager());
    }
}
