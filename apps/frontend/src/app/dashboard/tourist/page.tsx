'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Star, 
  ChevronRight, 
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle
} from 'lucide-react';
import api from '@/lib/api';

export default function TouristDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/my-bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Erreur lors de la rcupration des rservations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return { icon: CheckCircle2, text: 'Confirmée', bg: 'bg-green-100', color: 'text-green-600' };
      case 'PENDING': return { icon: Clock, text: 'En attente', bg: 'bg-orange-100', color: 'text-orange-600' };
      case 'CANCELLED': return { icon: AlertCircle, text: 'Annulée', bg: 'bg-red-100', color: 'text-red-600' };
      case 'REJECTED': return { icon: XCircle, text: 'Refusée', bg: 'bg-red-100', color: 'text-red-600' };
      case 'COMPLETED': return { icon: CheckCircle2, text: 'Terminée', bg: 'bg-blue-100', color: 'text-blue-600' };
      default: return { icon: Clock, text: 'Inconnu', bg: 'bg-gray-100', color: 'text-gray-600' };
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Mes Réservations</h1>
        <p className="text-subtext">Retrouvez l'historique de vos aventures au Congo.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-subtext font-bold">Chargement de vos voyages...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-20 rounded-[40px] border border-gray-100 shadow-sm text-center">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="text-primary w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Pas encore de réservation</h2>
          <p className="text-subtext mb-8">Il est temps de planifier votre prochaine escapade !</p>
          <a href="/explore" className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-all">
            Explorer les destinations
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const status = getStatusStyle(booking.status);
            return (
              <div key={booking.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-xl transition-all group">
                <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden">
                  <img 
                    src={booking.listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={booking.listing.title}
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">{booking.listing.type}</span>
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.color}`}>
                        <status.icon className="w-3.5 h-3.5" />
                        {status.text}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{booking.listing.title}</h3>
                    <div className="flex items-center text-subtext text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {booking.listing.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 md:mt-0">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-[10px] font-bold text-subtext uppercase tracking-widest">Date</p>
                        <p className="text-sm font-bold">{new Date(booking.checkIn).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-subtext uppercase tracking-widest">Montant</p>
                        <p className="text-sm font-bold text-primary">{booking.totalPrice.toLocaleString()} FCFA</p>
                      </div>
                    </div>
                    <button className="p-3 bg-accent/30 text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
