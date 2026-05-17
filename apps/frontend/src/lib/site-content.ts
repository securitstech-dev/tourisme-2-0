/** Module de contenu central pour l'experience publique Congo Tourisme. */
import { BedDouble, Bot, Building2, CreditCard, Globe2, Landmark, Leaf, MapPinned, ShieldCheck, Sparkles, Trees, Waves } from 'lucide-react';

import { demoListings } from '@/lib/demo-listings';

export const heroHighlights = [
  'Catalogue inspire des destinations congolaises les plus recherchees',
  'Paiements internationaux et Mobile Money africain',
  'Validation des operateurs par Securits Tech',
];

export const trustMetrics = [
  { value: '3 profils', label: 'Admin, operateur, touriste' },
  { value: '24/7', label: 'Assistant Kongo disponible' },
  { value: '12 regions', label: 'Couverture nationale cible' },
  { value: '100%', label: 'Parcours pense pour le SEO' },
];

export const destinationPillars = [
  {
    title: 'Sejours en ville',
    description: 'Brazzaville et Pointe-Noire avec hotels, restaurants et experiences urbaines.',
    icon: Building2,
  },
  {
    title: 'Nature preservee',
    description: 'Parcs, reserves, fleuve et ecotourisme pour une decouverte plus rare du Congo.',
    icon: Trees,
  },
  {
    title: 'Circuits accompagnes',
    description: 'Agences, transferts, guides et itineraires pensés pour simplifier le voyage.',
    icon: MapPinned,
  },
];

export const platformFeatures = [
  {
    title: 'Catalogue unifie',
    description: 'Hotels, restaurants, sites touristiques, loisirs et agences dans une seule interface.',
    icon: Globe2,
  },
  {
    title: 'Assistant Kongo',
    description: 'Une aide conversationnelle pour orienter les visiteurs avant et pendant leur sejour.',
    icon: Bot,
  },
  {
    title: 'Paiements adaptes',
    description: 'Stripe pour l international et Mobile Money pour les usages locaux.',
    icon: CreditCard,
  },
  {
    title: 'Confiance operateur',
    description: 'Validation, abonnement, moderation et mise en avant des etablissements serieux.',
    icon: ShieldCheck,
  },
];

export const operatorBenefits = [
  {
    title: 'Visibilite nationale',
    description: 'Un profil pro, des offres bien presentees et un meilleur positionnement web.',
    icon: Landmark,
  },
  {
    title: 'Reservations centralisees',
    description: 'Un tableau de bord pour suivre demandes, disponibilites et parcours clients.',
    icon: BedDouble,
  },
  {
    title: 'Tourisme durable',
    description: 'Des marqueurs de confiance pour les acteurs qui valorisent le territoire proprement.',
    icon: Leaf,
  },
];

export const operatorPlans = [
  {
    name: 'Starter',
    price: '15 000 FCFA',
    audience: 'Petites structures et lancements',
    featured: false,
    items: ['5 offres actives', 'Gestion simple des demandes', 'Support email'],
  },
  {
    name: 'Professional',
    price: '35 000 FCFA',
    audience: 'Hotels, restaurants et agences etablies',
    featured: true,
    items: ['Offres illimitees', 'Statistiques d activite', 'Support prioritaire'],
  },
  {
    name: 'Premium',
    price: '75 000 FCFA',
    audience: 'Groupes, resorts et enseignes ambitieuses',
    featured: false,
    items: ['Accompagnement renforce', 'Mise en avant avancee', 'Outils de marque'],
  },
];

export const homeListings = demoListings;

export const journeySteps = [
  {
    title: 'Explorer',
    description: 'Le visiteur decouvre les offres, les regions et les categories qui lui correspondent.',
    icon: Sparkles,
  },
  {
    title: 'Comparer',
    description: 'Prix, localisation, type de sejour et informations operateur restent faciles a lire.',
    icon: Waves,
  },
  {
    title: 'Reserver',
    description: 'Le parcours se poursuit vers la reservation puis le paiement de maniere plus sereine.',
    icon: CreditCard,
  },
];
