'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye,
  Hotel,
  MapPin,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

export default function OperatorListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const fetchListings = async () => {
    try {
      const response = await api.get('/listings/my-listings');
      setListings(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette annonce ? Cette action est irréversible.')) return;
    
    setIsDeleting(id);
    try {
      await api.delete(`/listings/${id}`);
      setListings(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression.');
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredListings = listings.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || 
                       l.location?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || l.listingType === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Mes Annonces</h1>
          <p className="text-subtext font-medium">Vous avez {listings.length} établissement{listings.length > 1 ? 's' : ''} enregistré{listings.length > 1 ? 's' : ''}.</p>
        </div>
        <Link href="/dashboard/operator/listings/new" className="bg-primary text-white px-8 py-4 rounded-[20px] font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20">
          <Plus className="w-5 h-5" />
          Ajouter une annonce
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext/40" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou lieu..." 
            className="w-full pl-14 pr-6 py-4 bg-accent/10 border-none rounded-[18px] focus:ring-2 focus:ring-primary/20 font-bold placeholder:text-subtext/40"
          />
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-60 py-4 px-6 bg-accent/10 border-none rounded-[18px] focus:ring-2 focus:ring-primary/20 font-bold cursor-pointer text-foreground"
        >
          <option value="ALL">Tous les types</option>
          <option value="HOTEL_ROOM">Chambres d'Hôtel</option>
          <option value="RESTAURANT_TABLE">Restaurants</option>
          <option value="EXCURSION">Excursions</option>
          <option value="EVENT_HALL_RENTAL">Salles de fête</option>
        </select>
      </div>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-subtext font-black uppercase tracking-widest text-[10px]">Chargement sécurisé...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="bg-white p-24 rounded-[40px] border border-gray-100 shadow-sm text-center">
          <div className="w-24 h-24 bg-accent/30 rounded-[32px] flex items-center justify-center mx-auto mb-8">
            <Hotel className="text-primary w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-3">Prêt à briller ?</h2>
          <p className="text-subtext mb-10 max-w-sm mx-auto font-medium">Commencez par ajouter votre premier établissement sur la plateforme Congo Tourisme.</p>
          <Link href="/dashboard/operator/listings/new" className="bg-primary text-white px-10 py-5 rounded-2xl font-black hover:opacity-90 transition-all shadow-2xl shadow-primary/20">
            Créer ma première annonce
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((item) => (
            <div key={item.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
              {/* Image Preview */}
              <div className="relative h-60 overflow-hidden bg-accent/20 flex items-center justify-center">
                {item.images && item.images.length > 0 ? (
                  <img 
                    src={item.images[0].url} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-20">
                    <Hotel className="w-16 h-16 text-primary" />
                    <span className="text-[10px] font-black uppercase">Pas de photo</span>
                  </div>
                )}
                
                {/* Status Badges */}
                <div className="absolute top-5 left-5 flex flex-col gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl ${
                    item.isAvailable ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    {item.isAvailable ? 'En ligne' : 'Hors ligne'}
                  </span>
                </div>

                {/* Quick Rating (Simulation) */}
                <div className="absolute bottom-5 right-5 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg border border-white/20">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Premium</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
                    {item.listingType?.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="font-black text-foreground text-xl mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center text-subtext text-xs font-bold mb-6">
                  <MapPin className="w-4 h-4 mr-1.5 text-primary" />
                  {item.location || 'Adresse non spécifiée'}
                </div>

                <div className="flex items-center justify-between py-6 border-y border-gray-50 mb-6">
                  <div>
                    <p className="text-[10px] text-subtext font-black uppercase tracking-widest mb-1">Tarif de base</p>
                    <p className="text-xl font-black text-primary">
                      {(item.pricePerNight || item.pricePerPerson || item.priceFlatRate || 0).toLocaleString()} <span className="text-xs">FCFA</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-subtext font-black uppercase tracking-widest mb-1">Réservations</p>
                    <p className="text-lg font-black text-foreground">{item._count?.reservations || 0}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                   <Link 
                    href={`/dashboard/operator/listings/edit/${item.id}`}
                    className="flex items-center justify-center gap-2 py-3.5 bg-accent/30 text-secondary rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-white transition-all shadow-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Modifier
                  </Link>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeleting === item.id}
                    className="flex items-center justify-center gap-2 py-3.5 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                  >
                    {isDeleting === item.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </>
                    )}
                  </button>
                </div>
                
                <Link 
                  href={`/explore/${item.id}`}
                  target="_blank"
                  className="w-full flex items-center justify-center gap-2 mt-3 py-3.5 bg-foreground text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-foreground/10"
                >
                  <Eye className="w-4 h-4" />
                  Voir sur le site
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
