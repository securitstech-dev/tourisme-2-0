import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { MtnMomoProvider } from './providers/mtn-momo.provider';
import { AirtelMomoProvider } from './providers/airtel-momo.provider';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../common/mail/mail.service';
import { NotFoundException } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: PrismaService;
  let mtnMomo: MtnMomoProvider;
  let airtelMomo: AirtelMomoProvider;

  const mockPrismaService = {
    reservation: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    payment: {
      create: jest.fn(),
    },
  };

  const mockMtnMomo = {
    processPayment: jest.fn(),
  };

  const mockAirtelMomo = {
    processPayment: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('mock_key'),
  };

  const mockMailService = {
    sendBookingConfirmation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: MtnMomoProvider, useValue: mockMtnMomo },
        { provide: AirtelMomoProvider, useValue: mockAirtelMomo },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prisma = module.get<PrismaService>(PrismaService);
    mtnMomo = module.get<MtnMomoProvider>(MtnMomoProvider);
    airtelMomo = module.get<AirtelMomoProvider>(AirtelMomoProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initiateMobilePayment', () => {
    it('should throw NotFoundException if reservation not found', async () => {
      mockPrismaService.reservation.findUnique.mockResolvedValue(null);
      await expect(service.initiateMobilePayment('res1', '060000000')).rejects.toThrow(NotFoundException);
    });

    it('should use MtnMomoProvider for MTN numbers', async () => {
      const mockRes = { id: 'res1', totalPrice: 1000, listing: { title: 'Test' } };
      mockPrismaService.reservation.findUnique.mockResolvedValue(mockRes);
      mockMtnMomo.processPayment.mockResolvedValue({ success: true, transactionId: 'tx1', status: 'SUCCESS' });
      mockPrismaService.reservation.update.mockResolvedValue({ ...mockRes, tourist: { email: 't@t.com' } });

      await service.initiateMobilePayment('res1', '060000000');

      expect(mockMtnMomo.processPayment).toHaveBeenCalled();
      expect(mockPrismaService.payment.create).toHaveBeenCalled();
    });

    it('should use AirtelMomoProvider for Airtel numbers', async () => {
      const mockRes = { id: 'res1', totalPrice: 1000, listing: { title: 'Test' } };
      mockPrismaService.reservation.findUnique.mockResolvedValue(mockRes);
      mockAirtelMomo.processPayment.mockResolvedValue({ success: true, transactionId: 'tx1', status: 'SUCCESS' });
      mockPrismaService.reservation.update.mockResolvedValue({ ...mockRes, tourist: { email: 't@t.com' } });

      await service.initiateMobilePayment('res1', '050000000');

      expect(mockAirtelMomo.processPayment).toHaveBeenCalled();
    });
  });
});
