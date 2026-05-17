# INSTRUCTIONS.md — Feuille de Route Complète

## Plateforme "Congo Tourisme" · Propriété de Securits Tech

> **À L'AGENT ANTIGRAVITY** : Ce fichier contient la description complète du projet à développer.
> Lis d'abord le fichier `AGENTS.md` à la racine pour les règles techniques.
> Puis utilise ce fichier comme ta feuille de route principale pour construire l'application.

---

## 🎯 Mission Principale

Construire une **plateforme SaaS de tourisme national** pour la République du Congo.
C'est une marketplace à 3 niveaux : Admin (Securits Tech) → Opérateurs (abonnés payants) → Touristes (visiteurs).

Un touriste vivant à Paris peut entrer sur la plateforme, voir les hôtels, restaurants, sites naturels et casinos du Congo, faire une réservation en ligne, et l'opérateur concerné reçoit la demande dans son tableau de bord.

Un chatbot IA nommé **"Kongo"** guide les touristes sur les richesses du Congo.

---

## 📋 PHASE 1 — Initialisation & Architecture (Priorité Absolue)

### Tâche 1.1 — Scaffolding du projet

Crée la structure monorepo suivante avec Turborepo :

```text
congo-tourisme/
├── apps/
│   ├── frontend/          # Next.js 14 App Router
│   └── backend/           # NestJS API REST
├── packages/
│   ├── database/          # Prisma schema + client
│   ├── shared-types/      # Types TypeScript partagés
│   └── ui/                # Composants React réutilisables
├── docker-compose.yml     # PostgreSQL + Redis + pgAdmin
├── .gitignore
├── .env.example
├── turbo.json
├── package.json (root)
├── AGENTS.md
└── INSTRUCTIONS.md
```

### Tâche 1.2 — Docker Compose

Configure un `docker-compose.yml` avec :

- PostgreSQL 16 (port 5432)
- Redis 7 (port 6379)
- pgAdmin (port 5050, pour visualiser la DB)

### Tâche 1.3 — Schéma de Base de Données (Prisma)

Crée le schéma Prisma complet dans `packages/database/prisma/schema.prisma`.

**Tables à créer :**

