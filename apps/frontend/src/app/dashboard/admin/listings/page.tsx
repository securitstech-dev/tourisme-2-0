'use client';

import { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  EyeOff, 
  Trash2, 
  Star,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function AdminListingsModeration() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for listings
  const [listings, setListings] = useState([
    {
      id: '1',
      title: 'Suite Royale - Radisson Blu',
      operator: 'Radisson Blu Brazzaville',
      type: 'HÔTEL',
      location: 'Brazzaville, Congo',
      price: 150000,
      status: 'ACTIVE',
      isFeatured: true,
      reports: 0,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: '2',
      title: 'Excursion Gorges de Diosso',
      operator: 'Kongo Tours',
      type: 'EXCURSION',
      location: 'Pointe-Noire, Congo',
      price: 25000,
      status: 'PENDING_REVIEW',
      isFeatured: false,
      reports: 0,
      image: 'https://images.unsplash.com/photo-1516483638261-f40af5ebcf89?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: '3',
      title: 'Villa Piscine Vue Mer',
      operator: 'Côte Sauvage Immo',
      type: 'HÔTEL',
      location: 'Pointe-Noire, Congo',
      price: 80000,
      status: 'REPORTED',
      isFeatured: false,
      reports: 3,
      image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=400'
    }
  ]);

  const getStatusBadge = (status: string, reports: number) => {
    if (reports > 0) return <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold"><AlertTriangle className="w-3 h-3" /> SIGNALÉE ({reports})</span>;
    switch (status) {
      case 'ACTIVE': return <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle2 className="w-3 h-3" /> ACTIVE</span>;
      case 'PENDING_REVIEW': return <span className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold"><Eye className="w-3 h-3" /> EN REVUE</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">INCONNUE</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Modération des Annonces</h1>
          <p className="text-gray-500 font-medium">Contrôlez la qualité des offres publiées sur la plateforme.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative w-72">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
             <input 
               type="text" 
               placeholder="Rechercher une annonce..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium"
             />
           </div>
           <button className="p-3 bg-white border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all flex items-center gap-2 font-bold">
             <Filter className="w-5 h-5" />
             Filtrer
           </button>
        </div>
      </div>

      {/* Table/List */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-widest text-gray-400 font-black">
                <th className="p-6 font-black">Annonce & Opérateur</th>
                <th className="p-6 font-black">Localisation</th>
                <th className="p-6 font-black">Prix</th>
                <th className="p-6 font-black">Statut</th>
                <th className="p-6 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm relative">
                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                        {listing.isFeatured && (
                          <div className="absolute top-1 right-1 bg-yellow-400 p-1 rounded-full shadow-md">
                            <Star className="w-3 h-3 text-white fill-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 group-hover:text-primary transition-colors">{listing.title}</p>
                        <p className="text-xs text-gray-500 font-bold mt-1">{listing.operator} • <span className="text-primary/60">{listing.type}</span></p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {listing.location}
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="font-black text-gray-900">{listing.price.toLocaleString()} FCFA</p>
                  </td>
                  <td className="p-6">
                    {getStatusBadge(listing.status, listing.reports)}
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all" title="Voir les dtails">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-xl transition-all" title="Mettre en avant">
                        <Star className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all" title="Masquer l'annonce">
                        <EyeOff className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Supprimer">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-6 border-t border-gray-50 flex items-center justify-between text-sm font-bold text-gray-500">
          <p>Affichage de 1 à 3 sur 156 annonces</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50">Précédent</button>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all">Suivant</button>
          </div>
        </div>
      </div>
    </div>
  );
}
