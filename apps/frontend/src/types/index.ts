/** Types frontaux utilises par les ecrans publics et les tableaux de bord. */
export enum ListingType {
  HOTEL_ROOM = 'HOTEL_ROOM',
  HOTEL_SUITE = 'HOTEL_SUITE',
  RESTAURANT_TABLE = 'RESTAURANT_TABLE',
  EXCURSION = 'EXCURSION',
  EVENT_HALL_RENTAL = 'EVENT_HALL_RENTAL',
  CASINO_PACKAGE = 'CASINO_PACKAGE',
  SPA_SERVICE = 'SPA_SERVICE',
  TOURIST_SITE_VISIT = 'TOURIST_SITE_VISIT',
  NIGHTCLUB_ENTRY = 'NIGHTCLUB_ENTRY',
  LEISURE_ACTIVITY = 'LEISURE_ACTIVITY',
  KERMESSE = 'KERMESSE',
  SPECIAL_OFFER = 'SPECIAL_OFFER',
}

export enum BusinessType {
  HOTEL = 'HOTEL',
  RESTAURANT = 'RESTAURANT',
  CASINO = 'CASINO',
  EVENT_HALL = 'EVENT_HALL',
  TOURIST_SITE = 'TOURIST_SITE',
  TRAVEL_AGENCY = 'TRAVEL_AGENCY',
  BAR_NIGHTCLUB = 'BAR_NIGHTCLUB',
  SPA_WELLNESS = 'SPA_WELLNESS',
  LODGE_CAMP = 'LODGE_CAMP',
  OTHER = 'OTHER',
}

export type ListingImage = {
  id?: string;
  url: string;
  altText?: string | null;
  cloudinaryId?: string | null;
};

export type ReviewAuthor = {
  firstName?: string | null;
  lastName?: string | null;
};

export type ListingReview = {
  id: string;
  rating: number;
  comment: string;
  isVisible?: boolean;
  author?: ReviewAuthor | null;
};

export type OperatorSummary = {
  id?: string;
  businessName?: string;
  businessType?: BusinessType | string;
  city?: string;
  region?: string;
  description?: string;
  latitude?: number | null;
  longitude?: number | null;
};

export type ListingSummary = {
  id: string;
  title: string;
  description?: string;
  listingType?: ListingType | string;
  type?: string;
  location?: string;
  pricePerNight?: number | null;
  pricePerPerson?: number | null;
  priceFlatRate?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
  images?: ListingImage[];
  operator?: OperatorSummary | null;
  reviews?: ListingReview[];
};