```prisma
// Utilisateurs (tous rôles confondus)
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String?
  firstName     String
  lastName      String
  phone         String?
  role          UserRole  @default(TOURIST)
  avatarUrl     String?
  isVerified    Boolean   @default(false)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime? // soft delete
  operator      Operator?
  reservations  Reservation[]
  reviews       Review[]
  refreshTokens RefreshToken[]
}

enum UserRole { ADMIN OPERATOR TOURIST }

// Profil étendu pour les opérateurs
model Operator {
  id                String          @id @default(cuid())
  userId            String          @unique
  user              User            @relation(fields: [userId], references: [id])
  businessName      String
  businessType      BusinessType
  description       String          @db.Text
  logoUrl           String?
  coverImageUrl     String?
  region            String          // Brazzaville, Pointe-Noire, Dolisie, Nord Congo...
  city              String
  address           String
  latitude          Float?
  longitude         Float?
  phone             String
  whatsapp          String?
  website           String?
  isValidated       Boolean         @default(false) // Admin doit valider
  validatedAt       DateTime?
  subscriptionPlan  SubscriptionPlan @default(STARTER)
  subscriptionEnd   DateTime?
  listings          Listing[]
  reservations      Reservation[]
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
}

enum BusinessType {
  HOTEL
  RESTAURANT
  CASINO
  EVENT_HALL      // Salle de fête
  TOURIST_SITE    // Site touristique
  TRAVEL_AGENCY
  BAR_NIGHTCLUB
  SPA_WELLNESS
  LODGE_CAMP
  OTHER
}

enum SubscriptionPlan { STARTER PROFESSIONAL PREMIUM }

// Offres publiées par les opérateurs
model Listing {
  id            String        @id @default(cuid())
  operatorId    String
  operator      Operator      @relation(fields: [operatorId], references: [id])
  title         String
  description   String        @db.Text
  listingType   ListingType
  pricePerNight Float?        // Pour les hôtels
  pricePerPerson Float?       // Pour les excursions / restaurants
  priceFlatRate Float?        // Pour les salles de fête / casinos
  currency      String        @default("XAF") // Franc CFA
  capacity      Int?
  isAvailable   Boolean       @default(true)
  isFeatured    Boolean       @default(false) // Mis en avant par Admin
  images        ListingImage[]
  amenities     String[]      // ["wifi", "piscine", "climatisation"...]
  checkInTime   String?       // "14:00"
  checkOutTime  String?       // "11:00"
  minNights     Int?          @default(1)
  rating        Float?        @default(0)
  reviewCount   Int           @default(0)
  reservations  Reservation[]
  reviews       Review[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  deletedAt     DateTime?
}

enum ListingType {
  HOTEL_ROOM
  HOTEL_SUITE
  RESTAURANT_TABLE
  EXCURSION
  EVENT_HALL_RENTAL
  CASINO_PACKAGE
  SPA_SERVICE
  TOURIST_SITE_VISIT
}

model ListingImage {
  id          String   @id @default(cuid())
  listingId   String
  listing     Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  url         String
  cloudinaryId String
  altText     String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
}

// Réservations
model Reservation {
  id            String              @id @default(cuid())
  listingId     String
  listing       Listing             @relation(fields: [listingId], references: [id])
  touristId     String
  tourist       User                @relation(fields: [touristId], references: [id])
  operatorId    String
  operator      Operator            @relation(fields: [operatorId], references: [id])
  checkIn       DateTime
  checkOut      DateTime?
  guests        Int                 @default(1)
  totalPrice    Float
  currency      String              @default("XAF")
  status        ReservationStatus   @default(PENDING)
  paymentStatus PaymentStatus       @default(UNPAID)
  stripePaymentId String?
  notes         String?             @db.Text
  cancellationReason String?
  createdAt     DateTime            @default(now())
  updatedAt     DateTime            @updatedAt
  payment       Payment?
}

enum ReservationStatus {
  PENDING       // En attente de confirmation opérateur
  CONFIRMED     // Confirmée par l'opérateur
  CANCELLED     // Annulée
  COMPLETED     // Séjour terminé
  REJECTED      // Refusée par l'opérateur
}

enum PaymentStatus { UNPAID PAID REFUNDED PARTIALLY_REFUNDED }

// Paiements
model Payment {
  id              String      @id @default(cuid())
  reservationId   String      @unique
  reservation     Reservation @relation(fields: [reservationId], references: [id])
  amount          Float
  currency        String
  method          PaymentMethod
  stripePaymentId String?
  mobileMoneyRef  String?
  status          String
  paidAt          DateTime?
  createdAt       DateTime    @default(now())
}

enum PaymentMethod { STRIPE MOBILE_MONEY_MTN MOBILE_MONEY_AIRTEL }

// Avis et notations
model Review {
  id          String   @id @default(cuid())
  listingId   String
  listing     Listing  @relation(fields: [listingId], references: [id])
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  rating      Int      // 1 à 5
  comment     String   @db.Text
  isVisible   Boolean  @default(true)
  createdAt   DateTime @default(now())
}

// Abonnements opérateurs
model Subscription {
  id          String           @id @default(cuid())
  operatorId  String
  plan        SubscriptionPlan
  amount      Float
  currency    String           @default("XAF")
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean          @default(true)
  stripeSubId String?
  createdAt   DateTime         @default(now())
}

// Tokens de refresh JWT
model RefreshToken {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

---

## 📋 PHASE 2 — Backend API (NestJS)

### Tâche 2.1 — Modules NestJS à créer

Crée les modules suivants dans `apps/backend/src/` :

```text
src/
├── auth/               # Authentification JWT + OAuth
├── users/              # Gestion des utilisateurs
├── operators/          # Gestion des opérateurs
├── listings/           # Offres publiées
├── reservations/       # Système de réservation
├── payments/           # Stripe + Mobile Money
├── reviews/            # Avis et notations
├── subscriptions/      # Plans d'abonnement
├── chatbot/            # Proxy vers API Claude (Kongo)
├── uploads/            # Upload Cloudinary
├── notifications/      # Email + SMS
├── admin/              # Routes Admin uniquement
└── common/             # Guards, decorators, filters, interceptors
```

### Tâche 2.2 — Routes API complètes

#### AUTH

```text
POST /api/auth/register          # Inscription touriste
POST /api/auth/register-operator # Inscription opérateur
POST /api/auth/login             # Connexion (email/password)
POST /api/auth/google            # OAuth Google
POST /api/auth/refresh           # Renouveler le token
POST /api/auth/logout            # Déconnexion
POST /api/auth/forgot-password   # Mot de passe oublié
POST /api/auth/reset-password    # Réinitialisation
```

#### LISTINGS (Offres)

```text
GET    /api/listings             # Liste publique avec filtres
GET    /api/listings/:id         # Détail d'une offre
GET    /api/listings/featured    # Offres mises en avant
POST   /api/listings             # Créer une offre (Opérateur)
PATCH  /api/listings/:id         # Modifier une offre (Opérateur)
DELETE /api/listings/:id         # Supprimer (soft delete)
POST   /api/listings/:id/images  # Ajouter des images
DELETE /api/listings/:id/images/:imageId # Supprimer une image
```

**Filtres disponibles sur GET /api/listings :**

- `type` (hotel, restaurant, excursion...)
- `region` (Pointe-Noire, Brazzaville, Dolisie...)
- `minPrice` / `maxPrice`
- `checkIn` / `checkOut` (disponibilité)
- `guests` (nombre de personnes)
- `rating` (note minimum)
- `amenities` (tableau de services)
- `page` / `limit` (pagination)
- `sortBy` (price_asc, price_desc, rating, newest)

#### RÉSERVATIONS

```text
GET  /api/reservations/my           # Réservations du touriste connecté
GET  /api/reservations/operator     # Réservations reçues (Opérateur)
GET  /api/reservations/:id          # Détail d'une réservation
POST /api/reservations              # Créer une réservation
PATCH /api/reservations/:id/confirm # Confirmer (Opérateur)
PATCH /api/reservations/:id/reject  # Refuser (Opérateur)
PATCH /api/reservations/:id/cancel  # Annuler (Touriste ou Opérateur)
```

#### PAIEMENTS

```text
POST /api/payments/create-intent    # Créer une intention Stripe
POST /api/payments/confirm          # Confirmer le paiement
POST /api/payments/mobile-money     # Paiement Mobile Money
POST /api/payments/webhook/stripe   # Webhook Stripe (events)
```

#### CHATBOT KONGO

```text
POST /api/chatbot/message           # Envoyer un message au chatbot
GET  /api/chatbot/session/:sessionId # Historique d'une session
```

#### ADMIN

```text
GET    /api/admin/dashboard          # KPIs globaux
GET    /api/admin/operators          # Liste des opérateurs
PATCH  /api/admin/operators/:id/validate  # Valider un opérateur
PATCH  /api/admin/operators/:id/suspend   # Suspendre
GET    /api/admin/listings           # Toutes les offres
PATCH  /api/admin/listings/:id/feature    # Mettre en avant
GET    /api/admin/reservations       # Toutes les réservations
GET    /api/admin/payments           # Revenus et paiements
GET    /api/admin/subscriptions      # Abonnements actifs
POST   /api/admin/plans              # Créer/modifier un plan
POST   /api/admin/notifications/broadcast # Notification groupée
```

### Tâche 2.3 — Chatbot Kongo (API Claude)

Dans `apps/backend/src/chatbot/chatbot.service.ts`, implémente l'appel à l'API Claude.

**System prompt à utiliser :**

```text
Tu es Kongo, l'assistant touristique officiel de Congo Tourisme, 
une plateforme de la société Securits Tech basée à Pointe-Noire, 
République du Congo.

