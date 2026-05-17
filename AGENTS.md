# AGENTS.md — Congo Tourisme · Securits Tech

> Ce fichier est lu automatiquement par Google Antigravity avant chaque tâche.
> Il définit l'identité du projet, les règles de développement et les contraintes à respecter absolument.

---

## 🏢 Identité du Projet

- **Nom de l'application** : Congo Tourisme
- **Propriétaire** : Securits Tech (Pointe-Noire, République du Congo)
- **Type** : Plateforme SaaS de tourisme national — marketplace à 3 niveaux
- **Modèle économique** : Abonnements mensuels payés par les opérateurs touristiques
- **Langue principale** : Français · Langue secondaire : Anglais

---

## 🛠️ Stack Technologique — À RESPECTER ABSOLUMENT

### Frontend

- **Framework** : Next.js 14 (App Router) — obligatoire pour le SEO
- **Styles** : Tailwind CSS uniquement — aucun framework CSS alternatif
- **Composants UI** : shadcn/ui
- **Gestion d'état** : Zustand
- **Formulaires** : React Hook Form + Zod pour la validation
- **Cartes** : Leaflet.js (open source, pas de frais API Google Maps)
- **Icônes** : Lucide React

### Backend

- **Runtime** : Node.js avec NestJS (TypeScript strict)
- **ORM** : Prisma avec PostgreSQL
- **Authentification** : JWT (access token 15min + refresh token 7j) + OAuth2 Google/Facebook
- **Upload fichiers** : Cloudinary (images optimisées automatiquement)
- **Emails** : Nodemailer + template HTML
- **SMS** : Twilio

### Base de données

- **Principal** : PostgreSQL (via Prisma)
- **Cache** : Redis (sessions, rate limiting)

### Chatbot IA

- **Modèle** : API Claude d'Anthropic (`claude-sonnet-4-20250514`)
- **Intégration** : Appel API depuis le backend NestJS uniquement (jamais depuis le frontend)
- **Personnalité** : Agent nommé "Kongo", expert du tourisme congolais

### Paiements

- **International** : Stripe (cartes bancaires)
- **Local Afrique** : MTN Mobile Money + Airtel Money (via API dédiée)

### Infrastructure & Déploiement

- **Conteneurisation** : Docker + Docker Compose
- **CI/CD** : GitHub Actions
- **Hébergement** : VPS Linux Ubuntu 24.04

---

## 📐 Architecture du Projet

```text
congo-tourisme/
├── apps/
│   ├── frontend/          # Next.js 14
│   └── backend/           # NestJS API
├── packages/
│   ├── database/          # Prisma schema + migrations
│   ├── shared-types/      # Types TypeScript partagés
│   └── ui/                # Composants shadcn/ui partagés
├── docker-compose.yml
├── AGENTS.md              # Ce fichier
└── INSTRUCTIONS.md        # Feuille de route détaillée
```

---

## 👥 Les 3 Rôles Utilisateurs

### 1. ADMIN (Securits Tech)

- Compte unique, protégé, non inscriptible publiquement
- Accès total à toutes les données
- Gère les abonnements, valide les opérateurs, modère les contenus
- Tableau de bord avec revenus, KPIs, statistiques globales

### 2. OPÉRATEUR (client payant)

- S'inscrit, soumet un dossier, attend validation Admin
- Accède à son espace après paiement d'abonnement
- Publie ses offres (hôtels, restaurants, sites, casinos, salles, agences)
- Reçoit et gère les demandes de réservation
- A un tableau de bord avec ses statistiques

### 3. TOURISTE / VISITEUR

- S'inscrit librement (email ou OAuth)
- Parcourt les offres, filtre, recherche
- Réserve et paie en ligne
- Interagit avec le chatbot IA "Kongo"
- Laisse des avis après séjour

---

## 🔒 Règles de Sécurité — CRITIQUES

