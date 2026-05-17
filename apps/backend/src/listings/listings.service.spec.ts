import { Test, TestingModule } from '@nestjs/testing';
import { ListingsService } from './listings.service';
import { PrismaService } from '../prisma/prisma.service';
import { OperatorsService } from '../operators/operators.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('ListingsService', () => {
  let service: ListingsService;
  let prisma: PrismaService;
  let operatorsService: OperatorsService;

  const mockPrismaService = {
    listing: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    listingImage: {
      deleteMany: jest.fn(),
    },
  };

  const mockOperatorsService = {
    findByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: OperatorsService, useValue: mockOperatorsService },
      ],
    }).compile();

    service = module.get<ListingsService>(ListingsService);
    prisma = module.get<PrismaService>(PrismaService);
    operatorsService = module.get<OperatorsService>(OperatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ForbiddenException if user is not an operator', async () => {
      mockOperatorsService.findByUserId.mockResolvedValue(null);
      await expect(service.create('userId', {} as any)).rejects.toThrow(ForbiddenException);
    });

    it('should create a listing if user is an operator', async () => {
      const mockOperator = {
        id: 'op1',
        isValidated: true,
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        subscriptionEnd: null,
        subscriptionPlan: 'STARTER',
      };
      const createDto = { title: 'Test Listing', listingType: 'HOTEL_ROOM' as any };
      mockOperatorsService.findByUserId.mockResolvedValue(mockOperator);
      mockPrismaService.listing.create.mockResolvedValue({ id: '1', ...createDto });

      const result = await service.create('userId', createDto as any);

      expect(result.id).toBe('1');
      expect(mockPrismaService.listing.create).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if listing not found', async () => {
      mockPrismaService.listing.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if listing is deleted', async () => {
      mockPrismaService.listing.findUnique.mockResolvedValue({ id: '1', deletedAt: new Date() });
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should return the listing if found and not deleted', async () => {
      const mockListing = { id: '1', deletedAt: null };
      mockPrismaService.listing.findUnique.mockResolvedValue(mockListing);
      const result = await service.findOne('1');
      expect(result).toEqual(mockListing);
    });
  });
});
