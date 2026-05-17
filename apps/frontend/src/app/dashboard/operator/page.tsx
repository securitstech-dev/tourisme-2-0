/** Tableau de bord principal pour les operateurs valides. */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  BadgeCheck,
  Calendar,
  ChevronRight,
  CreditCard,
  Loader2,
  Plus,
  ShieldCheck,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react';

import api from '@/lib/api';

type OperatorStats = {
  revenue: number;
  bookings: number;
  visitors: number;
  conversion: number;
  subscription?: {
    plan?: string;
    endDate?: string | null;
    trialEndsAt?: string | null;
    isValidated?: boolean;
  };
};

type OperatorBooking = {
  id: string;
  totalPrice: number;
  paymentStatus: 'UNPAID' | 'PENDING' | 'PAID' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  tourist?: {
    firstName?: string | null;
    lastName?: string | null;
  } | null;
  listing?: {
    title?: string | null;
  } | null;
};

const fallbackStats: OperatorStats = {
  revenue: 0,
  bookings: 0,
  visitors: 0,
  conversion: 0,
  subscription: {
    plan: 'PROFESSIONAL',
    endDate: null,
    isValidated: false,
  },
};

function formatMoney(value: number) {
  return `${value.toLocaleString('fr-FR')} FCFA`;
}

function getPercent(value: number, max: number) {
  if (max <= 0) {
    return 0;
  }

  return Math.max(6, Math.min(100, Math.round((value / max) * 100)));
}

