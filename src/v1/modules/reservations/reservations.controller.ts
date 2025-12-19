import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationFilterDto } from './dto/reservations-filter.dto';
import { Reservation } from './entities/reservation.entity';
import { PaginatedResponseDto } from '../../common/pagination/pagination.dto';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new reservation' })
    @ApiResponse({ status: 201, description: 'Reservation created', type: Reservation })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 409, description: 'Conflict - Slot already taken' })
    create(@Body() createReservationDto: CreateReservationDto): Promise<Reservation> {
        return this.reservationsService.create(createReservationDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all reservations with filtering and pagination' })
    @ApiResponse({ status: 200, description: 'Return paginated reservations' })
    findAll(
        @Query() filterDto: ReservationFilterDto,
    ): Promise<PaginatedResponseDto<Reservation>> {
        return this.reservationsService.findAll(filterDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single reservation by ID' })
    @ApiResponse({ status: 200, description: 'Return reservation details' })
    @ApiResponse({ status: 404, description: 'Reservation not found' })
    findOne(@Param('id') id: string): Promise<Reservation> {
        return this.reservationsService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Cancel a reservation' })
    @ApiResponse({ status: 200, description: 'Reservation canceled' })
    @ApiResponse({ status: 404, description: 'Reservation not found' })
    remove(@Param('id') id: string): Promise<string> {
        return this.reservationsService.remove(id);
    }
}
