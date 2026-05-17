import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should find user by email', async () => {
      const mockUser = { id: '1', email: 'test@test.com' };
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.findOne('test@test.com');
      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
        include: { operator: true },
      });
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const userData = { email: 'new@test.com', firstName: 'A', lastName: 'B' };
      mockPrismaService.user.create.mockResolvedValue({ id: '1', ...userData });
      const result = await service.create(userData as any);
      expect(result.id).toBe('1');
    });
  });
});
