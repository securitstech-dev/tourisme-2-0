'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Loader2,
  ArrowLeft,
  Calendar,
  Users
} from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Suspense } from 'react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();
  
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'MOMO'>('CARD');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/my-bookings`); // On filtre ct client pour simplifier
        const current = res.data.find((b: any) => b.id === id);
        setBooking(current);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleMobilePayment = async () => {
    if (!phone) {
      alert('Veuillez entrer votre numéro de téléphone.');
      return;
    }
    setIsProcessing(true);
    try {
      await api.post('/payments/mobile-money', {
        reservationId: id,
        phone: phone
      });
      alert('Demande de paiement envoyée sur votre téléphone. Veuillez valider avec votre code PIN.');
      router.push('/booking/success');
    } catch (error) {
      alert('Erreur lors de l\'initiation du paiement.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;

  if (!booking) return <div className="p-20 text-center font-bold">Réservation non trouvée.</div>;

  return (
    <div className="min-h-screen bg-accent/10 py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left: Payment Methods */}
        <div className="lg:col-span-2 space-y-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-subtext font-bold hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Retour à l'annonce
          </button>

          <h1 className="text-3xl font-black text-foreground">Finalisez votre réservation</h1>

          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 space-y-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Mode de paiement sécurisé
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setPaymentMethod('CARD')}
                className={`p-6 rounded-3xl border-2 text-left transition-all flex items-center gap-4 ${
                  paymentMethod === 'CARD' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-gray-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'CARD' ? 'bg-primary text-white' : 'bg-accent/30 text-subtext'}`}>
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Carte Bancaire</p>
                  <p className="text-xs text-subtext">Visa, Mastercard, AMEX</p>
                </div>
              </button>

              <button 
                onClick={() => setPaymentMethod('MOMO')}
                className={`p-6 rounded-3xl border-2 text-left transition-all flex items-center gap-4 ${
                  paymentMethod === 'MOMO' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-gray-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'MOMO' ? 'bg-secondary text-white' : 'bg-accent/30 text-subtext'}`}>
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Mobile Money</p>
                  <p className="text-xs text-subtext">MTN MoMo, Airtel Money</p>
                </div>
              </button>
            </div>

            {paymentMethod === 'CARD' ? (
              <div className="space-y-6 pt-6 border-t border-gray-50">
                <p className="text-sm text-subtext">L'intégration Stripe Elements sera affichée ici après installation des dépendances.</p>
                <button className="w-full bg-primary text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-primary/30 opacity-50 cursor-not-allowed">
                  Payer {(booking.totalPrice).toLocaleString()} FCFA
                </button>
              </div>
            ) : (
              <div className="space-y-6 pt-6 border-t border-gray-50 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-subtext ml-1">Numéro de téléphone (Congo)</label>
                  <div className="relative">
                    <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext/40" />
                    <input 
                      type="tel" 
                      placeholder="06 000 00 00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-16 pr-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleMobilePayment}
                  disabled={isProcessing}
                  className="w-full bg-primary text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : `Payer via Mobile Money`}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl p-8 space-y-6">
            <h3 className="text-xl font-bold">Récapitulatif</h3>
            
            <div className="flex gap-4 items-start">
              <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                <img 
                  src={booking.listing?.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=200'} 
                  className="w-full h-full object-cover"
                  alt="Listing"
                />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight mb-1">{booking.listing?.title}</p>
                <p className="text-xs text-subtext">{booking.listing?.listingType}</p>
              </div>
            </div>

            <div className="space-y-3 py-6 border-y border-gray-50">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-subtext">
                  <Calendar className="w-4 h-4" />
                  <span>Date</span>
                </div>
                <span className="font-bold">{format(new Date(booking.checkIn), 'dd MMM yyyy', { locale: fr })}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-subtext">
                  <Users className="w-4 h-4" />
                  <span>Usagers</span>
                </div>
                <span className="font-bold">{booking.guests} Usager{booking.guests > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-subtext">Total</span>
                <span className="text-2xl font-black text-primary">{booking.totalPrice.toLocaleString()} FCFA</span>
              </div>
              <p className="text-[10px] text-center text-subtext uppercase font-bold tracking-widest bg-accent/10 py-2 rounded-lg">
                TVA et taxes incluses
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-xs text-green-700 font-medium">
                Paiement sécurisé par cryptage SSL. Vos données bancaires ne sont jamais stockées sur nos serveurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
