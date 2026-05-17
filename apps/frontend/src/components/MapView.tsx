'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getListingPrice } from '@/lib/listing-utils';
import { ListingSummary } from '@/types';

// Fix for default Leaflet icons in Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function MapView({ listings }: { listings: ListingSummary[] }) {
  const geolocatedListings = listings.filter(
    (listing) => typeof listing.operator?.latitude === 'number' && typeof listing.operator?.longitude === 'number',
  );

  // Default to Pointe-Noire or Brazzaville if no listings
  const center = geolocatedListings.length > 0
    ? [geolocatedListings[0].operator!.latitude!, geolocatedListings[0].operator!.longitude!]
    : [-4.769, 11.866]; // Pointe-Noire

  return (
    <MapContainer 
      center={center as [number, number]} 
      zoom={13} 
      className="w-full h-full rounded-[32px] shadow-sm border border-gray-100 z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geolocatedListings.map((listing) => (
        <Marker 
          key={listing.id} 
          position={[listing.operator!.latitude!, listing.operator!.longitude!]}
          icon={customIcon}
        >
          <Popup className="rounded-xl overflow-hidden">
            <div className="font-sans min-w-[150px]">
              <img src={listing.images?.[0]?.url || '/welcome.png'} className="w-full h-24 object-cover rounded-t-xl mb-2" alt={listing.images?.[0]?.altText || listing.title} />
              <h3 className="font-bold text-sm text-foreground">{listing.title}</h3>
              <p className="text-xs text-primary font-bold mt-1">
                {getListingPrice(listing).toLocaleString()} FCFA
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
