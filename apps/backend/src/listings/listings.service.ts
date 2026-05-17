import { Injectable, NotFoundException, ForbiddenException, Logger, BadRequestException } from '@nestjs/common';
import { BusinessType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { OperatorsService } from '../operators/operators.service';
import { isTrialActive, SUBSCRIPTION_RULES } from '../common/business-rules';

@Injectable()
export class ListingsService {
  private readonly logger = new Logger(ListingsService.name);

  constructor(
    private prisma: PrismaService,
    private operatorsService: OperatorsService,
  ) {}

  private readonly demoListings = [
    {
      id: 'demo-odzala',
      title: 'Sejour nature au parc national Odzala-Kokoua',
      description: 'Immersion accompagnee dans une reserve mythique du Nord Congo.',
      listingType: 'EXCURSION',
      pricePerNight: null,
      pricePerPerson: 85000,
      priceFlatRate: null,
      currency: 'XAF',
      capacity: 8,
      isAvailable: true,
      isFeatured: true,
      amenities: ['Guide local', 'Transport', 'Dejeuner'],
      rating: 4.9,
      reviewCount: 42,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
      deletedAt: null,
      operator: {
        id: 'demo-operator-odzala',
        businessName: 'Odzala Experience',
        businessType: 'TOURIST_SITE',
        city: 'Odzala',
        region: 'Cuvette-Ouest',
        latitude: 0.796,
        longitude: 14.825,
      },
      images: [{ id: 'demo-img-odzala', url: '/hero-odzala-placeholder.png', altText: 'Foret tropicale a Odzala', order: 0 }],
    },
    {
      id: 'demo-pointe-noire',
      title: 'Week-end ocean a Pointe-Noire',
      description: 'Hotel, plage et gastronomie locale pour un sejour fluide sur la cote.',
      listingType: 'HOTEL_ROOM',
      pricePerNight: 65000,
      pricePerPerson: null,
      priceFlatRate: null,
      currency: 'XAF',
      capacity: 2,
      isAvailable: true,
      isFeatured: true,
      amenities: ['Wi-Fi', 'Petit-dejeuner', 'Vue ocean'],
      rating: 4.8,
      reviewCount: 31,
      createdAt: new Date('2026-01-02T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
      deletedAt: null,
      operator: {
        id: 'demo-operator-pointe-noire',
        businessName: 'Atlantic Lodge',
        businessType: 'HOTEL',
        city: 'Pointe-Noire',
        region: 'Kouilou',
        latitude: -4.769,
        longitude: 11.866,
      },
      images: [{ id: 'demo-img-pointe-noire', url: '/hero-pointe-noire-placeholder.png', altText: 'Littoral de Pointe-Noire', order: 0 }],
    },
    {
      id: 'demo-brazzaville',
      title: 'Circuit culturel a Brazzaville',
      description: 'Musees, fleuve Congo, artisanat et bonnes adresses en ville.',
      listingType: 'LEISURE_ACTIVITY',
      pricePerNight: null,
      pricePerPerson: null,
      priceFlatRate: 45000,
      currency: 'XAF',
      capacity: 12,
      isAvailable: true,
      isFeatured: true,
      amenities: ['Guide', 'Transport urbain', 'Musees'],
      rating: 4.7,
      reviewCount: 26,
      createdAt: new Date('2026-01-03T00:00:00.000Z'),
      updatedAt: new Date('2026-01-03T00:00:00.000Z'),
      deletedAt: null,
      operator: {
        id: 'demo-operator-brazzaville',
        businessName: 'Brazzaville City Tours',
        businessType: 'TRAVEL_AGENCY',
        city: 'Brazzaville',
        region: 'Brazzaville',
        latitude: -4.263,
        longitude: 15.242,
      },
      images: [{ id: 'demo-img-brazzaville', url: '/hero-brazzaville-placeholder.png', altText: 'Vue de Brazzaville', order: 0 }],
    },
    {
      id: 'demo-gastronomie',
      title: 'Table congolaise et soiree live',
      description: 'Reservation restaurant avec musique live et specialites locales.',
      listingType: 'RESTAURANT_TABLE',
      pricePerNight: null,
      pricePerPerson: 18000,
      priceFlatRate: null,
      currency: 'XAF',
      capacity: 4,
      isAvailable: true,
      isFeatured: false,
      amenities: ['Musique live', 'Menu local', 'Reservation'],
      rating: 4.6,
      reviewCount: 18,
      createdAt: new Date('2026-01-04T00:00:00.000Z'),
      updatedAt: new Date('2026-01-04T00:00:00.000Z'),
      deletedAt: null,
      operator: {
        id: 'demo-operator-gastronomie',
        businessName: 'Saveurs du Niari',
        businessType: 'RESTAURANT',
        city: 'Dolisie',
        region: 'Niari',
        latitude: -4.199,
        longitude: 12.667,
      },
      images: [{ id: 'demo-img-gastronomie', url: '/welcome.png', altText: 'Experience gastronomique congolaise', order: 0 }],
    },
  ];

  private getDemoListings(filters?: {
    type?: string,
    minPrice?: number,
    maxPrice?: number,
    rating?: number
  }) {
    const typeMapping: Record<string, BusinessType> = {
      HOTEL: BusinessType.HOTEL,
      RESTAURANT: BusinessType.RESTAURANT,
      NIGHTCLUB: BusinessType.BAR_NIGHTCLUB,
      SITE: BusinessType.TOURIST_SITE,
      GAMES: BusinessType.GAME_ROOM,
      JETSKI: BusinessType.JET_SKI_ACTIVITY,
      VIP: BusinessType.CAVE_VIP,
    };

    return this.demoListings.filter((listing) => {
      const price = listing.pricePerNight ?? listing.pricePerPerson ?? listing.priceFlatRate ?? 0;
      const mappedType = filters?.type ? typeMapping[filters.type] || filters.type : undefined;

      if (mappedType && listing.operator.businessType !== mappedType) return false;
      if (filters?.minPrice !== undefined && price < filters.minPrice) return false;
      if (filters?.maxPrice !== undefined && price > filters.maxPrice) return false;
      if (filters?.rating !== undefined && listing.rating < filters.rating) return false;

      return true;
    });
  }

  async create(userId: string, createListingDto: CreateListingDto) {
    const { images, ...listingData } = createListingDto;
    const operator = await this.operatorsService.findByUserId(userId);
    
    if (!operator) {
      throw new ForbiddenException("Vous devez avoir un profil opérateur pour créer une annonce.");
    }

    if (!operator.isValidated) {
      throw new ForbiddenException('Votre compte doit etre valide par le superadmin avant de publier.');
    }

    const trialActive = isTrialActive(operator.trialEndsAt);
    const subscriptionActive = Boolean(operator.subscriptionEnd && operator.subscriptionEnd > new Date());

    if (!trialActive && !subscriptionActive) {
      throw new ForbiddenException('Votre essai est termine. Choisissez un abonnement pour continuer a publier.');
    }

    const planRules = SUBSCRIPTION_RULES[operator.subscriptionPlan];
    if (!trialActive && planRules.listingLimit !== null) {
      const activeListings = await this.prisma.listing.count({
        where: { operatorId: operator.id, deletedAt: null },
      });

      if (activeListings >= planRules.listingLimit) {
        throw new BadRequestException(
          `Limite atteinte pour le plan ${planRules.label}. Passez au plan superieur pour publier plus d'offres.`,
        );
      }
    }

    return this.prisma.listing.create({
      data: {
        ...listingData,
        operatorId: operator.id,
        images: images ? {
          create: images.map(img => ({
            url: img.url,
            cloudinaryId: img.cloudinaryId,
          }))
        } : undefined
      },
      include: { images: true }
    });
  }

  async findAll(filters?: { 
    type?: string, 
    minPrice?: number, 
    maxPrice?: number, 
    rating?: number 
  }) {
    const where: Prisma.ListingWhereInput = {
      deletedAt: null,
      operator: {
        isValidated: true,
        OR: [
          { trialEndsAt: { gt: new Date() } },
          { subscriptionEnd: { gt: new Date() } },
        ],
      },
    };

    if (filters?.type) {
      // Mapping des types simplifiés du front vers les enums Prisma
      const typeMapping: Record<string, BusinessType> = {
        HOTEL: BusinessType.HOTEL,
        RESTAURANT: BusinessType.RESTAURANT,
        NIGHTCLUB: BusinessType.BAR_NIGHTCLUB,
        SITE: BusinessType.TOURIST_SITE,
        GAMES: BusinessType.GAME_ROOM,
        JETSKI: BusinessType.JET_SKI_ACTIVITY,
        VIP: BusinessType.CAVE_VIP,
      };
      
      const mappedType = typeMapping[filters.type];
      if (mappedType) {
      where.operator = {
        businessType: mappedType,
        isValidated: true,
        OR: [
          { trialEndsAt: { gt: new Date() } },
          { subscriptionEnd: { gt: new Date() } },
        ],
      };
      }
    }

    if (filters?.minPrice || filters?.maxPrice) {
      where.OR = [
        { pricePerNight: { gte: filters.minPrice, lte: filters.maxPrice } },
        { pricePerPerson: { gte: filters.minPrice, lte: filters.maxPrice } },
        { priceFlatRate: { gte: filters.minPrice, lte: filters.maxPrice } },
      ];
    }

    if (filters?.rating) {
      where.rating = { gte: filters.rating };
    }

    try {
      return await this.prisma.listing.findMany({
        where,
        include: {
          images: true,
          operator: true,
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      this.logger.warn(`Database unavailable for listings. Returning demo data. ${error instanceof Error ? error.message : ''}`);
      return this.getDemoListings(filters);
    }
  }

  async findByOperator(userId: string) {
    const operator = await this.operatorsService.findByUserId(userId);
    if (!operator) return [];

    return this.prisma.listing.findMany({
      where: { operatorId: operator.id, deletedAt: null },
      include: {
        images: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const demoListing = this.demoListings.find((listing) => listing.id === id);

    try {
      const listing = await this.prisma.listing.findUnique({
        where: { id },
        include: {
          images: true,
          operator: true,
          reviews: {
            where: { isVisible: true },
            include: { author: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!listing || listing.deletedAt) {
        if (demoListing) return { ...demoListing, reviews: [] };
        throw new NotFoundException('Annonce introuvable');
      }

      return listing;
    } catch (error) {
      if (demoListing) return { ...demoListing, reviews: [] };
      throw error;
    }
  }

  async update(userId: string, id: string, data: Prisma.ListingUpdateInput & { images?: { url: string; cloudinaryId: string }[] }) {
    const operator = await this.operatorsService.findByUserId(userId);
    const listing = await this.prisma.listing.findUnique({ where: { id } });

    if (!listing) throw new NotFoundException('Annonce introuvable');
    if (listing.operatorId !== operator?.id) throw new ForbiddenException("Action non autorisée.");

    const { images, ...updateData } = data;
    const updatePayload: Prisma.ListingUpdateInput = { ...updateData };

    // Gestion des images si fournies
    if (images) {
      await this.prisma.listingImage.deleteMany({ where: { listingId: id } });
      updatePayload.images = {
        create: images.map(img => ({
          url: img.url,
          cloudinaryId: img.cloudinaryId,
        }))
      };
    }

    return this.prisma.listing.update({
      where: { id },
      data: updatePayload,
      include: { images: true }
    });
  }

  async remove(userId: string, id: string) {
    const operator = await this.operatorsService.findByUserId(userId);
    const listing = await this.prisma.listing.findUnique({ where: { id } });

    if (!listing) throw new NotFoundException('Annonce introuvable');
    if (listing.operatorId !== operator?.id) throw new ForbiddenException("Action non autorisée.");

    // Soft delete
    return this.prisma.listing.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
