import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding chatbot knowledge...');

  const knowledges = [
    {
      topic: 'Géographie du Congo',
      content: 'La République du Congo (Brazzaville) est située en Afrique centrale, traversée par l\'équateur. Ses deux principales villes sont Brazzaville (la capitale politique, culturelle et historique, faisant face à Kinshasa le long du fleuve Congo) et Pointe-Noire (la capitale économique et portuaire bordée par l\'Océan Atlantique). Le pays est caractérisé par le majestueux fleuve Congo (le deuxième plus puissant au monde) et une immense forêt tropicale humide couvrant plus de 60% du territoire.',
    },
    {
      topic: 'Sites Touristiques Majeurs',
      content: 'Les joyaux du tourisme congolais incluent :\n' +
        '- **Les Gorges de Diosso** : Situées près de Pointe-Noire, surnommées le Grand Canyon du Congo, offrant des paysages spectaculaires d\'argile rouge sculptés par l\'érosion.\n' +
        '- **Le Parc National d\'Odzala-Kokoua** : L\'une des plus anciennes et des plus riches réserves de biosphère d\'Afrique, abritant les gorilles des plaines de l\'Ouest, des éléphants de forêt et des oiseaux rares.\n' +
        '- **Le Sanctuaire des Gorilles de Lésio-Louna** : Une réserve dédiée à la réintroduction des bébés gorilles orphelins dans leur milieu naturel, située à 140 km au nord de Brazzaville.\n' +
        '- **Les Chutes de la Loufoulakari** : Un spectacle naturel impressionnant situé au sud de Brazzaville, idéal pour les excursions d\'une journée.',
    },
    {
      topic: 'Gastronomie Congolaise',
      content: 'La cuisine congolaise est riche et parfumée. Les plats incontournables sont :\n' +
        '- **Le Saka-Saka** (ou Mpondu) : Plat national à base de feuilles de manioc pilées, d\'huile de palme, de poisson fumé ou de viande.\n' +
        '- **Le Liboké** (ou Maboké) : Poisson (généralement du capitaine) cuit à l\'étouffée dans des feuilles de bananier avec du piment, des oignons et des tomates.\n' +
        '- **Le Poulet à la Mwambe** : Poulet cuit dans une sauce onctueuse à base de pâte d\'arachide ou de noix de palme.\n' +
        'Le tout est généralement accompagné de **Chikwangue** (pain de manioc fermenté enveloppé dans des feuilles), de foufou ou de bananes plantains frites (Alloco). Les boissons emblématiques incluent les bières locales **Ngok** et **Primus**, ainsi que le jus de gingembre ou de bissap.',
    },
    {
      topic: 'Abonnements Congo Tourisme',
      content: 'La plateforme Congo Tourisme de Securits Tech propose 3 formules d\'abonnement pour les opérateurs touristiques :\n' +
        '1. **STARTER** : Idéal pour débuter, permet de publier jusqu\'à 3 annonces et de recevoir des réservations simples.\n' +
        '2. **PROFESSIONAL** : Permet de publier jusqu\'à 15 annonces, d\'obtenir des statistiques détaillées et une meilleure visibilité sur les recherches.\n' +
        '3. **PREMIUM** : La formule ultime, offrant un nombre d\'annonces illimité, le badge "Partenaire Vérifié", une mise en avant prioritaire sur la page d\'accueil et un support client VIP 24h/7.',
    },
    {
      topic: 'Culture et Musique',
      content: 'Le Congo est le berceau historique de la **Rumba Congolaise**, inscrite au patrimoine culturel immatériel de l\'UNESCO. C\'est un art de vivre caractérisé par la joie de vivre, la danse, la poésie et l\'élégance vestimentaire portée au rang d\'art par la **SAPE** (Société des Ambianceurs et des Personnes Élégantes), un mouvement culturel de dandysme unique au monde né à Brazzaville.',
    }
  ];

  for (const k of knowledges) {
    await prisma.chatbotKnowledge.upsert({
      where: { id: k.topic }, // Custom bypass for seeding safely
      create: {
        topic: k.topic,
        content: k.content,
        isActive: true,
      },
      update: {
        content: k.content,
      }
    }).catch(async () => {
      // If CUID is expected
      await prisma.chatbotKnowledge.create({
        data: k
      });
    });
  }

  console.log('✅ Chatbot knowledge successfully seeded!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
