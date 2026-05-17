'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Search, 
  Download,
  CheckCircle2,
  XCircle,
  Loader2,
  MoreVertical,
  Clock
} from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Menu d'actions contextuel par réservation
function ActionMenu({ bookingId, currentStatus, onStatusChange }: {
  bookingId: string;
  currentStatus: string;
  onStatusChange: (id: string, newStatus: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu en cliquant ailleurs
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAction = async (newStatus: string) => {
    setLoading(true);
    setOpen(false);
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      onStatusChange(bookingId, newStatus);
    } catch {
      // Erreur silencieuse pour l'instant — logger à implémenter
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus === 'CONFIRMED' || currentStatus === 'CANCELLED') {
    return (
      <span className="text-[10px] text-subtext italic">
        {currentStatus === 'CONFIRMED' ? 'Aucune action' : 'Archivée'}
      </span>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="p-2 hover:bg-accent/20 rounded-lg transition-all text-subtext disabled:opacity-50"
        title="Actions"
      >
        {loading
          ? <Loader2 className="w-5 h-5 animate-spin" />
          : <MoreVertical className="w-5 h-5" />
        }
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 w-52 overflow-hidden">
          <button
            onClick={() => handleAction('CONFIRMED')}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-green-700 hover:bg-green-50 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Confirmer la réservation
          </button>
          <button
            onClick={() => handleAction('REJECTED')}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Rejeter la réservation
          </button>
          <button
            onClick={() => handleAction('CANCELLED')}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-subtext hover:bg-gray-50 transition-colors border-t border-gray-50"
          >
            <Clock className="w-4 h-4" />
            Marquer comme annulée
          </button>
        </div>
      )}
    </div>
  );
}

export default function OperatorReservationsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/operator');
        setBookings(response.data);
      } catch {
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Mise à jour locale du statut sans rechargement complet
  const handleStatusChange = (id: string, newStatus: string) => {
    setBookings(prev =>
      prev.map(b => b.id === id ? { ...b, status: newStatus } : b)
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return { text: 'Confirmée', bg: 'bg-green-100', color: 'text-green-700' };
      case 'PENDING':   return { text: 'En attente', bg: 'bg-orange-100', color: 'text-orange-600' };
      case 'CANCELLED': return { text: 'Annulée', bg: 'bg-red-100', color: 'text-red-600' };
      case 'REJECTED':  return { text: 'Rejetée', bg: 'bg-gray-100', color: 'text-gray-600' };
      case 'COMPLETED': return { text: 'Terminée', bg: 'bg-blue-100', color: 'text-blue-600' };
      default:          return { text: status, bg: 'bg-gray-100', color: 'text-gray-600' };
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchFilter = filter === 'ALL' || b.status === filter;
    const matchSearch = search === '' || 
      `${b.tourist?.firstName} ${b.tourist?.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      b.listing?.title?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des Réservations</h1>
          <p className="text-subtext">Consultez et gérez toutes les demandes de vos clients.</p>
        </div>
        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 font-bold text-sm shadow-sm hover:bg-accent/10 transition-all">
          <Download className="w-4 h-4" />
          Exporter CSV
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext/40" />
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par client ou offre..." 
            className="w-full pl-12 pr-4 py-3 bg-accent/20 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {[
            { key: 'ALL', label: 'Tous' },
            { key: 'PENDING', label: 'En attente' },
            { key: 'CONFIRMED', label: 'Confirmé' },
            { key: 'REJECTED', label: 'Rejeté' },
            { key: 'CANCELLED', label: 'Annulé' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === key ? 'bg-primary text-white' : 'bg-accent/10 text-subtext hover:bg-accent/20'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" /></div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-20 text-center">
            <Calendar className="w-12 h-12 text-subtext/20 mx-auto mb-4" />
            <p className="text-subtext font-bold">Aucune réservation trouvée.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-accent/5 text-subtext text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Offre</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Montant</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBookings.map((b) => {
                  const status = getStatusStyle(b.status);
                  return (
                    <tr key={b.id} className="hover:bg-accent/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {b.tourist?.firstName?.charAt(0)}{b.tourist?.lastName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">{b.tourist?.firstName} {b.tourist?.lastName}</p>
                            <p className="text-[10px] text-subtext">{b.tourist?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm text-foreground">{b.listing?.title}</p>
                        <p className="text-[10px] text-subtext uppercase tracking-wider">{b.listing?.listingType}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-foreground">
                          {format(new Date(b.checkIn), 'dd MMM', { locale: fr })}
                          {b.checkOut
                            ? ` — ${format(new Date(b.checkOut), 'dd MMM yyyy', { locale: fr })}`
                            : ' (date de fin non définie)'}
                        </p>
                        <p className="text-[10px] text-subtext">{b.guests} usager{b.guests > 1 ? 's' : ''}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-black text-primary text-sm">{b.totalPrice?.toLocaleString()} FCFA</p>
                        <p className={`text-[10px] font-bold ${b.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-500'}`}>
                          {b.paymentStatus === 'PAID' ? '✓ Payé' : '⏳ En attente paiement'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${status.bg} ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ActionMenu
                          bookingId={b.id}
                          currentStatus={b.status}
                          onStatusChange={handleStatusChange}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
