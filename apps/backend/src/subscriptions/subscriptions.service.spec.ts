import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsService } from './subscriptions.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../common/mail/mail.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { SubscriptionPlan, PaymentStatus } from '@prisma/client';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let prisma: PrismaService;
  let mailService: MailService;

  const mockPrismaService = {
    operator: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    subscription: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  const mockMailService = {
    sendSubscriptionInvoice: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
    prisma = module.get<PrismaService>(PrismaService);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('subscribe', () => {
    it('should throw NotFoundException if operator not found', async () => {
      mockPrismaService.operator.findUnique.mockResolvedValue(null);
      await expect(service.subscribe('op1', SubscriptionPlan.STARTER)).rejects.toThrow(NotFoundException);
    });

    it('should create a subscription', async () => {
      mockPrismaService.operator.findUnique.mockResolvedValue({ id: 'op1' });
      mockPrismaService.subscription.create.mockResolvedValue({ id: 'sub1' });

      const result = await service.subscribe('op1', SubscriptionPlan.STARTER);

      expect(result.id).toBe('sub1');
      expect(mockPrismaService.subscription.create).toHaveBeenCalled();
    });
  });

  describe('confirmPayment', () => {
    it('should throw NotFoundException if subscription not found', async () => {
      mockPrismaService.subscription.findUnique.mockResolvedValue(null);
      await expect(service.confirmPayment('sub1', 'STRIPE', 'ref1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if subscription already paid', async () => {
      mockPrismaService.subscription.findUnique.mockResolvedValue({ id: 'sub1', paymentStatus: PaymentStatus.PAID });
      await expect(service.confirmPayment('sub1', 'STRIPE', 'ref1')).rejects.toThrow(BadRequestException);
    });

    it('should activate subscription and send invoice email', async () => {
      const mockSub = { 
        id: 'sub1', 
        paymentStatus: PaymentStatus.UNPAID, 
        operatorId: 'op1',
        plan: SubscriptionPlan.STARTER,
        amount: 15000,
        endDate: new Date(),
        operator: { user: { email: 'test@test.com' } }
      };
      mockPrismaService.subscription.findUnique.mockResolvedValue(mockSub);
      mockPrismaService.subscription.update.mockResolvedValue({ ...mockSub, paymentStatus: PaymentStatus.PAID, isActive: true });

      const result = await service.confirmPayment('sub1', 'STRIPE', 'ref1');

      expect(result.isActive).toBe(true);
      expect(mockMailService.sendSubscriptionInvoice).toHaveBeenCalled();
    });
  });
});
