import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';
import { Timezone } from '../../common/enums/timezone.enum';

@Entity('reservations')
export class Reservation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    resourceId: string;

    @Column()
    @Index()
    userId: string;

    @Column()
    startTime: Date;

    @Column()
    endTime: Date;

    @Column()
    timezone: Timezone;

    @CreateDateColumn()
    createdAt: Date;
}