Tu es un expert passionné, chaleureux et cultivé des richesses 
naturelles, culturelles et historiques de la République du Congo.
Tu aides les voyageurs du monde entier à planifier leur séjour 
au Congo avec enthousiasme, précision et bienveillance.

Tu parles français et anglais. Tu détectes la langue du touriste 
et tu réponds dans sa langue.

TES CONNAISSANCES APPROFONDIES INCLUENT :

SITES NATURELS :
- Les Gorges de Diosso : falaises spectaculaires à 35 km de 
  Pointe-Noire, randonnée de 2h au cœur de la nature
- La Côte Sauvage : plus grande plage de Pointe-Noire, station 
  balnéaire avec hôtels et piscines
- Le lac Nanga : lac bordé de papyrus à 10 km de Pointe-Noire, 
  promenades en pirogue
- La forêt du Mayombe : forêt tropicale dense, excursion en 
  draisine sur le chemin de fer Congo-Océan
- La Cascade de Kimbakala : à 78 km de Pointe-Noire, 
  bivouac possible
- Le glacier de sel de Makota : curiosité naturelle à 40 km 
  de Pointe-Noire
- L'embouchure du fleuve Kouilou : pont de 300 m, 
  le plus long du Congo
- Les chutes de Ndinga Ndinga et le lac vert

PARCS ET RÉSERVES :
- Parc national Nouabalé-Ndoki : plus riche du pays, 
  gorilles, éléphants, 300+ espèces d'oiseaux (accès par avion)
