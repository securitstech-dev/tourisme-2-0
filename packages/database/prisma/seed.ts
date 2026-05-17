import { PrismaClient, UserRole, BusinessType, SubscriptionPlan, ListingType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du nettoyage et du seed professionnel...');

  // 0. Nettoyage (Désactivé pour éviter la perte de données en phase commerciale)
  /*
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.operatorDocument.deleteMany();
  await prisma.operator.deleteMany();
  await prisma.user.deleteMany();
  */

  const passwordHash = await bcrypt.hash('Congo2026!', 10);

  // 1. Création de l'Administrateur (Securits Tech)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@congo-tourisme.cg',
      firstName: 'Admin',
      lastName: 'Securits Tech',
      role: UserRole.ADMIN,
      isVerified: true,
      isActive: true,
      passwordHash,
    },
  });
  console.log('✅ Admin créé');

  // 2. Définition des Opérateurs
  const operatorsData = [
    {
      email: 'hotel.brazza@example.com',
      firstName: 'Directeur',
      lastName: 'Grand Hôtel',
      businessName: 'Grand Hôtel de Brazza',
      type: BusinessType.HOTEL,
      region: 'Brazzaville',
      city: 'Brazzaville',
      description: 'Le fleuron de l\'hôtellerie congolaise avec vue panoramique sur le fleuve Congo.',
      image: 'https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?q=80&w=1000',
      listings: [
        {
          title: 'Suite Diplomatique avec Vue Fleuve',
          type: ListingType.HOTEL_SUITE,
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
      type: BusinessType.RESTAURANT,
      region: 'Brazzaville',
      city: 'Brazzaville',
      description: 'Une expérience gastronomique unique sur les rives du majestueux fleuve Congo.',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000',
      listings: [
        {
          title: 'Table VIP Coucher de Soleil',
          type: ListingType.RESTAURANT_TABLE,
          price: 35000,
          amenities: ['Vue panoramique', 'Cocktail de bienvenue', 'Accès Ponton'],
          img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1000'
        }
      ]
    },
    {
      email: 'atlantic.palace@example.com',
      firstName: 'Gérant',
      lastName: 'Atlantic',
      businessName: 'Atlantic Palace - Pointe-Noire',
      type: BusinessType.HOTEL,
      region: 'Pointe-Noire',
      city: 'Pointe-Noire',
      description: 'Luxe et confort au bord de l\'Océan Atlantique pour vos séjours d\'affaires.',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000',
      listings: [
        {
          title: 'Chambre Executive Ocean View',
          type: ListingType.HOTEL_ROOM,
          price: 145000,
          amenities: ['Balcon privé', 'Spa accès libre', 'Gym 24h/7'],
          img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1000'
        }
      ]
    },
    {
      email: 'safari.odzala@example.com',
      firstName: 'Guide',
      lastName: 'Odzala',
      businessName: 'Safari Congo Odzala',
      type: BusinessType.TOURIST_SITE,
      region: 'Cuvette-Ouest',
      city: 'Odzala',
      description: 'Immersion totale dans la forêt tropicale à la rencontre des gorilles.',
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1000',
      listings: [
        {
          title: 'Expédition Gorilles (3 jours)',
          type: ListingType.EXCURSION,
          price: 950000,
          amenities: ['Hébergement en Lodge', 'Tous repas inclus', 'Guide naturaliste'],
          img: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=1000'
        }
      ]
    },
    {
      email: 'cercle.civilise@example.com',
      firstName: 'Responsable',
      lastName: 'Cercle',
      businessName: 'Le Cercle Civilisé',
      type: BusinessType.EVENT_HALL,
      region: 'Brazzaville',
      city: 'Brazzaville',
      description: 'Le lieu de prestige pour tous vos mariages, conférences et soirées gala.',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000',
      listings: [
        {
          title: 'Grande Salle Cristal (800 places)',
          type: ListingType.EVENT_HALL_RENTAL,
          price: 1200000,
          amenities: ['Sonorisation complète', 'Climatisation centrale', 'Service de sécurité'],
          img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000'
        }
      ]
    }
  ];

  for (const op of operatorsData) {
    // Créer le compte utilisateur
    const user = await prisma.user.create({
      data: {
        email: op.email,
        firstName: op.firstName,
        lastName: op.lastName,
        role: UserRole.OPERATOR,
        isVerified: true,
        isActive: true,
        passwordHash,
      }
    });

    // Créer le profil opérateur
    const operator = await prisma.operator.create({
      data: {
        userId: user.id,
        businessName: op.businessName,
        businessType: op.type,
        description: op.description,
        region: op.region,
        city: op.city,
        address: 'Quartier Administratif',
        phone: '066000000',
        latitude: op.city === 'Brazzaville' ? -4.263 + (Math.random() * 0.01) : -4.769 + (Math.random() * 0.01),
        longitude: op.city === 'Brazzaville' ? 15.283 + (Math.random() * 0.01) : 11.866 + (Math.random() * 0.01),
        isValidated: true,
        validatedAt: new Date(),
        subscriptionPlan: SubscriptionPlan.PREMIUM,
        subscriptionEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        logoUrl: op.image,
      }
    });

    // Créer les annonces pour cet opérateur
    for (const list of op.listings) {
      await prisma.listing.create({
        data: {
          operatorId: operator.id,
          title: list.title,
          description: `Découvrez une prestation exceptionnelle chez ${op.businessName}. Qualité et service garantis au meilleur prix à ${op.city}.`,
          listingType: list.type,
          pricePerNight: list.type.includes('HOTEL') ? list.price : null,
          pricePerPerson: list.type === ListingType.RESTAURANT_TABLE || list.type === ListingType.EXCURSION ? list.price : null,
          priceFlatRate: list.type === ListingType.EVENT_HALL_RENTAL ? list.price : null,
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
    console.log(`✅ Opérateur & Annonces créés : ${op.businessName}`);
  }

  console.log('🎉 Seed professionnel terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
