import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { Timezone } from '../../common/enums/timezone.enum';

export class CreateReservationDto {
    @ApiProperty({ example: '3bbcd28b-b6a3-4b6e-b6a3-b6a3b6a3b6a3' })
    @IsUUID()
    @IsNotEmpty()
    resourceId: string;

    @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ example: '2025-12-18T23:59:59Z' })
    @IsDateString()
    @IsNotEmpty()
    startTime: string;

    @ApiProperty({ example: '2025-12-19T01:59:59Z' })
    @IsDateString()
    @IsNotEmpty()
    endTime: string;

    @ApiProperty({ enum: Timezone, example: Timezone.UTC })
    @IsEnum(Timezone)
    @IsNotEmpty()
    timezone: Timezone;
}
