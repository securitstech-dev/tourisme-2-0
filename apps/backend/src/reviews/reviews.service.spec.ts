import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChatbotService } from '../chatbot/chatbot.service';
import { NotFoundException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: PrismaService;
  let chatbotService: ChatbotService;

  const mockPrismaService = {
    listing: {
      findUnique: jest.fn(),
    },
    review: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockChatbotService = {
    moderateReview: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ChatbotService, useValue: mockChatbotService },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    prisma = module.get<PrismaService>(PrismaService);
    chatbotService = module.get<ChatbotService>(ChatbotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createReviewDto = {
      listingId: 'listing1',
      rating: 5,
      comment: 'Excellent séjour !',
    };

    it('should throw NotFoundException if listing does not exist', async () => {
      mockPrismaService.listing.findUnique.mockResolvedValue(null);
      await expect(service.create('user1', createReviewDto)).rejects.toThrow(NotFoundException);
    });

    it('should create a review with moderation', async () => {
      mockPrismaService.listing.findUnique.mockResolvedValue({ id: 'listing1' });
      mockChatbotService.moderateReview.mockResolvedValue({ status: 'APPROVED', reason: 'OK' });
      mockPrismaService.review.create.mockResolvedValue({ id: 'rev1', ...createReviewDto });

      const result = await service.create('user1', createReviewDto);

      expect(result.id).toBe('rev1');
      expect(mockChatbotService.moderateReview).toHaveBeenCalledWith(createReviewDto.comment);
      expect(mockPrismaService.review.create).toHaveBeenCalled();
    });
  });

  describe('getByListing', () => {
    it('should return approved reviews for a listing', async () => {
      const mockReviews = [{ id: 'rev1', comment: 'Good' }];
      mockPrismaService.review.findMany.mockResolvedValue(mockReviews);

      const result = await service.getByListing('listing1');

      expect(result).toEqual(mockReviews);
      expect(mockPrismaService.review.findMany).toHaveBeenCalledWith({
        where: { listingId: 'listing1', status: 'APPROVED', isVisible: true },
        include: { author: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
