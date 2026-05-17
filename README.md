# Congo Tourisme 🇨🇬

Plateforme SaaS de tourisme national pour la République du Congo. Une marketplace à 3 niveaux : Admin (Securits Tech) → Opérateurs (abonnés payants) → Touristes (visiteurs).

Propriété de **Securits Tech** (Pointe-Noire, Congo).

## 🚀 Fonctionnalités Clés

- **Touristes** : Recherche d'offres (hôtels, restaurants, sites), réservation en ligne, chatbot IA "Kongo".
- **Opérateurs** : Publication d'annonces, gestion des réservations, abonnement premium.
- **Admin** : Modération, validation des opérateurs, statistiques globales, revenus.
- **IA Kongo** : Guide touristique intelligent expert du Congo (API Claude).

## 🛠️ Stack Technologique

- **Frontend** : Next.js 14 (App Router), Tailwind CSS, shadcn/ui, Zustand.
- **Backend** : Node.js, NestJS (TypeScript), Prisma ORM.
- **Base de données** : PostgreSQL, Redis (cache/sessions).
- **Services** : Cloudinary (images), Stripe (paiements), Twilio (SMS), Claude API (IA).
- **Infrastructure** : Docker, Turborepo.

## 📋 Prérequis

- Node.js 18+
- Docker & Docker Compose
- Compte Cloudinary, Stripe, Anthropic (API Claude)

## ⚙️ Installation

1. **Cloner le projet** :

   ```bash
   git clone [url-du-repo]
   cd congo-tourisme
   ```

2. **Installer les dépendances** :

   ```bash
   npm install
   ```

3. **Configurer l'environnement** :
   Copiez `.env.example` en `.env` dans la racine et remplissez les variables.

   ```bash
   cp .env.example .env
   ```

4. **Démarrer l'infrastructure** :

   ```bash
   docker-compose up -d
   ```

5. **Initialiser la base de données** :

   ```bash
   npx prisma migrate dev --name init --schema=packages/database/prisma/schema.prisma
   npm run seed --workspace=packages/database
   ```

6. **Lancer l'application en développement** :

   ```bash
   npm run dev
   ```

## 📂 Architecture

- `apps/frontend` : Application Next.js.
- `apps/backend` : API NestJS.
- `packages/database` : Schéma Prisma et client.
- `packages/shared-types` : Types TS partagés.
- `packages/ui` : Composants UI communs.

## 🧪 Tests

Le projet utilise Jest pour les tests unitaires.

```bash
# Backend
cd apps/backend
npm test             # Lancer les tests
npm run test:cov     # Rapport de couverture
```

Services couverts : `Auth`, `Listings`, `Reviews`, `Payments`, `Subscriptions`, `Users`.

## 🔒 Sécurité

- Authentification JWT avec Refresh Tokens.
- Validation stricte des entrées avec Zod.
- Modération automatique des avis par l'IA.
- Hashage des mots de passe avec Bcrypt.

## 📞 Contact

**Securits Tech**
Pointe-Noire, République du Congo
Email : <contact@congotourisme.cg>
Tél : +242 05 302 8383 / 06 881 74 04

---
*Développé avec passion pour le rayonnement du Congo.*
