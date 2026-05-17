/** Libelle lisible des types et categories d'offres. */
import { BusinessType, ListingSummary, ListingType } from '@/types';

const listingTypeLabels: Record<string, string> = {
  [ListingType.HOTEL_ROOM]: 'Chambre',
  [ListingType.HOTEL_SUITE]: 'Suite',
  [ListingType.RESTAURANT_TABLE]: 'Restaurant',
  [ListingType.EXCURSION]: 'Excursion',
  [ListingType.EVENT_HALL_RENTAL]: 'Salle',
  [ListingType.CASINO_PACKAGE]: 'Casino',
  [ListingType.SPA_SERVICE]: 'Spa',
  [ListingType.TOURIST_SITE_VISIT]: 'Site touristique',
  [ListingType.NIGHTCLUB_ENTRY]: 'Sortie',
  [ListingType.LEISURE_ACTIVITY]: 'Activite',
  [ListingType.KERMESSE]: 'Evenement',
  [ListingType.SPECIAL_OFFER]: 'Offre speciale',
};

const businessTypeLabels: Record<string, string> = {
  [BusinessType.HOTEL]: 'Hotel',
  [BusinessType.RESTAURANT]: 'Restaurant',
  [BusinessType.CASINO]: 'Casino',
  [BusinessType.EVENT_HALL]: 'Salle',
  [BusinessType.TOURIST_SITE]: 'Site touristique',
  [BusinessType.TRAVEL_AGENCY]: 'Agence',
  [BusinessType.BAR_NIGHTCLUB]: 'Bar / club',
  [BusinessType.SPA_WELLNESS]: 'Spa',
  [BusinessType.LODGE_CAMP]: 'Lodge',
  [BusinessType.OTHER]: 'Autre',
};

export function getListingLabel(listing: ListingSummary) {
  const listingType = listing.listingType ? listingTypeLabels[String(listing.listingType)] : undefined;
  const businessType = listing.type ? businessTypeLabels[String(listing.type)] : undefined;
  const operatorType = listing.operator?.businessType ? businessTypeLabels[String(listing.operator.businessType)] : undefined;

  return listingType ?? businessType ?? operatorType ?? 'Experience';
}
