import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationParamsDto } from '../../common/pagination/pagination.dto';

export class ReservationFilterDto extends PaginationParamsDto {
    @ApiPropertyOptional({ example: '3bbcd28b-b6a3-4b6e-b6a3-b6a3b6a3b6a3' })
    @IsOptional()
    @IsUUID()
    resourceId?: string;

    @ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
    @IsOptional()
    @IsUUID()
    userId?: string;
}
