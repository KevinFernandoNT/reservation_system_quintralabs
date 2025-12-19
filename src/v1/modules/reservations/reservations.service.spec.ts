import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { ReservationsRepository } from './reservations.repository';
import { ReservationStatus } from './enums/reservation-status.enum';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

describe('ReservationsService', () => {
    let service: ReservationsService;
    let repository: ReservationsRepository;

    const mockReservationsRepository = {
        manager: {
            transaction: jest.fn(),
        },
        findOne: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnValue({
            andWhere: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn(),
            update: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn(),
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReservationsService,
                {
                    provide: ReservationsRepository,
                    useValue: mockReservationsRepository,
                },
            ],
        }).compile();

        service = module.get<ReservationsService>(ReservationsService);
        repository = module.get<ReservationsRepository>(ReservationsRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a reservation successfully', async () => {
            const dto = {
                resourceId: 'c1f75ba3-de73-48a2-afe3-7687d11022a1',
                userId: 'user-1',
                startTime: '2025-12-19T10:00:00Z',
                endTime: '2025-12-19T11:00:00Z',
                timezone: 'UTC' as any,
            };

            const expectedReservation = { id: 'uuid', ...dto };
            mockReservationsRepository.manager.transaction.mockImplementation(async (cb) => {
                const mockManager = {
                    create: jest.fn().mockReturnValue(expectedReservation),
                    save: jest.fn().mockReturnValue(expectedReservation),
                };
                return cb(mockManager);
            });

            const result = await service.create(dto);
            expect(result).toEqual(expectedReservation);
        });

        it('should throw ConflictException if startTime >= endTime', async () => {
            const dto = {
                resourceId: '9d92a10b-ff5a-4f44-93b2-3c99a5106d26',
                userId: 'user-1',
                startTime: '2025-12-19T11:00:00Z',
                endTime: '2025-12-19T10:00:00Z',
                timezone: 'UTC' as any,
            };

            await expect(service.create(dto)).rejects.toThrow(ConflictException);
        });
    });

    describe('findOne', () => {
        it('should return a reservation if valid UUID and exists', async () => {
            const id = '3bbcd28b-b6a3-4b6e-b6a3-b6a3b6a3b6a3';
            const reservation = { id };
            mockReservationsRepository.findOne.mockResolvedValue(reservation);

            const result = await service.findOne(id);
            expect(result).toEqual(reservation);
        });

        it('should throw BadRequestException if invalid UUID', async () => {
            await expect(service.findOne('invalid-uuid')).rejects.toThrow(BadRequestException);
        });

        it('should throw NotFoundException if reservation does not exist', async () => {
            const id = '3bbcd28b-b6a3-4b6e-b6a3-b6a3b6a3b6a3';
            mockReservationsRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should cancel a reservation (soft-delete)', async () => {
            const id = '3bbcd28b-b6a3-4b6e-b6a3-b6a3b6a3b6a3';
            const reservation = { id, status: ReservationStatus.PENDING };
            jest.spyOn(service, 'findOne').mockResolvedValue(reservation as any);

            const result = await service.remove(id);
            expect(reservation.status).toBe(ReservationStatus.CANCELLED);
            expect(repository.save).toHaveBeenCalledWith(reservation);
            expect(result).toBe('Reservation Cancelled Successfully');
        });
    });
});
