'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  Hotel, 
  Utensils, 
  Map as MapIcon, 
  Loader2,
  Music,
  MapPinned,
  Heart,
  Shield,
  ArrowRight
} from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { demoListings } from '@/lib/demo-listings';
import { getListingLocation, getListingPrice, matchesListingSearch } from '@/lib/listing-utils';
import { getListingLabel } from '@/lib/listing-labels';
import { ListingSummary } from '@/types';

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-[#FAFAF8] rounded-[32px] border border-gray-100"><Loader2 className="w-8 h-8 animate-spin text-[#1A6B4A]" /></div>
});

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('type') || '';
  const { isAuthenticated: isAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthenticated = mounted ? isAuth : false;

  const [listings, setListings] = useState<ListingSummary[]>(demoListings);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [minPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (categoryParam) params.append('type', categoryParam);
        if (minPrice > 0) params.append('minPrice', minPrice.toString());
        if (maxPrice < 1000000) params.append('maxPrice', maxPrice.toString());
        if (minRating > 0) params.append('rating', minRating.toString());

        const response = await api.get(`/listings?${params.toString()}`);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setListings(response.data);
          setIsDemoMode(false);
        } else {
          setListings(demoListings);
          setIsDemoMode(true);
        }
      } catch {
        setListings(demoListings);
        setIsDemoMode(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, [categoryParam, minPrice, maxPrice, minRating]);

  const visibleListings = listings.filter((listing) => matchesListingSearch(listing, searchQuery));

  const categories = [
    { icon: MapIcon, label: 'Toutes', type: '' },
    { icon: Hotel, label: 'Hébergements', type: 'HOTEL' },
    { icon: Utensils, label: 'Restaurants', type: 'RESTAURANT' },
    { icon: Music, label: 'Boîtes de Nuit', type: 'LEISURE_ACTIVITY' },
    { icon: Star, label: 'Sites & Nature', type: 'SITE' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] selection:bg-[#1A6B4A] selection:text-white">
      {/* Banner / Header */}
      <div className="relative pt-32 pb-12 px-6 md:px-12 max-w-screen-2xl mx-auto bg-gradient-to-br from-[#FAFAF8] to-[#F0F0EB]">
        <h1 className="text-4xl md:text-6xl font-black text-[#1A1A1A] tracking-tight mb-4">
          Explorez le Congo.
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl font-medium">
          Découvrez notre sélection exclusive d'établissements et d'activités vérifiés par Securits Tech.
        </p>
      </div>

      {/* Search & Filters Header */}
      <div className="sticky top-[72px] z-40 bg-[#FAFAF8]/90 backdrop-blur-xl border-b border-gray-200/60 pb-4 pt-4 transition-all">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
          
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1A6B4A] transition-colors" />
              <input 
                type="text" 
                placeholder="Quelle est votre prochaine destination ?" 
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-white border border-gray-200 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-[#1A6B4A]/10 focus:border-[#1A6B4A]/30 transition-all text-sm font-medium shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
                className="flex items-center justify-center gap-3 px-8 py-5 bg-white border border-gray-200 rounded-[24px] font-bold text-sm hover:border-[#1A6B4A]/30 hover:bg-[#FAFAF8] transition-all flex-1 md:flex-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <MapPinned className="w-5 h-5 text-[#1A6B4A]" />
                {viewMode === 'grid' ? 'Carte' : 'Grille'}
              </button>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-3 px-8 py-5 rounded-[24px] font-bold text-sm transition-all flex-1 md:flex-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${showFilters ? 'bg-[#1A1A1A] text-white border-transparent' : 'bg-white border border-gray-200 hover:border-[#1A6B4A]/30'}`}
              >
                <Filter className={`w-5 h-5 ${showFilters ? 'text-white' : 'text-[#1A6B4A]'}`} />
                Filtres
              </button>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat, i) => (
              <button 
                key={i} 
                onClick={() => router.push(cat.type ? `/explore?type=${cat.type}` : '/explore')}
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all min-w-fit border ${categoryParam === cat.type ? 'bg-[#1A6B4A] border-[#1A6B4A] text-white shadow-lg' : 'bg-white border-gray-200 text-gray-600 hover:border-[#1A6B4A]/40 hover:bg-[#FAFAF8]'}`}
              >
                <cat.icon className={`w-4 h-4 ${categoryParam === cat.type ? 'text-white' : 'text-gray-400'}`} />
                <span className="text-xs font-bold tracking-wide">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Filters (Desktop) */}
        {showFilters && (
          <aside className="lg:block space-y-8 col-span-1">
            <div className="sticky top-[280px] bg-white p-8 rounded-[32px] border border-gray-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)]">
              <div className="mb-8">
                <h3 className="font-black text-[#1A1A1A] mb-6 flex items-center justify-between">
                  Budget Maximum
                  <span className="text-[#1A6B4A] text-[10px] font-black uppercase tracking-widest bg-[#1A6B4A]/10 px-3 py-1.5 rounded-[8px]">
                    {maxPrice.toLocaleString()} FCFA
                  </span>
                </h3>
                <div className="space-y-6">
                  <input 
                    type="range" 
                    min="0"
                    max="1000000"
                    step="10000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-[#1A6B4A] h-2 rounded-full bg-gray-200 appearance-none cursor-pointer" 
                  />
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>0 FCFA</span>
                    <span>1M+ FCFA</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <h3 className="font-black text-[#1A1A1A] mb-6">Note Minimale</h3>
                <div className="space-y-4">
                  {[4, 3, 2, 0].map((star) => (
                    <label key={star} className="flex items-center gap-4 cursor-pointer group">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${minRating === star ? 'border-[#1A6B4A] bg-[#1A6B4A]' : 'border-gray-300 group-hover:border-[#1A6B4A]/50'}`}>
                        {minRating === star && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <input 
                        type="radio" 
                        name="rating"
                        checked={minRating === star}
                        onChange={() => setMinRating(star)}
                        className="hidden" 
                      />
                      <div className="flex items-center gap-2">
                        {star > 0 ? (
                          <>
                            <div className="flex">
                              {[...Array(star)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-[#C8860A] fill-[#C8860A]" />
                              ))}
                            </div>
                            <span className="text-sm font-bold text-gray-600 group-hover:text-[#1A1A1A] transition-colors">&amp; plus</span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-gray-600 group-hover:text-[#1A1A1A] transition-colors">Toutes les notes</span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Listings Content */}
        <div className={`transition-all duration-700 ${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-8">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-[#1A6B4A] animate-spin" />
              </div>
              <p className="text-gray-400 font-bold text-xl tracking-tight">Recherche des meilleures expériences...</p>
            </div>
          ) : viewMode === 'map' ? (
            <div className="h-[800px] w-full rounded-[40px] overflow-hidden border border-gray-200 shadow-2xl relative z-0">
              <MapView listings={visibleListings} />
            </div>
          ) : visibleListings.length === 0 ? (
            <div className="text-center py-40 bg-white rounded-[40px] border border-gray-100 shadow-sm">
              <div className="w-24 h-24 bg-[#1A6B4A]/5 rounded-full flex items-center justify-center mx-auto mb-8">
                <MapIcon className="text-[#1A6B4A] w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-[#1A1A1A] mb-4">Aucune pépite trouvée</h2>
              <p className="text-gray-500 max-w-md mx-auto font-medium">Essayez d'ajuster vos filtres pour découvrir de nouvelles expériences exclusives.</p>
            </div>
          ) : (
            <>
            {isDemoMode && (
              <div className="mb-10 bg-white border border-[#C8860A]/20 px-8 py-5 rounded-[24px] shadow-sm flex items-center gap-4">
                <div className="w-2.5 h-2.5 bg-[#C8860A] rounded-full animate-pulse" />
                <p className="text-sm font-bold text-[#C8860A] tracking-wide uppercase">Mode Démonstration · Catalogue Provisoire</p>
              </div>
            )}
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${showFilters ? 'xl:grid-cols-2' : 'xl:grid-cols-3'} gap-8`}>
              {visibleListings.map((item) => (
                <div key={item.id} className="group relative bg-white rounded-[32px] border border-gray-100 shadow-[0_12px_24px_-12px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-700 flex flex-col">
                  
                  {/* Image Area */}
                  <div className="relative h-[320px] overflow-hidden p-2">
                    <div className="relative w-full h-full rounded-[24px] overflow-hidden">
                      <img 
                        src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2940&auto=format&fit=crop'} 
                        alt={item.images?.[0]?.altText || item.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      {/* Gradient overlay for text legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                         <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[#1A6B4A] shadow-sm">
                           {getListingLabel(item)}
                         </span>
                      </div>
                      
                      <button className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-[#1A1A1A] transition-all transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 duration-500">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-8 pt-4 flex flex-col flex-grow relative">
                    <div className="flex items-center text-gray-500 text-[10px] font-black uppercase tracking-[0.25em] mb-4">
                      <MapPin className="w-4 h-4 mr-2 text-[#C8860A] shrink-0" />
                      <span className="truncate">{getListingLocation(item)}</span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-[#1A1A1A] mb-4 line-clamp-2 group-hover:text-[#1A6B4A] transition-colors leading-tight tracking-tight">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-8">
                      <div className="flex items-center text-[#C8860A]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-gray-400">(4.8)</span>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                      {isAuthenticated ? (
                        <>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tarif</span>
                            <p className="text-2xl font-black text-[#1A6B4A] tracking-tighter">
                              {getListingPrice(item).toLocaleString()} <span className="text-xs font-bold text-gray-500">FCFA</span>
                            </p>
                          </div>
                          <Link 
                            href={`/explore/${item.id}`}
                            className="bg-[#1A1A1A] text-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#1A6B4A] transition-all shadow-md group-hover:scale-110 active:scale-95"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                        </>
                      ) : (
                        <div className="w-full flex justify-between items-center bg-gray-50 p-4 rounded-[20px] border border-gray-200 group-hover:border-[#C8860A]/30 transition-colors">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-[#C8860A]/10 flex items-center justify-center">
                               <Shield className="w-5 h-5 text-[#C8860A]" />
                             </div>
                             <div>
                               <p className="text-[10px] font-black text-[#C8860A] uppercase tracking-widest">Connectez-vous</p>
                               <p className="text-[9px] text-gray-500 uppercase font-bold">Pour voir les prix</p>
                             </div>
                           </div>
                           <Link href="/auth/login" className="text-xs font-black text-[#1A1A1A] hover:text-[#1A6B4A] uppercase tracking-tighter p-2">
                             Login
                           </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <Loader2 className="w-12 h-12 text-[#1A6B4A] animate-spin" />
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
