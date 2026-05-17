import { ListingSummary } from '@/types';

export function getListingPrice(listing: ListingSummary) {
  return listing.pricePerNight ?? listing.pricePerPerson ?? listing.priceFlatRate ?? 0;
}

export function getListingLocation(listing: ListingSummary) {
  return listing.operator?.city ?? listing.operator?.region ?? listing.location ?? 'Congo';
}

export function getListingCategory(listing: ListingSummary) {
  return listing.listingType ?? listing.type ?? listing.operator?.businessType ?? 'EXPERIENCE';
}

export function matchesListingSearch(listing: ListingSummary, search: string) {
  const query = search.trim().toLowerCase();
  if (!query) return true;

  return [
    listing.title,
    listing.description,
    listing.location,
    listing.operator?.businessName,
    listing.operator?.city,
    listing.operator?.region,
    listing.listingType,
    listing.type,
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(query));
}