export default function OperatorDashboard() {
  const [data, setData] = useState<OperatorStats | null>(null);
  const [bookings, setBookings] = useState<OperatorBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get<OperatorStats>('/operators/stats'),
          api.get<OperatorBooking[]>('/bookings/operator'),
        ]);

        setData(statsRes.data);
        setBookings(bookingsRes.data);
      } catch {
        setData(fallbackStats);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const subscription = data?.subscription;
  const isValidated = Boolean(subscription?.isValidated);
  const trialDaysLeft = subscription?.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(subscription.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;
  const monthlyRevenue = [0.42, 0.58, 0.47, 0.72, 0.63, 1].map((ratio, index) => ({
    label: ['J-25', 'J-20', 'J-15', 'J-10', 'J-5', 'Auj.'][index],
    value: Math.round((data?.revenue ?? 0) * ratio),
  }));
  const maxRevenue = Math.max(...monthlyRevenue.map((item) => item.value), 1);
  const decisionMetrics = [
    { label: 'Visiteurs', value: data?.visitors ?? 0, tone: 'bg-danger' },
    { label: 'Demandes', value: data?.bookings ?? 0, tone: 'bg-secondary' },
    { label: 'Conversion', value: Math.round(data?.conversion ?? 0), tone: 'bg-primary' },
  ];
  const maxDecisionMetric = Math.max(...decisionMetrics.map((item) => item.value), 1);
  const stats = [
    {
      label: 'Revenus du mois',
      value: formatMoney(data?.revenue ?? 0),
      icon: CreditCard,
      tone: 'bg-primary/10 text-primary',
    },
    {
      label: 'Reservations',
      value: String(data?.bookings ?? 0),
      icon: Calendar,
      tone: 'bg-secondary/20 text-foreground',
    },
    {
      label: 'Visiteurs',
      value: String(data?.visitors ?? 0),
      icon: Users,
      tone: 'bg-danger/10 text-danger',
    },
    {
      label: 'Conversion',
      value: `${data?.conversion ?? 0}%`,
      icon: TrendingUp,
      tone: 'bg-accent text-primary',
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-danger">Espace partenaire</p>
          <h1 className="mt-2 text-3xl font-black text-foreground">Tableau de bord operateur</h1>
          <p className="mt-2 text-sm leading-6 text-subtext">
            Suivez vos offres, vos reservations, votre abonnement et votre statut de validation.
          </p>
        </div>
        <Link
          href="/dashboard/operator/listings/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-4 text-sm font-black text-white shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5" />
          Nouvelle offre
        </Link>
      </header>

      {!isValidated && (
        <div className="rounded-xl border border-secondary/40 bg-secondary/10 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-3">
              <ShieldCheck className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <h2 className="font-black text-foreground">Compte en attente de validation</h2>
                <p className="mt-1 text-sm leading-6 text-subtext">
                  Le superadmin doit valider les documents. Ensuite vous aurez 14 jours d essai gratuit avec acces complet.
                </p>
              </div>
            </div>
            <Link href="/dashboard/operator/onboarding" className="rounded-xl bg-foreground px-5 py-3 text-sm font-black text-white">
              Completer le dossier
            </Link>
          </div>
        </div>
      )}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${stat.tone}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-subtext">{stat.label}</p>
            <p className="mt-2 text-2xl font-black text-foreground">{stat.value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-8">
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-subtext">Pilotage commercial</p>
                <h2 className="mt-2 text-xl font-black text-foreground">Tendance des revenus</h2>
              </div>
              <p className="text-sm font-black text-primary">{formatMoney(data?.revenue ?? 0)}</p>
            </div>
            <div className="flex h-56 items-end gap-3 rounded-xl bg-accent/40 p-4">
              {monthlyRevenue.map((item) => (
                <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-2">
                  <div className="flex flex-1 items-end">
                    <div
                      className="w-full rounded-t-xl bg-primary shadow-sm"
                      style={{ height: `${getPercent(item.value, maxRevenue)}%` }}
                      title={formatMoney(item.value)}
                    />
                  </div>
                  <span className="text-center text-[10px] font-black text-subtext">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-widest text-subtext">Aide a la decision</p>
              <h2 className="mt-2 text-xl font-black text-foreground">Entonnoir d'activite</h2>
            </div>
            <div className="space-y-4">
              {decisionMetrics.map((metric) => (
                <div key={metric.label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-black text-foreground">{metric.label}</span>
                    <span className="font-bold text-subtext">{metric.value}</span>
                  </div>
                  <div className="h-4 rounded-full bg-accent">
                    <div
                      className={`h-4 rounded-full ${metric.tone}`}
                      style={{ width: `${getPercent(metric.value, maxDecisionMetric)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-border p-6">
            <h2 className="font-black text-foreground">Reservations recentes</h2>
            <Link href="/dashboard/operator/reservations" className="flex items-center gap-1 text-sm font-black text-primary">
              Voir tout
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {bookings.length === 0 ? (
              <div className="p-10 text-center">
                <Calendar className="mx-auto h-10 w-10 text-subtext/30" />
                <p className="mt-4 font-bold text-subtext">Aucune reservation pour le moment.</p>
              </div>
            ) : (
              bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="grid gap-3 p-5 md:grid-cols-[1fr_1fr_auto] md:items-center">
                  <div>
                    <p className="font-black text-foreground">
                      {booking.tourist?.firstName ?? 'Client'} {booking.tourist?.lastName ?? ''}
                    </p>
                    <p className="text-sm text-subtext">{booking.listing?.title ?? 'Offre touristique'}</p>
                  </div>
                  <p className="font-black text-primary">{formatMoney(booking.totalPrice)}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      booking.paymentStatus === 'PAID' ? 'bg-primary/10 text-primary' : 'bg-secondary/20 text-foreground'
                    }`}
                  >
                    {booking.paymentStatus === 'PAID' ? 'Paye' : 'En attente'}
                  </span>
                </div>
              ))
            )}
          </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-black text-foreground">Abonnement</h2>
              <BadgeCheck className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <span className="font-bold text-subtext">Plan actif</span>
                <span className="font-black text-foreground">{subscription?.plan ?? 'Aucun'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-bold text-subtext">Validation</span>
                <span className={isValidated ? 'font-black text-primary' : 'font-black text-danger'}>
                  {isValidated ? 'Valide' : 'En attente'}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-bold text-subtext">Essai gratuit</span>
                <span className="font-black text-foreground">
                  {trialDaysLeft > 0 ? `${trialDaysLeft} jours restants` : 'Termine'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-foreground p-6 text-white shadow-lg">
            <Store className="mb-5 h-8 w-8 text-secondary" />
            <h2 className="text-xl font-black">Priorite demo</h2>
            <p className="mt-3 text-sm leading-7 text-white/72">
              Ajoutez des photos nettes, une description courte et les pieces legales pour rassurer les partenaires.
            </p>
          </div>

          <div className="rounded-xl border border-danger/20 bg-danger/5 p-6">
            <AlertTriangle className="mb-5 h-7 w-7 text-danger" />
            <h2 className="font-black text-foreground">Securite</h2>
            <p className="mt-3 text-sm leading-6 text-subtext">
              Ne publiez aucune offre avant validation complete du dossier et paiement confirme.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