- Réserve de gorilles de Lesio-Louna (Lefini) : accessible 
  en voiture depuis Brazzaville, chimpanzés et gorilles
- Sanctuaire de chimpanzés de Tchimpounga (Jane Goodall 
  Institute) : plus de 200 chimpanzés secourus depuis 1992
- Observation des baleines à bosse : mai à août à Pointe-Noire
- Protection des tortues marines avec l'ONG Rénatura

CULTURE ET HISTOIRE :
- Musée Mâ-Loango : seul musée sur le commerce des esclaves 
  et l'histoire de Loango, à 25 km de Pointe-Noire
- Mémorial Pierre Savorgnan de Brazza : attraction 
  incontournable de Brazzaville depuis 2006
- Gare ferroviaire de Pointe-Noire : architecture Art Déco, 
  terminus du Congo-Océan (885 km jusqu'à Brazzaville)
- Grand Marché de Pointe-Noire : poumon de la ville, 
  marché Ndji-Ndji modernisé
- Musée national du Congo (Brazzaville, fondé en 1965)
- Musée Galerie du Bassin du Congo : danse Kiebe-Kiebe
- Plateau Ville à Brazzaville : peintures et artisanat africain

INFORMATIONS PRATIQUES :
- Meilleure période : saison sèche de mai à octobre
- Visa : obligatoire pour la plupart des nationalités
- Vaccination fièvre jaune : obligatoire à l'entrée
- Monnaie : Franc CFA (XAF)
- Aéroport : Pointe-Noire (PNR) et Brazzaville (BZV)
- Transport : taxis en ville, 4x4 indispensable pour les pistes
- Train Congo-Océan : de Pointe-Noire à Brazzaville (885 km)
- Cuisine locale : manioc, crevettes d'eau douce, antilopes, 
  porc-épic, poisson fumé

Quand un touriste pose une question sur un hébergement, 
un restaurant ou une activité, oriente-le vers les offres 
disponibles sur la plateforme Congo Tourisme.

Réponds toujours avec enthousiasme et donne envie de visiter 
le Congo. Sois précis, utile et chaleureux.
```

**Format de la réponse API chatbot :**

```json
{
  "message": "string",
  "sessionId": "string",
  "suggestedListings": [] // Offres de la plateforme pertinentes
}
```

---

## 📋 PHASE 3 — Frontend Next.js

### Tâche 3.1 — Pages à créer

#### Pages Publiques (accessibles sans connexion)

```text
/                          # Page d'accueil
/search                    # Recherche avec filtres
/listings/:id              # Détail d'une offre
/destinations/:region      # Offres par région (Pointe-Noire, Brazzaville...)
/auth/login                # Connexion
/auth/register             # Inscription touriste
/auth/register-operator    # Inscription opérateur
/auth/forgot-password      # Mot de passe oublié
```

#### Pages Touriste (connecté, rôle TOURIST)

```text
/dashboard/tourist         # Mon tableau de bord
/dashboard/reservations    # Mes réservations
/dashboard/wishlist        # Mes favoris
/dashboard/profile         # Mon profil
/checkout/:reservationId   # Paiement
```

#### Pages Opérateur (connecté, rôle OPERATOR + abonnement actif)

```text
/dashboard/operator              # Tableau de bord opérateur
/dashboard/operator/listings     # Mes offres
/dashboard/operator/listings/new # Créer une offre
/dashboard/operator/listings/:id # Modifier une offre
/dashboard/operator/reservations # Mes réservations reçues
/dashboard/operator/subscription # Mon abonnement
/dashboard/operator/profile      # Mon profil d'entreprise
/dashboard/operator/stats        # Mes statistiques
```

#### Pages Admin (connecté, rôle ADMIN)

```text
/admin                           # Dashboard Admin
/admin/operators                 # Gestion opérateurs
/admin/operators/:id             # Détail opérateur
/admin/listings                  # Toutes les offres
/admin/reservations              # Toutes les réservations
/admin/payments                  # Revenus et finances
/admin/subscriptions             # Abonnements
/admin/users                     # Gestion utilisateurs
/admin/chatbot                   # Configuration chatbot
/admin/notifications             # Envoi de notifications
```

### Tâche 3.2 — Page d'Accueil (détail)

La page d'accueil doit inclure dans l'ordre :

1. **Navbar** : Logo "Congo Tourisme", navigation principale, boutons Connexion/Inscription, sélecteur de langue (FR/EN)

2. **Hero Section** : Carrousel de 6 photos spectaculaires du Congo avec texte d'accroche :
   - "Découvrez les merveilles de la République du Congo"
   - Barre de recherche principale avec champs : Destination, Type (hôtel/restaurant/excursion...), Dates, Nombre de personnes
   - Bouton "Rechercher" bien visible

3. **Section Catégories** : 6 icônes-liens : Hôtels · Restaurants · Sites Naturels · Casinos · Salles de Fête · Agences

4. **Offres Populaires** : Grille de 8 cards d'offres les mieux notées avec photo, titre, région, note, prix

5. **Section "Découvrez le Congo"** : 3 cartes avec photos présentant :
   - Pointe-Noire : la capitale économique et ses plages
   - Brazzaville : la capitale culturelle et historique
   - Nature & Parcs : gorilles, forêts, cascades

6. **Section "Comment ça marche"** : 3 étapes illustrées pour les touristes

7. **Section "Devenez Opérateur"** : CTA pour attirer les opérateurs, présentation des plans d'abonnement

8. **Footer** : Liens utiles, réseaux sociaux, copyright Securits Tech

### Tâche 3.3 — Card d'une offre (ListingCard Component)

```tsx
// Doit afficher :
// - Image principale (format 16:9, optimisée Cloudinary)
// - Badge du type (Hôtel, Restaurant, Site...)
// - Nom de l'offre
// - Nom et ville de l'opérateur
// - Note moyenne (étoiles) + nombre d'avis
// - Prix (format "À partir de 25 000 XAF / nuit")
// - Bouton "Voir l'offre"
// - Icône cœur (ajouter aux favoris)
// - Badge "Vérifié" si opérateur validé
// - Badge "Mis en avant" si isFeatured
```

### Tâche 3.4 — Chatbot Kongo (Widget)

Crée un widget chatbot flottant affiché sur toutes les pages :

```text
- Bouton flottant en bas à droite (couleur #1A6B4A)
- Avatar de Kongo (créer un avatar simple stylisé)
- Fenêtre de chat qui s'ouvre au clic
- Bulles de message touriste (droite) et Kongo (gauche)
- Indicateur de frappe animé pendant que Kongo répond
- Message de bienvenue automatique :
  "Bonjour ! Je suis Kongo, votre guide touristique du Congo 🇨🇬
   Comment puis-je vous aider à planifier votre voyage ?"
- Suggestions rapides sous le message de bienvenue :
  ["🏖️ Plages & Nature", "🏨 Hôtels", "🍽️ Restaurants", "🦍 Safari & Parcs"]
- Champ de saisie + bouton Envoyer
- L'historique de conversation est sauvegardé en session
```

---

## 📋 PHASE 4 — Fonctionnalités Avancées

### Tâche 4.1 — Système de Notifications

Envoyer automatiquement des notifications dans ces situations :

| Événement | Destinataire | Canal |
| --- | --- | --- |
| Nouvelle réservation reçue | Opérateur | Email + SMS |
| Réservation confirmée | Touriste | Email |
| Réservation refusée | Touriste | Email |
| Réservation annulée | Opérateur + Touriste | Email |
| Paiement confirmé | Touriste | Email avec QR code |
| Abonnement expirant (7j) | Opérateur | Email |
| Abonnement expiré | Opérateur | Email |
| Compte opérateur validé | Opérateur | Email |

### Tâche 4.2 — Plans d'Abonnement Opérateurs

Créer une page de tarification claire avec 3 plans :

#### Plan Découverte (Gratuit 30 jours)

- 3 offres publiées maximum
- 1 image par offre
- Statistiques basiques
- Sans badge "Vérifié"
- Support par email

#### Plan Professionnel

- Prix : 25 000 XAF / mois (à configurer par Admin)
- Offres illimitées
- 10 images par offre + vidéos
- Badge "Vérifié Securits Tech"
- Priorité dans les résultats de recherche
- Statistiques détaillées
- Support prioritaire

#### Plan Premium

- Prix : 50 000 XAF / mois (à configurer par Admin)
- Tout le plan Pro +
- Mise en avant sur la page d'accueil
- Rapport mensuel de performance PDF
- Support WhatsApp direct
- Intégration réseaux sociaux automatique

### Tâche 4.3 — Tableau de Bord Admin

Le dashboard Admin doit afficher :

**KPIs en temps réel :**

- Revenus du mois en cours (XAF)
- Nombre d'opérateurs actifs
- Nombre de réservations ce mois
- Nombre de touristes inscrits
- Taux de conversion (vues → réservations)
- Offres en attente de modération

**Graphiques :**

- Revenus mensuels (12 derniers mois) - courbe
- Réservations par type d'offre - camembert
- Opérateurs par région - barres
- Croissance des inscriptions - courbe

**Actions rapides :**

- Valider les opérateurs en attente
- Modérer les offres signalées
- Envoyer une notification groupée

---

## 📋 PHASE 5 — Tests et Déploiement

### Tâche 5.1 — Tests Essentiels

- Tests unitaires sur les services critiques (auth, payment, reservation)
- Tests E2E sur le flux complet : inscription → recherche → réservation → paiement
- Test du chatbot Kongo avec différentes questions types

### Tâche 5.2 — Fichiers de Configuration

Crée un `.env.example` complet :

```bash
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/congo_tourisme"
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Claude API (Chatbot Kongo)
ANTHROPIC_API_KEY="sk-ant-..."

# Email (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="contact@congotourisme.com"
SMTP_PASS="your-app-password"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="+1..."

# OAuth Google
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App
FRONTEND_URL="http://localhost:3000"
BACKEND_URL="http://localhost:3001"
NODE_ENV="development"
```

### Tâche 5.3 — README.md

Crée un README.md clair avec :

- Présentation du projet
- Prérequis système
- Instructions d'installation pas à pas
- Comment démarrer en développement
- Variables d'environnement requises
- Architecture du projet
- Contact : Securits Tech, Pointe-Noire, Congo

---

## 📋 PHASE 6 — Innovation & Écosystème Congo

### Tâche 6.1 — Module Kermesses & Événements

- Liste des événements locaux avec filtres par ville (PNR, BZV, Dolisie...).
- Billetterie simple avec paiement Mobile Money.
- Mise en avant par l'Admin.

### Tâche 6.2 — Parrainage "Mwana Mboka"

- Système de code de parrainage pour la diaspora et les locaux.
- Récompenses (crédits ou réductions) après la première réservation du filleul.

### Tâche 6.3 — Logistique & Infos (CFCO / RN1)

- Flux d'informations sur l'état des routes (RN1, RN2) et horaires CFCO.
- Annuaire de chauffeurs 4x4 certifiés pour les sites naturels.

### Tâche 6.4 — Badge "Tourisme Durable"

- Système de certification par l'Admin pour les opérateurs écologiques.
- Filtre dédié dans la recherche.

---

## 🗺️ Ordre d'exécution recommandé pour l'agent


```text
1. Scaffolding Turborepo + Docker Compose
2. Schéma Prisma + migrations
3. Backend NestJS : Auth + Users + Guards
4. Backend NestJS : Operators + Listings + Uploads
5. Backend NestJS : Reservations + Payments
6. Backend NestJS : Chatbot Kongo (Claude API)
7. Backend NestJS : Admin + Notifications
8. Frontend Next.js : Layout + Navbar + Footer
9. Frontend : Page d'accueil
10. Frontend : Recherche + Filtres
11. Frontend : Détail d'une offre
12. Frontend : Tableau de bord Touriste
13. Frontend : Tableau de bord Opérateur
14. Frontend : Tableau de bord Admin
15. Frontend : Widget Chatbot Kongo
16. Frontend : Paiement (Stripe + Mobile Money)
17. Modules Innovation Congo (Événements, Parrainage, Logistique)
18. Tests unitaires et E2E
19. Docker + scripts de déploiement
```

---

## ✅ Critères de Validation du Projet

L'application est considérée comme terminée quand :

- [ ] Un touriste peut s'inscrire, rechercher des offres, filtrer par région et type, voir les détails d'une offre, réserver et payer en ligne
- [ ] Un opérateur peut s'inscrire, être validé par l'Admin, payer son abonnement, publier des offres avec photos, recevoir et gérer les réservations
- [ ] L'Admin peut voir les revenus, valider les opérateurs, modérer les contenus, gérer les abonnements
- [ ] Le chatbot Kongo répond en français et en anglais sur les richesses du Congo
- [ ] L'application est responsive on mobile, tablette and desktop
- [ ] Les notifications email fonctionnent sur les événements clés
- [ ] Les paiements Stripe fonctionnent en mode test
- [ ] Docker Compose démarre tout le projet en une commande
- [ ] Le README permet à un développeur tiers de démarrer le projet

---

*Propriété de Securits Tech — Pointe-Noire, République du Congo*
*Contact : [à renseigner]*
*Version : 1.0.0*
