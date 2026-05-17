import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'API Congo Tourisme en ligne et fonctionnelle 🚀';
  }

  async seedData() {
    const adminExists = await this.prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (adminExists) {
      return { message: "La base de données contient déjà des données. Seed ignoré pour protéger vos données." };
    }

    const passwordHash = await bcrypt.hash('Congo2026!', 10);

    // 1. Création de l'Administrateur
    await this.prisma.user.create({
      data: {
        email: 'admin@congo-tourisme.cg',
        firstName: 'Admin',
        lastName: 'Securits Tech',
        role: 'ADMIN',
        isVerified: true,
        isActive: true,
        passwordHash,
      },
    });

    // 2. Définition des Opérateurs
    const operatorsData = [
      {
        email: 'hotel.brazza@example.com',
        firstName: 'Directeur',
        lastName: 'Grand Hôtel',
        businessName: 'Grand Hôtel de Brazza',
        type: 'HOTEL',
        region: 'Brazzaville',
        city: 'Brazzaville',
        description: 'Le fleuron de l\'hôtellerie congolaise avec vue panoramique sur le fleuve Congo.',
        image: 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?q=80&w=1000',
        listings: [
          {
            title: 'Suite Diplomatique avec Vue Fleuve',
            type: 'HOTEL_SUITE',
            price: 185000,
            amenities: ['Wi-Fi VIP', 'Petit-déjeuner inclus', 'Piscine', 'Navette Aéroport'],
            img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000'
          }
        ]
      },
      {
        email: 'mami.wata@example.com',
        firstName: 'Chef',
        lastName: 'Mami Wata',
        businessName: 'Mami Wata Riverside',
        type: 'RESTAURANT',
        region: 'Brazzaville',
        city: 'Brazzaville',
        description: 'Une expérience gastronomique unique sur les rives du majestueux fleuve Congo.',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000',
        listings: [
          {
            title: 'Table VIP Coucher de Soleil',
            type: 'RESTAURANT_TABLE',
            price: 35000,
            amenities: ['Vue panoramique', 'Cocktail de bienvenue', 'Accès Ponton'],
            img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1000'
          }
        ]
      },
      {
        email: 'safari.odzala@example.com',
        firstName: 'Guide',
        lastName: 'Odzala',
        businessName: 'Safari Congo Odzala',
        type: 'TOURIST_SITE',
        region: 'Cuvette-Ouest',
        city: 'Odzala',
        description: 'Immersion totale dans la forêt tropicale à la rencontre des gorilles.',
        image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1000',
        listings: [
          {
            title: 'Expédition Gorilles (3 jours)',
            type: 'EXCURSION',
            price: 950000,
            amenities: ['Hébergement en Lodge', 'Tous repas inclus', 'Guide naturaliste'],
            img: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=1000'
          }
        ]
      }
    ];

    for (const op of operatorsData) {
      const user = await this.prisma.user.create({
        data: {
          email: op.email,
          firstName: op.firstName,
          lastName: op.lastName,
          role: 'OPERATOR',
          isVerified: true,
          isActive: true,
          passwordHash,
        }
      });

      const operator = await this.prisma.operator.create({
        data: {
          userId: user.id,
          businessName: op.businessName,
          businessType: op.type as any,
          description: op.description,
          region: op.region,
          city: op.city,
          address: 'Quartier Administratif',
          phone: '066000000',
          latitude: op.city === 'Brazzaville' ? -4.263 : -4.769,
          longitude: op.city === 'Brazzaville' ? 15.283 : 11.866,
          isValidated: true,
          validatedAt: new Date(),
          subscriptionPlan: 'PREMIUM',
          subscriptionEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          logoUrl: op.image,
        }
      });

      for (const list of op.listings) {
        await this.prisma.listing.create({
          data: {
            operatorId: operator.id,
            title: list.title,
            description: `Découvrez une prestation exceptionnelle chez ${op.businessName}. Qualité et service garantis au meilleur prix à ${op.city}.`,
            listingType: list.type as any,
            pricePerNight: list.type.includes('HOTEL') ? list.price : null,
            pricePerPerson: list.type === 'RESTAURANT_TABLE' || list.type === 'EXCURSION' ? list.price : null,
            amenities: list.amenities,
            isFeatured: true,
            images: {
              create: [
                { url: list.img, cloudinaryId: `seed_${Date.now()}`, order: 0 }
              ]
            }
          }
        });
      }
    }

    return { message: "✅ Seed professionnel terminé avec succès ! Les 3 opérateurs fictifs ont été créés." };
  }

  async clearData() {
    this.logger.log('Nettoyage manuel de la base de données demandé...');
    
    try {
      // Order matters for foreign keys
      await this.prisma.listingImage.deleteMany({});
      await this.prisma.review.deleteMany({});
      await this.prisma.reservation.deleteMany({});
      await this.prisma.listing.deleteMany({});
      await this.prisma.operatorDocument.deleteMany({});
      await this.prisma.operator.deleteMany({});
      await this.prisma.refreshToken.deleteMany({});
      await this.prisma.user.deleteMany({
        where: { role: { not: 'ADMIN' } }
      });
      
      return { message: "✅ Base de données nettoyée avec succès. Elle est maintenant prête pour vos données réelles." };
    } catch (error) {
      this.logger.error(`Erreur lors du nettoyage: ${error.message}`);
      throw new Error(`Erreur nettoyage: ${error.message}`);
    }
  }
}
