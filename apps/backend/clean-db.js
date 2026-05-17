require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
  try {
    console.log('--- DEBUT NETTOYAGE BASE DE DONNEES ---');
    
    console.log('Suppression des annonces...');
    await prisma.listing.deleteMany({});
    
    console.log('Suppression des images...');
    await prisma.listingImage.deleteMany({});
    
    console.log('Suppression des réservations...');
    await prisma.reservation.deleteMany({});
    
    console.log('Suppression des avis...');
    await prisma.review.deleteMany({});
    
    console.log('Suppression des opérateurs...');
    await prisma.operator.deleteMany({});
    
    console.log('Suppression des utilisateurs (sauf ADMIN)...');
    await prisma.user.deleteMany({
      where: {
        role: {
          not: 'ADMIN'
        }
      }
    });
    
    console.log('✅ BASE DE DONNEES NETTOYÉE ET PRÊTE POUR LE REEL.');
  } catch (e) {
    console.error('❌ Erreur lors du nettoyage:', e);
  } finally {
    await prisma.$disconnect();
  }
}

clean();
