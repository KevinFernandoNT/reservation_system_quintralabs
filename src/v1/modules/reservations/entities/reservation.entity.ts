import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';
import { Timezone } from '../../../common/enums/timezone.enum';
import { ReservationStatus } from '../enums/reservation-status.enum';

@Entity('reservations')
export class Reservation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: ReservationStatus,
        default: ReservationStatus.PENDING,
    })
    @Index()
    status: ReservationStatus;

    @Column()
    @Index()
    resourceId: string;

    @Column()
    @Index()
    userId: string;

    @Column({ type: "timestamptz" })
    startTime: Date;

    @Column({ type: "timestamptz" })
    endTime: Date;

    @Column()
    timezone: Timezone;

    @CreateDateColumn()
    createdAt: Date;
}
