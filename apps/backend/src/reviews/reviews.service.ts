import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatbotService } from '../chatbot/chatbot.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private chatbotService: ChatbotService,
  ) {}

  async create(userId: string, dto: CreateReviewDto) {
    // 1. Vérifier si l'annonce existe
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
    });

    if (!listing) {
      throw new NotFoundException('Annonce non trouvée');
    }

    // 2. Modération automatique par Kongo
    const moderation = await this.chatbotService.moderateReview(dto.comment);

    // 3. Création de l'avis
    return this.prisma.review.create({
      data: {
        listingId: dto.listingId,
        authorId: userId,
        rating: dto.rating,
        comment: dto.comment,
        status: moderation.status,
        moderationComment: moderation.reason,
        isVisible: moderation.status === 'APPROVED',
      },
    });
  }

  async getByListing(listingId: string) {
    return this.prisma.review.findMany({
      where: { 
        listingId,
        status: 'APPROVED',
        isVisible: true
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getForOperator(operatorId: string) {
    return this.prisma.review.findMany({
      where: {
        listing: {
          operatorId
        }
      },
      include: {
        listing: {
          select: { title: true }
        },
        author: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
