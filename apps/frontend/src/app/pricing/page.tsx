/** Page des tarifs operateur. */
'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

import { operatorPlans } from '@/lib/site-content';

export default function PricingPage() {
  return (
    <div className="bg-background pb-20">
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[600px] w-full max-w-7xl bg-[radial-gradient(circle_at_center,_rgba(26,107,74,0.05),_transparent)] blur-3xl" />
        
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full glass border-primary/10 px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              <ShieldCheck className="h-4 w-4" />
              Partenariats Opérateurs
            </div>
            <h1 className="text-6xl font-bold leading-[1.1] tracking-tight lg:text-8xl">
              Propulsez votre <span className="text-gradient">Visibilité</span>
            </h1>
            <p className="max-w-2xl text-xl leading-relaxed text-subtext">
              Rejoignez l'écosystème touristique leader en République du Congo. Choisissez le pack qui correspond à votre ambition et bénéficiez d'une vitrine technologique de pointe.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
          {operatorPlans.map((plan, idx) => (
            <article
              key={plan.name}
              className={`relative overflow-hidden rounded-[40px] border p-10 transition-all duration-700 hover:-translate-y-4 hover:shadow-2xl ${
                plan.featured
                  ? 'border-primary/20 bg-white shadow-xl shadow-primary/5'
                  : 'border-border bg-white/50'
              }`}
            >
              {plan.featured && (
                <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-primary/10 blur-2xl" />
              )}
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold tracking-tight">{plan.name}</h2>
                  {plan.featured ? (
                    <span className="rounded-full bg-primary px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-white">
                      Populaire
                    </span>
                  ) : null}
                </div>
                
                <div className="mb-6">
                  <p className="text-5xl font-black tracking-tighter text-foreground">{plan.price}</p>
                  <p className="mt-4 text-sm font-bold text-subtext uppercase tracking-widest">{plan.audience}</p>
                </div>

                <div className="space-y-4 mb-10 pt-10 border-t border-border">
                  {plan.items.map((item) => (
                    <div key={item} className="flex items-start gap-4 text-sm leading-relaxed text-subtext">
                      <div className="mt-1 rounded-full bg-primary/10 p-1 text-primary">
                        <CheckCircle2 className="h-3 w-3" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/auth/register?role=OPERATOR&plan=${plan.name.toUpperCase()}`}
                  className={`flex w-full items-center justify-center gap-3 rounded-2xl py-5 text-sm font-bold transition-all shadow-lg ${
                    plan.featured 
                      ? 'gradient-bg text-white shadow-primary/20 hover:scale-105' 
                      : 'glass text-primary border-primary/20 hover:bg-primary/5'
                  }`}
                >
                  Sélectionner ce pack
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 mt-10">
        <div className="relative overflow-hidden rounded-[48px] bg-foreground px-10 py-16 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(26,107,74,0.2),_transparent)]" />
          <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-secondary">
                <Sparkles className="h-4 w-4" />
                Valeur Ajoutée
              </div>
              <h2 className="text-4xl font-bold tracking-tight lg:text-5xl leading-tight">Bien plus qu'une simple présence en ligne.</h2>
              <p className="text-lg text-white/70 leading-relaxed">
                Chaque abonnement inclut l'accès à notre IA "Kongo", un tableau de bord analytique complet et une intégration directe avec les solutions de paiement locales.
              </p>
            </div>
            <div className="grid gap-6">
              <div className="glass border-white/10 p-8 rounded-3xl">
                <p className="text-white/60 text-sm font-medium mb-2">Support Prioritaire</p>
                <p className="font-bold text-xl">Accompagnement 24/7 par nos experts locaux.</p>
              </div>
              <div className="glass border-white/10 p-8 rounded-3xl">
                <p className="text-white/60 text-sm font-medium mb-2">Visibilité Max</p>
                <p className="font-bold text-xl">Mise en avant algorithmique sur toute la plateforme.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

  );
}
