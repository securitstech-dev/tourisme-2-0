'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  ArrowUpRight,
  Loader2,
  Calendar,
  Building2,
  Wallet
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AdminFinancePage() {
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const response = await api.get('/admin/finance/summary');
        setSummary(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données financières:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFinanceData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-foreground mb-2">Gestion Financière</h1>
        <p className="text-subtext">Vue en temps réel des abonnements et revenus générés par la plateforme.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-bold text-subtext uppercase tracking-widest mb-1">MRR (Mensuel)</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-foreground">{summary?.mrr?.toLocaleString('fr-FR')}</h3>
            <span className="text-sm font-bold text-subtext pb-1">FCFA</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4">
            <Wallet className="w-6 h-6 text-secondary" />
          </div>
          <p className="text-sm font-bold text-subtext uppercase tracking-widest mb-1">ARR (Annuel Projeté)</p>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-foreground">{summary?.arr?.toLocaleString('fr-FR')}</h3>
            <span className="text-sm font-bold text-subtext pb-1">FCFA</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm font-bold text-subtext uppercase tracking-widest mb-1">Abonnements Actifs</p>
          <h3 className="text-3xl font-black text-foreground">{summary?.activeCount}</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-sm font-bold text-subtext uppercase tracking-widest mb-1">Abonnements Expirés</p>
          <h3 className="text-3xl font-black text-foreground">{summary?.expiredCount}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Répartition par plan */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-foreground mb-6">Répartition par Plan</h3>
          <div className="space-y-6">
            {summary?.planBreakdown?.map((plan: any) => (
              <div key={plan.plan} className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground text-sm">{plan.plan}</p>
                  <p className="text-xs text-subtext font-medium">{plan.count} abonnés</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-primary">{plan.revenue.toLocaleString('fr-FR')} <span className="text-[10px]">FCFA</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historique des 12 derniers mois */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-foreground mb-6">Évolution des Revenus (12 derniers mois)</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {summary?.revenueByMonth?.map((month: any, i: number) => {
              const maxRevenue = Math.max(...(summary?.revenueByMonth?.map((m: any) => m.revenue) || [1]));
              const height = `${Math.max(10, (month.revenue / maxRevenue) * 100)}%`;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    {month.revenue.toLocaleString('fr-FR')} FCFA ({month.operators} op.)
                  </div>
                  <div 
                    className="w-full bg-primary/20 rounded-t-sm group-hover:bg-primary transition-colors"
                    style={{ height }}
                  />
                  <span className="text-[10px] font-bold text-subtext uppercase">{month.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Nouveaux abonnements du mois */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-xl font-black text-foreground">Nouveaux Abonnements (Ce mois)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-accent/10">
                <th className="px-8 py-4 text-[10px] font-black text-subtext uppercase tracking-widest">Établissement</th>
                <th className="px-8 py-4 text-[10px] font-black text-subtext uppercase tracking-widest">Ville</th>
                <th className="px-8 py-4 text-[10px] font-black text-subtext uppercase tracking-widest">Plan</th>
                <th className="px-8 py-4 text-[10px] font-black text-subtext uppercase tracking-widest">Email</th>
                <th className="px-8 py-4 text-[10px] font-black text-subtext uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {summary?.newThisMonth?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-subtext font-medium">
                    Aucun nouvel abonnement ce mois-ci.
                  </td>
                </tr>
              ) : (
                summary?.newThisMonth?.map((op: any, i: number) => (
                  <tr key={i} className="hover:bg-accent/5">
                    <td className="px-8 py-4 font-bold text-foreground text-sm">{op.businessName}</td>
                    <td className="px-8 py-4 text-sm text-subtext">{op.city}</td>
                    <td className="px-8 py-4">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        {op.subscriptionPlan}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-sm text-subtext">{op.user?.email}</td>
                    <td className="px-8 py-4 text-sm font-medium">
                      {format(new Date(op.validatedAt), 'dd MMM yyyy', { locale: fr })}
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
