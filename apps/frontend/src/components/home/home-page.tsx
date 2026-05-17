/** Composition de la page d'accueil publique Congo Tourisme. */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';

import {
  destinationPillars,
  heroHighlights,
  homeListings,
  journeySteps,
  operatorBenefits,
  operatorPlans,
  platformFeatures,
  trustMetrics,
} from '@/lib/site-content';
import { getListingLocation, getListingPrice } from '@/lib/listing-utils';
import { getListingLabel } from '@/lib/listing-labels';

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55 },
};

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(200,134,10,0.14),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(26,107,74,0.18),_transparent_44%),linear-gradient(180deg,_rgba(250,250,248,0.7),_rgba(250,250,248,0.98))]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <motion.div {...reveal} className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary shadow-sm backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Securits Tech · Plateforme tourisme Congo
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
                Le frontend de <span className="text-primary">Congo Tourisme</span> prend forme pour vendre le pays avec confiance.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-subtext sm:text-xl">
                Une vitrine claire pour les touristes, un vrai point d entree pour les operateurs, et une base solide pour brancher les reservations, le chatbot Kongo et les paiements.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {heroHighlights.map((item) => (
                <div key={item} className="rounded-2xl border border-black/6 bg-white/75 px-4 py-4 text-sm font-medium text-subtext shadow-sm backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/explore"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/95"
              >
                Explorer le catalogue
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/register?role=OPERATOR&plan=PROFESSIONAL"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/15 bg-white px-7 py-4 text-sm font-bold text-primary transition hover:-translate-y-0.5 hover:bg-accent"
              >
                Ouvrir mon espace operateur
              </Link>
            </div>
          </motion.div>

          <motion.div {...reveal} className="grid gap-5 lg:pl-8">
            <div className="relative overflow-hidden rounded-[28px] border border-black/6 bg-white p-3 shadow-xl shadow-black/5">
              <div className="absolute left-6 top-6 z-10 rounded-full bg-white/90 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary backdrop-blur">
                Pointe-Noire · Sejour balneaire
              </div>
              <div className="relative aspect-[4/4.3] overflow-hidden rounded-[22px]">
                <Image
                  src="/hero-pointe-noire-placeholder.png"
                  alt="Littoral de Pointe-Noire"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[28px] border border-black/6 bg-white p-6 shadow-lg shadow-black/5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-subtext">Parcours visiteur</p>
                <div className="mt-4 space-y-4">
                  {journeySteps.map((step) => (
                    <div key={step.title} className="flex items-start gap-4">
                      <div className="mt-1 rounded-2xl bg-accent p-3 text-primary">
                        <step.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold">{step.title}</p>
                        <p className="mt-1 text-sm leading-6 text-subtext">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[28px] bg-[#1A1A1A] p-6 text-white shadow-lg shadow-black/10">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/65">Vision produit</p>
                <div className="mt-5 grid gap-5">
                  {trustMetrics.map((metric) => (
                    <div key={metric.label} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="mt-1 text-sm leading-6 text-white/70">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-18 lg:py-24">
        <motion.div {...reveal} className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Ce que la plateforme met en avant</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Une lecture simple du Congo touristique, meme quand le backend n est pas encore complet.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-subtext">
            On garde un mode demonstration propre pour que le produit reste montrable, testable et presentable sur Vercel pendant la construction.
          </p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {destinationPillars.map((pillar) => (
            <motion.article key={pillar.title} {...reveal} className="rounded-[28px] border border-black/6 bg-white p-7 shadow-sm shadow-black/5">
              <div className="mb-5 inline-flex rounded-2xl bg-accent p-3 text-primary">
                <pillar.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-subtext">{pillar.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-y border-black/5 bg-white/65">
        <div className="mx-auto max-w-7xl px-6 py-18 lg:py-24">
          <motion.div {...reveal} className="mb-10 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Fonctionnalites clefs</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Le socle produit qu on va continuer a brancher a ton backend Nest.</h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {platformFeatures.map((feature) => (
              <motion.div key={feature.title} {...reveal} className="rounded-[28px] border border-black/6 bg-background p-6 shadow-sm shadow-black/5">
                <div className="mb-5 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-subtext">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-18 lg:py-24">
        <motion.div {...reveal} className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Offres de demonstration</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Des cartes plus credibles et tout de suite exploitables.</h2>
          </div>
          <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:gap-3">
            Voir toute l exploration
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {homeListings.map((listing) => (
            <motion.article key={listing.id} {...reveal} className="overflow-hidden rounded-[28px] border border-black/6 bg-white shadow-sm shadow-black/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/8">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={listing.images?.[0]?.url || '/welcome.png'}
                  alt={listing.images?.[0]?.altText || listing.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 50vw, 25vw"
                />
                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary backdrop-blur">
                  {getListingLabel(listing)}
                </div>
              </div>
              <div className="space-y-5 p-6">
                <div className="flex items-center gap-2 text-sm text-subtext">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{getListingLocation(listing)}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold leading-snug">{listing.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-7 text-subtext">{listing.description}</p>
                </div>
                <div className="flex items-center justify-between border-t border-black/6 pt-4">
                  <div>
                    <p className="text-xl font-bold text-primary">{getListingPrice(listing).toLocaleString()} FCFA</p>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-subtext">Offre visible en mode demo</p>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-2 text-sm font-bold text-secondary">
                    <Star className="h-4 w-4 fill-current" />
                    {(listing.rating ?? 4.8).toFixed(1)}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="bg-[#1F2A25] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-18 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:py-24">
          <motion.div {...reveal} className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Espace operateur</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Une base B2B plus nette pour vendre les abonnements plus tard.</h2>
            <p className="max-w-xl text-sm leading-7 text-white/75">
              Le frontend doit aussi rassurer les professionnels du tourisme. On pose donc un discours produit simple, une valeur claire et des offres lisibles.
            </p>
            <div className="grid gap-4">
              {operatorBenefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-4 rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="rounded-2xl bg-white/10 p-3 text-secondary">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/70">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="grid gap-5 md:grid-cols-3">
            {operatorPlans.map((plan) => (
              <motion.article
                key={plan.name}
                {...reveal}
                className={`rounded-[28px] border p-6 shadow-lg ${
                  plan.featured
                    ? 'border-secondary bg-secondary text-white shadow-secondary/15'
                    : 'border-white/10 bg-white/5 text-white'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    {plan.featured ? (
                      <span className="rounded-full bg-white/18 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">
                        Recommande
                      </span>
                    ) : null}
                  </div>
                  <p className={`text-3xl font-bold ${plan.featured ? 'text-white' : 'text-secondary'}`}>{plan.price}</p>
                  <p className={`text-sm leading-7 ${plan.featured ? 'text-white/85' : 'text-white/70'}`}>{plan.audience}</p>
                </div>
                <div className="mt-6 space-y-3">
                  {plan.items.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
