'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Building2, CalendarCheck, TrendingUp,
  Clock, CheckCircle, XCircle, Loader2,
  ShieldCheck, Settings, Bell, CreditCard,
  BadgeCheck, AlertCircle, FileSearch, Eye,
  FileText
} from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type Tab = 'overview' | 'operators' | 'transactions';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [pendingOperators, setPendingOperators] = useState<any[]>([]);
  const [allOperators, setAllOperators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, pendingRes, allRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/operators/pending'),
        api.get('/admin/operators'),
      ]);
      setStats(statsRes.data);
      setPendingOperators(pendingRes.data);
      setAllOperators(allRes.data);
    } catch (error) {
      console.error('Erreur chargement admin:', error);
      // Optionnel: afficher un toast ou une alerte
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleValidate = async (id: string) => {
    if (!confirm('Valider cet opérateur ? Il aura accès à toutes les fonctionnalités.')) return;
    setActionLoading(id);
    try {
      await api.patch(`/admin/operators/${id}/validate`);
      setPendingOperators(prev => prev.filter(op => op.id !== id));
      setAllOperators(prev => prev.map(op => op.id === id ? { ...op, isValidated: true } : op));
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
    } catch {
      alert('Erreur lors de la validation.');
    } finally {
      setActionLoading(null);
    }
  };
  const handleReject = async (id: string) => {
    if (!confirm('Rejeter cet opérateur ? Son compte sera désactivé.')) return;
    setActionLoading(id);
    try {
      await api.patch(`/admin/operators/${id}/reject`);
      setPendingOperators(prev => prev.filter(op => op.id !== id));
      setAllOperators(prev => prev.filter(op => op.id !== id));
    } catch {
      alert('Erreur lors du rejet.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteOperator = async (id: string) => {
    if (!confirm('ATTENTION : Voulez-vous vraiment supprimer cet opérateur ? Toutes ses annonces, réservations et données seront définitivement effacées.')) return;
    setActionLoading(id);
    try {
      await api.delete(`/admin/operators/${id}`);
      setAllOperators(prev => prev.filter(op => op.id !== id));
      setPendingOperators(prev => prev.filter(op => op.id !== id));
      alert('Opérateur supprimé avec succès.');
    } catch {
      alert('Erreur lors de la suppression.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateDocStatus = async (docId: string, status: 'APPROVED' | 'REJECTED', reason?: string) => {
    try {
      await api.patch(`/admin/documents/${docId}/status`, { status, reason });
      // Mettre à jour localement l'opérateur sélectionné
      setSelectedOperator((prev: any) => ({
        ...prev,
        documents: prev.documents.map((d: any) => d.id === docId ? { ...d, status, rejectionReason: reason } : d)
      }));
      // Mettre à jour aussi dans la liste principale
      setPendingOperators(prev => prev.map(op => {
        if (op.documents?.some((d: any) => d.id === docId)) {
          return {
            ...op,
            documents: op.documents.map((d: any) => d.id === docId ? { ...d, status, rejectionReason: reason } : d)
          };
        }
        return op;
      }));
    } catch {
      alert("Erreur lors de la mise à jour du document.");
    }
  };

  const statCards = [
    {
      label: 'Opérateurs actifs',
      value: `${stats?.validatedOperators || 0} / ${stats?.operators || 0}`,
      icon: Users, color: 'text-blue-600', bg: 'bg-blue-50',
      sub: `${stats?.operators - stats?.validatedOperators || 0} en attente`,
    },
    {
      label: 'Annonces publiées',
      value: stats?.listings || 0,
      icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50',
      sub: 'Sur toute la plateforme',
    },
    {
      label: 'Réservations du mois',
      value: stats?.monthBookings || 0,
      icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50',
      sub: `${stats?.bookings || 0} total cumulé`,
    },
    {
      label: 'Revenus du mois',
      value: `${(stats?.monthRevenue || 0).toLocaleString()} FCFA`,
      icon: TrendingUp, color: 'text-secondary', bg: 'bg-secondary/10',
      sub: `Total : ${(stats?.revenue || 0).toLocaleString()} FCFA`,
    },
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Vue d\'ensemble' },
    { key: 'operators', label: 'Opérateurs' },
    { key: 'transactions', label: 'Transactions' },
  ];
  const planDistribution = ['STARTER', 'PROFESSIONAL', 'PREMIUM'].map((plan) => ({
    plan,
    count: allOperators.filter((operator) => operator.subscriptionPlan === plan).length,
  }));
  const maxPlanCount = Math.max(...planDistribution.map((item) => item.count), 1);
  const validationRate = stats?.operators ? Math.round(((stats.validatedOperators || 0) / stats.operators) * 100) : 0;
  const decisionSignals = [
    { label: 'Validation dossiers', value: validationRate, color: 'bg-primary' },
    { label: 'Croissance mensuelle', value: Math.min(100, (stats?.monthBookings || 0) * 10), color: 'bg-secondary' },
    { label: 'Risque attente', value: Math.min(100, pendingOperators.length * 20), color: 'bg-danger' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord Super Admin</h1>
        <p className="text-subtext">Pilotez la croissance et la conformité de Congo Tourisme — Securits Tech.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === t.key ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-subtext hover:bg-accent/50'
            }`}
          >
            {t.label}
            {t.key === 'operators' && pendingOperators.length > 0 && (
              <span className="ml-2 bg-orange-500 text-white text-[10px] w-5 h-5 rounded-full inline-flex items-center justify-center font-black">
                {pendingOperators.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {statCards.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-subtext uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-xl font-black text-foreground">{isLoading ? '...' : stat.value}</p>
                <p className="text-[10px] text-subtext mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-subtext">Decision business</p>
                  <h2 className="text-xl font-black text-foreground">Repartition des plans SaaS</h2>
                </div>
                <p className="text-sm font-black text-primary">{allOperators.length} operateurs</p>
              </div>
              <div className="space-y-5">
                {planDistribution.map((item) => (
                  <div key={item.plan}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-black text-foreground">{item.plan}</span>
                      <span className="font-bold text-subtext">{item.count}</span>
                    </div>
                    <div className="h-5 rounded-full bg-accent">
                      <div
                        className="h-5 rounded-full bg-primary"
                        style={{ width: `${Math.max(8, Math.round((item.count / maxPlanCount) * 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-subtext">Signaux de pilotage</p>
              <h2 className="mt-2 text-xl font-black text-foreground">Sante de la plateforme</h2>
              <div className="mt-6 space-y-5">
                {decisionSignals.map((signal) => (
                  <div key={signal.label}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-black text-foreground">{signal.label}</span>
                      <span className="font-bold text-subtext">{signal.value}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-accent">
                      <div className={`h-3 rounded-full ${signal.color}`} style={{ width: `${signal.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Validations en attente */}
            <div className="lg:col-span-2 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Opérateurs en attente de validation
                </h3>
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                  {pendingOperators.length} en attente
                </span>
              </div>

              <div className="divide-y divide-gray-50">
                {isLoading ? (
                  <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                ) : pendingOperators.length === 0 ? (
                  <div className="p-12 text-center">
                    <BadgeCheck className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p className="text-subtext font-medium">Tout est à jour — aucune demande en attente.</p>
                  </div>
                ) : (
                  pendingOperators.map((op) => (
                    <div key={op.id} className="p-6 hover:bg-accent/5 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-primary font-bold text-lg">
                          {op.businessName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{op.businessName}</p>
                          <p className="text-sm text-subtext">{op.user?.email} · {op.city}</p>
                          <p className="text-[10px] text-subtext uppercase tracking-wider mt-1">
                            {op.businessType} · Plan {op.subscriptionPlan}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setSelectedOperator(op); setIsReviewModalOpen(true); }}
                          className="flex items-center gap-1 px-4 py-2 bg-accent/20 text-foreground text-xs font-bold rounded-xl hover:bg-accent/40 transition-all"
                        >
                          <FileSearch className="w-4 h-4" /> Voir le dossier
                        </button>
                        {actionLoading === op.id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        ) : (
                          <>
                            <button
                              onClick={() => handleValidate(op.id)}
                              disabled={!op.documents?.every((d: any) => d.status === 'APPROVED')}
                              className="flex items-center gap-1 px-4 py-2 bg-green-50 text-green-700 text-xs font-bold rounded-xl hover:bg-green-100 transition-all border border-green-100 disabled:opacity-30"
                            >
                              <CheckCircle className="w-4 h-4" /> Valider l'accès
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Panneau latéral */}
            <div className="space-y-6">
              <div className="bg-secondary p-8 rounded-[32px] text-white shadow-xl shadow-secondary/20 relative overflow-hidden">
                <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
                <h4 className="text-lg font-bold mb-4">Statut Système</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Base de données', status: 'En ligne' },
                    { label: 'Serveur API', status: 'Stable' },
                    { label: 'Cloudinary CDN', status: 'OK' },
                    { label: 'Chatbot Kongo', status: 'Actif' },
                  ].map(({ label, status }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="opacity-80">{label}</span>
                      <span className="flex items-center gap-1 font-bold">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <h4 className="text-lg font-bold text-foreground mb-4">Actions Rapides</h4>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 bg-accent/20 rounded-2xl hover:bg-accent/40 transition-all text-center group">
                    <div className="w-10 h-10 bg-white rounded-xl mx-auto mb-2 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Notifier</span>
                  </button>
                  <button className="p-4 bg-accent/20 rounded-2xl hover:bg-accent/40 transition-all text-center group">
                    <div className="w-10 h-10 bg-white rounded-xl mx-auto mb-2 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Settings className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Config</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ──── ONGLET OPÉRATEURS ──── */}
      {activeTab === 'operators' && (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-xl font-bold text-foreground">Tous les Opérateurs</h2>
            <p className="text-subtext text-sm mt-1">{allOperators.length} opérateur(s) enregistré(s)</p>
          </div>
          <div>
            {isLoading ? (
              <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" /></div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead>
                      <tr className="bg-accent/5 text-subtext text-[10px] uppercase tracking-widest font-black">
                        <th className="px-8 py-4">Entreprise</th>
                        <th className="px-8 py-4">Type</th>
                        <th className="px-8 py-4">Ville</th>
                        <th className="px-8 py-4">Plan</th>
                        <th className="px-8 py-4">Annonces</th>
                        <th className="px-8 py-4">Statut</th>
                        <th className="px-8 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {allOperators.map((op) => (
                        <tr key={op.id} className="hover:bg-accent/5 transition-colors">
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                {op.businessName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-foreground text-sm">{op.businessName}</p>
                                <p className="text-[10px] text-subtext">{op.user?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-4 text-sm text-subtext">{op.businessType}</td>
                          <td className="px-8 py-4 text-sm text-subtext">{op.city}</td>
                          <td className="px-8 py-4">
                            <span className="px-2 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase rounded-lg">
                              {op.subscriptionPlan}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-sm font-bold text-foreground">{op.listings?.length || 0}</td>
                          <td className="px-8 py-4">
                            {op.isValidated ? (
                              <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                <BadgeCheck className="w-4 h-4" /> Validé
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-orange-500 text-xs font-bold">
                                <AlertCircle className="w-4 h-4" /> En attente
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-4 text-right">
                            <div className="flex justify-end gap-3">
                              {!op.isValidated && (
                                <>
                                  {actionLoading === op.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                  ) : (
                                    <>
                                      <button onClick={() => handleValidate(op.id)} className="text-green-600 font-bold text-xs hover:underline">Valider</button>
                                      <button onClick={() => handleReject(op.id)} className="text-orange-500 font-bold text-xs hover:underline">Rejeter</button>
                                    </>
                                  )}
                                </>
                              )}
                              <button 
                                onClick={() => handleDeleteOperator(op.id)} 
                                className="text-red-500 font-bold text-xs hover:underline"
                                disabled={actionLoading === op.id}
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View (Cards) */}
                <div className="md:hidden divide-y divide-gray-100">
                  {allOperators.map((op) => (
                    <div key={op.id} className="p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-lg">
                          {op.businessName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-foreground">{op.businessName}</p>
                          <p className="text-xs text-subtext">{op.user?.email}</p>
                        </div>
                        {op.isValidated ? (
                          <BadgeCheck className="w-6 h-6 text-green-600" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-orange-500" />
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-accent/5 p-3 rounded-2xl">
                          <p className="text-[10px] font-black text-subtext uppercase tracking-widest mb-1">Type</p>
                          <p className="text-xs font-bold text-foreground">{op.businessType}</p>
                        </div>
                        <div className="bg-accent/5 p-3 rounded-2xl">
                          <p className="text-[10px] font-black text-subtext uppercase tracking-widest mb-1">Ville</p>
                          <p className="text-xs font-bold text-foreground">{op.city}</p>
                        </div>
                        <div className="bg-accent/5 p-3 rounded-2xl">
                          <p className="text-[10px] font-black text-subtext uppercase tracking-widest mb-1">Plan</p>
                          <p className="text-xs font-bold text-secondary uppercase">{op.subscriptionPlan}</p>
                        </div>
                        <div className="bg-accent/5 p-3 rounded-2xl">
                          <p className="text-[10px] font-black text-subtext uppercase tracking-widest mb-1">Annonces</p>
                          <p className="text-xs font-bold text-foreground">{op.listings?.length || 0}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        {!op.isValidated && (
                          <>
                            <button 
                              onClick={() => handleValidate(op.id)}
                              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-green-600/20"
                            >
                              Valider
                            </button>
                            <button 
                              onClick={() => handleReject(op.id)}
                              className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-orange-500/20"
                            >
                              Rejeter
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDeleteOperator(op.id)}
                          className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold text-xs"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ──── ONGLET TRANSACTIONS ──── */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-secondary" />
            <div>
              <h2 className="text-xl font-bold text-foreground">Transactions Récentes</h2>
              <p className="text-subtext text-sm">10 derniers paiements validés sur la plateforme</p>
            </div>
          </div>
          {isLoading ? (
            <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" /></div>
          ) : !stats?.recentPayments?.length ? (
            <div className="p-20 text-center">
              <TrendingUp className="w-12 h-12 text-subtext/20 mx-auto mb-4" />
              <p className="text-subtext font-medium">Aucune transaction enregistrée pour le moment.</p>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-accent/5 text-subtext text-[10px] uppercase tracking-widest font-black">
                    <th className="px-8 py-4">Client</th>
                    <th className="px-8 py-4">Offre</th>
                    <th className="px-8 py-4">Montant</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4">Méthode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recentPayments.map((payment: any) => (
                    <tr key={payment.id} className="hover:bg-accent/5 transition-colors">
                      <td className="px-8 py-4">
                        <p className="font-bold text-sm text-foreground">
                          {payment.reservation?.tourist?.firstName} {payment.reservation?.tourist?.lastName}
                        </p>
                        <p className="text-[10px] text-subtext">{payment.reservation?.tourist?.email}</p>
                      </td>
                      <td className="px-8 py-4 text-sm text-foreground font-medium">
                        {payment.reservation?.listing?.title || '—'}
                      </td>
                      <td className="px-8 py-4">
                        <p className="font-black text-primary">{payment.amount?.toLocaleString()} FCFA</p>
                      </td>
                      <td className="px-8 py-4 text-sm text-subtext">
                        {payment.paidAt
                          ? format(new Date(payment.paidAt), 'dd MMM yyyy', { locale: fr })
                          : '—'}
                      </td>
                      <td className="px-8 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                          payment.method === 'STRIPE' ? 'bg-blue-100 text-blue-700' :
                          payment.method?.includes('MTN') ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {payment.method?.replace('MOBILE_MONEY_', '') || '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>

              {/* Mobile View (Cards) */}
              <div className="md:hidden divide-y divide-gray-100">
                {stats.recentPayments.map((payment: any) => (
                  <div key={payment.id} className="p-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-foreground">
                          {payment.reservation?.tourist?.firstName} {payment.reservation?.tourist?.lastName}
                        </p>
                        <p className="text-xs text-subtext">{payment.reservation?.tourist?.email}</p>
                      </div>
                      <p className="font-black text-primary text-lg">
                        {payment.amount?.toLocaleString()} FCFA
                      </p>
                    </div>
                    <div className="bg-accent/5 p-3 rounded-2xl">
                      <p className="text-[10px] font-black text-subtext uppercase tracking-widest mb-1">Offre</p>
                      <p className="text-xs font-bold text-foreground truncate">
                        {payment.reservation?.listing?.title || '—'}
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <p className="text-subtext font-bold">
                        {payment.paidAt
                          ? format(new Date(payment.paidAt), 'dd MMM yyyy', { locale: fr })
                          : '—'}
                      </p>
                      <span className="px-2 py-1 bg-accent/50 text-subtext text-[9px] font-black rounded-lg uppercase">
                        {payment.method?.replace('MOBILE_MONEY_', '') || '—'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* MODALE DE REVUE DE DOSSIER */}
      {isReviewModalOpen && selectedOperator && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-accent/5">
              <div>
                <h2 className="text-2xl font-black text-foreground">Étude du dossier : {selectedOperator.businessName}</h2>
                <p className="text-subtext text-sm">Vérifiez la validité des documents avant de valider l'essai de 14 jours.</p>
              </div>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Infos Gérant */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <h3 className="font-black text-sm uppercase tracking-widest text-subtext mb-4">Informations Gérant</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-subtext uppercase">Nom du Gérant</p>
                        <p className="font-bold text-foreground">{selectedOperator.managerName || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-subtext uppercase">Téléphone / WhatsApp</p>
                        <p className="font-bold text-foreground">{selectedOperator.phone}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-subtext uppercase">Adresse Légale</p>
                        <p className="text-sm font-medium text-foreground">{selectedOperator.legalAddress || 'Non renseignée'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                    <h3 className="font-black text-sm text-primary mb-2">Décision Finale</h3>
                    <p className="text-xs text-subtext mb-4">Une fois tous les documents approuvés, vous pourrez valider l'accès de l'opérateur.</p>
                    <button
                      onClick={() => { handleValidate(selectedOperator.id); setIsReviewModalOpen(false); }}
                      disabled={!selectedOperator.documents?.every((d: any) => d.status === 'APPROVED')}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-primary/20 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                    >
                      <BadgeCheck className="w-5 h-5" /> Valider l'Opérateur
                    </button>
                  </div>
                </div>

                {/* Documents */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-black text-sm uppercase tracking-widest text-subtext px-2">Pièces Justificatives</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedOperator.documents?.length === 0 ? (
                      <div className="p-10 text-center bg-orange-50 rounded-3xl border border-orange-100">
                        <AlertCircle className="w-10 h-10 text-orange-400 mx-auto mb-2" />
                        <p className="font-bold text-orange-700">Aucun document téléversé pour le moment.</p>
                      </div>
                    ) : (
                      selectedOperator.documents.map((doc: any) => (
                        <div key={doc.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:shadow-md transition-all">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              doc.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 
                              doc.status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-accent/10 text-primary'
                            }`}>
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-foreground">{doc.type}</p>
                              <p className="text-[10px] text-subtext uppercase font-bold tracking-tighter">Statut : {doc.status}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a 
                              href={doc.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-50 text-subtext rounded-lg hover:bg-primary hover:text-white transition-all"
                              title="Voir le document"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            {doc.status === 'PENDING' && (
                              <>
                                <button 
                                  onClick={() => handleUpdateDocStatus(doc.id, 'APPROVED')}
                                  className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                                  title="Approuver"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    const reason = prompt('Motif du rejet :');
                                    if (reason) handleUpdateDocStatus(doc.id, 'REJECTED', reason);
                                  }}
                                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                  title="Rejeter"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
