import { BusinessType, DocumentType, SubscriptionPlan } from '@prisma/client';

/** Regles SaaS et conformite appliquees cote serveur. */
export const SUBSCRIPTION_RULES: Record<
  SubscriptionPlan,
  {
    label: string;
    monthlyPrice: number;
    annualPrice: number;
    listingLimit: number | null;
  }
> = {
  STARTER: {
    label: 'Essentiel',
    monthlyPrice: 15000,
    annualPrice: 150000,
    listingLimit: 3,
  },
  PROFESSIONAL: {
    label: 'Croissance',
    monthlyPrice: 45000,
    annualPrice: 450000,
    listingLimit: 12,
  },
  PREMIUM: {
    label: 'Premium',
    monthlyPrice: 120000,
    annualPrice: 1200000,
    listingLimit: null,
  },
};

export const FREE_TRIAL_DAYS = 14;

export function isTrialActive(trialEndsAt?: Date | null) {
  return Boolean(trialEndsAt && trialEndsAt > new Date());
}

const leisureBusinessTypes: BusinessType[] = [
  BusinessType.CASINO,
  BusinessType.EVENT_HALL,
  BusinessType.BAR_NIGHTCLUB,
  BusinessType.GAME_ROOM,
  BusinessType.JET_SKI_ACTIVITY,
  BusinessType.CAVE_VIP,
  BusinessType.SPA_WELLNESS,
  BusinessType.OTHER,
];

const regulatedBusinessTypes: BusinessType[] = [
  BusinessType.HOTEL,
  BusinessType.TRAVEL_AGENCY,
  BusinessType.TOURIST_SITE,
  BusinessType.CASINO,
  BusinessType.EVENT_HALL,
  BusinessType.BAR_NIGHTCLUB,
  BusinessType.CAVE_VIP,
];

export function getRequiredDocumentsForBusiness(type: BusinessType): DocumentType[] {
  const required = new Set<DocumentType>([
    DocumentType.RCCM,
    DocumentType.COMMERCIAL_AUTH,
    DocumentType.NIU,
    DocumentType.PATENTE,
    DocumentType.MANAGER_ID,
  ]);

  if (leisureBusinessTypes.includes(type)) {
    required.add(DocumentType.SAFETY_QUITUS);
  }

  if (regulatedBusinessTypes.includes(type)) {
    required.add(DocumentType.MINISTRY_AUTH);
  }

  return Array.from(required);
}
