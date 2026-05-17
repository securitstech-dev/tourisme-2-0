'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  Receipt, 
  Download, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Calendar,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

export default function BillingPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subsRes, statusRes] = await Promise.all([
          api.get('/subscriptions/my-subscriptions'),
          api.get('/subscriptions/status')
        ]);
        setSubscriptions(subsRes.data);
        setStatus(statusRes.data);
      } catch (error) {
        console.error('Erreur lors du chargement de la facturation:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Facturation & Abonnements</h1>
          <p className="text-subtext text-lg mt-2">Gérez vos paiements, téléchargez vos factures et suivez votre plan.</p>
        </div>
        <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
          <CreditCard className="w-5 h-5" />
          Renouveler mon plan
        </button>
      </div>

      {/* Current Plan Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-6">
                Plan Actuel
              </div>
              <h2 className="text-5xl font-black text-foreground mb-2">{status?.plan || 'STARTER'}</h2>
              <p className="text-subtext font-medium">Prochain prélèvement le {status?.expiryDate ? format(new Date(status.expiryDate), 'dd MMMM yyyy', { locale: fr }) : 'N/A'}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-foreground">
                {status?.plan === 'STARTER' ? '15 000' : status?.plan === 'PROFESSIONAL' ? '45 000' : '120 000'}
                <span className="text-lg text-subtext ml-2">FCFA/mois</span>
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
            <div className="p-6 bg-accent/30 rounded-[28px] border border-white">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="font-bold text-foreground">Statut du compte</span>
              </div>
              <p className="text-2xl font-black text-green-600">Actif</p>
            </div>
            <div className="p-6 bg-accent/30 rounded-[28px] border border-white">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-bold text-foreground">Jours restants</span>
              </div>
              <p className="text-2xl font-black text-primary">
                {status?.expiryDate ? Math.max(0, Math.ceil((new Date(status.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0} jours
              </p>
            </div>
          </div>
        </div>

        <div className="bg-foreground rounded-[40px] p-10 text-white shadow-2xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-2xl font-black leading-tight">Besoin de passer à la vitesse supérieure ?</h3>
            <p className="text-white/60 leading-relaxed">
              Le plan <b>PROFESSIONAL</b> vous offre la mise en avant dans les recherches et le support prioritaire.
            </p>
          </div>
          <button className="mt-8 flex items-center justify-between w-full p-6 bg-white/10 hover:bg-white/20 border border-white/20 rounded-[24px] transition-all group">
            <span className="font-bold">Comparer les plans</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-2xl font-black tracking-tight text-foreground">Historique des factures</h3>
          <button className="text-subtext font-bold text-sm hover:text-primary transition-colors flex items-center gap-2">
            Tout exporter <Download className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-accent/10">
                <th className="px-10 py-5 text-[10px] font-black text-subtext uppercase tracking-widest">Numéro</th>
                <th className="px-10 py-5 text-[10px] font-black text-subtext uppercase tracking-widest">Date</th>
                <th className="px-10 py-5 text-[10px] font-black text-subtext uppercase tracking-widest">Plan</th>
                <th className="px-10 py-5 text-[10px] font-black text-subtext uppercase tracking-widest">Montant</th>
                <th className="px-10 py-5 text-[10px] font-black text-subtext uppercase tracking-widest">Statut</th>
                <th className="px-10 py-5 text-[10px] font-black text-subtext uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-24 text-center">
                    <Receipt className="w-16 h-16 text-subtext/20 mx-auto mb-4" />
                    <p className="text-subtext font-bold text-xl">Aucune facture disponible.</p>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub, i) => (
                  <tr key={sub.id} className="hover:bg-accent/5 transition-colors group">
                    <td className="px-10 py-6 font-black text-foreground text-sm uppercase">INV-{sub.id.substring(0, 8)}</td>
                    <td className="px-10 py-6 text-sm text-subtext font-medium">{format(new Date(sub.createdAt), 'dd MMM yyyy', { locale: fr })}</td>
                    <td className="px-10 py-6">
                      <span className="font-bold text-foreground text-sm">{sub.plan}</span>
                    </td>
                    <td className="px-10 py-6 font-black text-foreground text-sm">{sub.amount.toLocaleString()} FCFA</td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        sub.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {sub.paymentStatus === 'PAID' ? '✓ Payé' : 'Non Payé'}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <button 
                          className="p-2.5 rounded-xl bg-accent/50 text-subtext hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          title="Télécharger PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2.5 rounded-xl bg-accent/50 text-subtext hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          title="Voir en ligne"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