- Ne jamais exposer de clés API dans le frontend ou dans Git
- Toutes les clés sensibles dans des variables d'environnement `.env`
- Créer un fichier `.env.example` avec des valeurs fictives pour chaque `.env`
- Validation stricte de toutes les entrées utilisateur côté backend (Zod + class-validator)
- Rate limiting sur toutes les routes publiques (Redis)
- CORS configuré strictement (whitelist de domaines)
- Uploads : vérifier le type MIME réel, limiter la taille (max 10MB par image)
- Mots de passe hashés avec bcrypt (salt rounds: 12)
- Jamais stocker de données de carte bancaire (déléguer entièrement à Stripe)

---

## 🎨 Charte Graphique

```text
Couleur principale :   #1A6B4A  (vert forêt congolais)
Couleur secondaire :   #C8860A  (ocre doré africain)
Couleur accent :       #E8F5EF  (vert très clair)
Fond principal :       #FAFAF8  (blanc cassé)
Texte principal :      #1A1A1A  (quasi-noir)
Texte secondaire :     #5F5E5A  (gris moyen)
Erreur :               #DC2626  (rouge)
Succès :               #16A34A  (vert)
```

- Police : Inter (Google Fonts)
- Radius des cards : 12px
- Ombres : légères et subtiles, jamais excessives
- Ton visuel : chaleureux, naturel, professionnel, africain

---

## 📝 Conventions de Code

- **Langage** : TypeScript strict (tsconfig strict: true)
- **Indentation** : 2 espaces
- **Quotes** : simples `'`
- **Imports** : absolus avec alias `@/`
- **Nommage** :
  - Composants React : PascalCase
  - Fonctions/variables : camelCase
  - Constantes globales : UPPER_SNAKE_CASE
  - Fichiers de composants : kebab-case.tsx
  - Tables Prisma : PascalCase singulier (ex: `User`, `Operator`, `Listing`)
- **Commentaires** : en français uniquement
- **Console.log** : interdits en production — utiliser le logger NestJS

---

## 🌍 Internationalisation (i18n)

- Utiliser `next-intl` pour la gestion des langues
- Fichiers de traduction dans `apps/frontend/messages/`
  - `fr.json` (langue par défaut)
  - `en.json`
- Toutes les chaînes UI doivent être externalisées (pas de texte hardcodé)
- La langue du chatbot s'adapte automatiquement à la langue du navigateur

---

## ⚡ Performance

- Images : toujours servies via Cloudinary avec transformation automatique (WebP, lazy loading)
- Composants lourds : code splitting avec `next/dynamic`
- Données : React Query pour le cache et les requêtes
- API : pagination obligatoire sur toutes les listes (limit: 20 par défaut)
- Base de données : index sur tous les champs de recherche fréquents

---

## 🧪 Tests

- Tests unitaires : Jest + Testing Library (couverture minimum 70%)
- Tests E2E : Playwright pour les flux critiques (inscription, réservation, paiement)
- Générer les tests en même temps que le code, pas après
- Chaque route API doit avoir au minimum un test de succès et un test d'erreur

---

## 🚫 Ce que l'agent NE DOIT PAS faire

- Ne pas utiliser `any` en TypeScript
- Ne pas créer des fichiers de plus de 400 lignes (découper en modules)
- Ne pas utiliser `console.log` (utiliser le logger NestJS)
- Ne pas hardcoder des URLs, clés, mots de passe
- Ne pas utiliser CSS inline dans les composants React (utiliser Tailwind)
- Ne pas modifier le schéma Prisma sans demander confirmation à l'utilisateur
- Ne pas supprimer de données sans soft-delete (champ `deletedAt`)
- Ne pas déployer automatiquement sans validation humaine explicite

---

## ✅ Ce que l'agent DOIT faire systématiquement

- Lire ce fichier entièrement avant de commencer toute tâche
- Créer un plan (Artifact) avant d'écrire du code
- Documenter chaque module avec un commentaire d'en-tête
- Créer le `.env.example` pour chaque nouveau service
- Vérifier que Docker Compose démarre correctement après chaque ajout de service
- Répondre et commenter en français

---

*Propriété de Securits Tech — Pointe-Noire, République du Congo*
*Développé avec Google Antigravity*
