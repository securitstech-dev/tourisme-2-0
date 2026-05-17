'use client';

import { useState } from 'react';
import { 
  Phone, 
  CreditCard, 
  Smartphone, 
  Loader2, 
  CheckCircle2, 
  X,
  ArrowRight
} from 'lucide-react';
import api from '@/lib/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservationId: string;
  amount: number;
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, reservationId, amount, onSuccess }: PaymentModalProps) {
  const [method, setMethod] = useState<'MTN' | 'STRIPE'>('MTN');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      if (method === 'MTN') {
        const response = await api.post('/payments/mobile-money', {
          reservationId,
          phone
        });
        
        // Simuler une attente de validation
        setTimeout(() => {
          setIsSuccess(true);
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        }, 3000);
      }
    } catch (error) {
      console.error('Erreur de paiement:', error);
      alert('Une erreur est survenue lors du paiement.');
    } finally {
      // On laisse isLoading  true jusqu'au succès simulé
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {isSuccess ? (
          <div className="p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Paiement Réussi !</h2>
            <p className="text-subtext">Votre réservation est maintenant confirmée. Préparez vos valises !</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-primary p-8 text-white">
              <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-all">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-2">Finaliser le paiement</h2>
              <p className="text-white/60 font-medium">Total à payer : <span className="text-white text-lg font-black">{amount.toLocaleString()} FCFA</span></p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Method Selector */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setMethod('MTN')}
                  className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${
                    method === 'MTN' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-accent'
                  }`}
                >
                  <Smartphone className={`w-8 h-8 ${method === 'MTN' ? 'text-primary' : 'text-subtext'}`} />
                  <span className={`text-xs font-bold uppercase ${method === 'MTN' ? 'text-primary' : 'text-subtext'}`}>Mobile Money</span>
                </button>
                <button 
                  onClick={() => setMethod('STRIPE')}
                  className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all ${
                    method === 'STRIPE' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-accent'
                  }`}
                >
                  <CreditCard className={`w-8 h-8 ${method === 'STRIPE' ? 'text-primary' : 'text-subtext'}`} />
                  <span className={`text-xs font-bold uppercase ${method === 'STRIPE' ? 'text-primary' : 'text-subtext'}`}>Carte Bancaire</span>
                </button>
              </div>

              {/* Form */}
              {method === 'MTN' && (
                <div className="space-y-4 animate-in slide-in-from-bottom-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-subtext ml-1">Numéro MTN ou Airtel Money</label>
                    <div className="relative">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext/40" />
                      <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: 06 444 22 11"
                        className="w-full pl-16 pr-6 py-4 bg-accent/20 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 font-bold"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-subtext italic leading-relaxed text-center px-4">
                    Une notification apparaîtra sur votre téléphone pour confirmer la transaction.
                  </p>
                </div>
              )}

              {method === 'STRIPE' && (
                <div className="p-8 text-center bg-accent/10 rounded-3xl animate-in slide-in-from-bottom-2">
                  <CreditCard className="w-12 h-12 text-primary opacity-20 mx-auto mb-4" />
                  <p className="text-sm text-subtext font-bold">Le paiement par carte bancaire sera bientôt disponible.</p>
                </div>
              )}

              {/* Action */}
              <button 
                onClick={handlePayment}
                disabled={isLoading || (method === 'MTN' && !phone)}
                className="w-full bg-primary text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    Payer maintenant
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
