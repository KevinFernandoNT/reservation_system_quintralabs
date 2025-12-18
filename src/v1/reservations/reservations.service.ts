import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationFilterDto } from './dto/reservations-filter.dto';
import { ReservationsRepository } from './reservations.repository';
import { Reservation } from './entities/reservation.entity';
import { PaginatedResponseDto } from '../common/pagination/pagination.dto';
import { LessThan, MoreThan } from 'typeorm';
import { fromZonedTime } from 'date-fns-tz';

@Injectable()
export class ReservationsService {
    constructor(private readonly reservationsRepository: ReservationsRepository) { }

    async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
        const { resourceId, startTime, endTime, userId, timezone } = createReservationDto;

        // Convert provided local times to UTC using the specified timezone
        const start = fromZonedTime(startTime, timezone);
        const end = fromZonedTime(endTime, timezone);

        if (start >= end) {
            throw new ConflictException('Start time must be before end time');
        }

        const reservation = this.reservationsRepository.create({
            resourceId,
            userId,
            startTime: start,
            endTime: end,
            timezone,
        });

        return await this.reservationsRepository.save(reservation);
    }

    async findAll(
        filterDto: ReservationFilterDto,
    ): Promise<PaginatedResponseDto<Reservation>> {
        const { resourceId, page = 1, limit = 10 } = filterDto;
        const skip = (page - 1) * limit;

        const query = this.reservationsRepository.createQueryBuilder('reservation');

        if (resourceId) {
            query.andWhere('reservation.resourceId = :resourceId', { resourceId });
        }

        query.skip(skip).take(limit).orderBy('reservation.createdAt', 'DESC');

        const [data, total] = await query.getManyAndCount();

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string): Promise<Reservation> {
        const reservation = await this.reservationsRepository.findOne({ where: { id } });
        if (!reservation) {
            throw new NotFoundException(`Reservation with ID ${id} not found`);
        }
        return reservation;
    }

    async remove(id: string): Promise<void> {
        const result = await this.reservationsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Reservation with ID ${id} not found`);
        }
    }
}
