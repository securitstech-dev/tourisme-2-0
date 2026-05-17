'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import {
  ArrowRight, MapPin, Hotel, Utensils, Tent, Star,
  Gamepad2, Calendar, ChevronDown, Play, Users,
  ShieldCheck, Zap, Globe, TreePine, Waves, Music
} from 'lucide-react';

/* ─── données statiques ─────────────────────────────────── */
const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2938&auto=format&fit=crop',
    label: 'Parc National d\'Odzala',
    region: 'Cuvette-Ouest',
    tag: 'Faune sauvage',
  },
  {
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2940&auto=format&fit=crop',
    label: 'Suites de Prestige',
    region: 'Pointe-Noire',
    tag: 'Hôtel Premium',
  },
  {
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2940&auto=format&fit=crop',
    label: 'Gastronomie Congolaise',
    region: 'Brazzaville',
    tag: 'Restaurants',
  },
  {
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2940&auto=format&fit=crop',
    label: 'Nuits Vibrantes VIP',
    region: 'Pointe-Noire',
    tag: 'Vie Nocturne',
  },
];

const stats = [
  { value: '12', unit: 'Régions', desc: 'couverture nationale' },
  { value: '3', unit: 'Profils', desc: 'Admin · Opérateur · Touriste' },
  { value: '24/7', unit: 'Kongo AI', desc: 'assistant disponible' },
  { value: '100%', unit: 'Sécurisé', desc: 'Stripe · MTN · Airtel' },
];

const categories = [
  { title: 'Hôtels & Lodges', icon: Hotel, href: '/explore?type=HOTEL', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop', count: 'Hébergement' },
  { title: 'Restaurants', icon: Utensils, href: '/explore?type=RESTAURANT', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop', count: 'Gastronomie' },
  { title: 'Sites Naturels', icon: Tent, href: '/explore?type=SITE', img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop', count: 'Écotourisme' },
  { title: 'Vie Nocturne', icon: Music, href: '/explore?type=LEISURE_ACTIVITY', img: 'https://images.unsplash.com/photo-1574096079513-d8259312b78a?q=80&w=1200&auto=format&fit=crop', count: 'Divertissement' },
  { title: 'Casinos & Jeux', icon: Gamepad2, href: '/explore?type=CASINO', img: 'https://images.unsplash.com/photo-1462452062726-d8ac859cdaad?q=80&w=1200&auto=format&fit=crop', count: 'Gaming' },
  { title: 'Événements', icon: Calendar, href: '/explore?type=EVENT_HALL', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop', count: 'Salles & Fêtes' },
];

const destinations = [
  { city: 'Pointe-Noire', desc: 'Capitale économique · Plages · Vie nocturne', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop', listings: '80+' },
  { city: 'Brazzaville', desc: 'Capitale politique · Culture · Gastronomie', img: 'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1200&auto=format&fit=crop', listings: '120+' },
  { city: 'Odzala', desc: 'Forêt équatoriale · Gorilles · Safari', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200&auto=format&fit=crop', listings: '15+' },
  { city: 'Loango', desc: 'Parc national · Baleines · Nature vierge', img: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?q=80&w=1200&auto=format&fit=crop', listings: '12+' },
];

const features = [
  { icon: ShieldCheck, title: 'Opérateurs vérifiés', desc: 'Chaque établissement est validé par notre équipe Securits Tech avant publication.' },
  { icon: Zap, title: 'Réservation instantanée', desc: 'Confirmez votre séjour en moins de 2 minutes, paiement sécurisé inclus.' },
  { icon: Globe, title: 'Paiement local & international', desc: 'Stripe, MTN Mobile Money et Airtel Money acceptés pour tous les voyageurs.' },
  { icon: TreePine, title: 'Kongo, votre guide IA', desc: 'Notre assistant intelligent vous conseille sur mesure, 24h/24 et en français.' },
];

/* ─── composant principal ───────────────────────────────── */
export default function HomePageV3() {
  const [slide, setSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  /* Auto-slide toutes les 6s */
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  /* Parallax léger sur le hero */
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const current = heroSlides[slide];

  return (
    <main className="bg-[#FAFAF8] text-[#1A1A1A] overflow-x-hidden">

      {/* ══════════════════ HERO FULLSCREEN ══════════════════ */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] w-full overflow-hidden">
        {/* Image de fond avec parallax */}
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === slide ? 1 : 0 }}
          >
            <Image
              src={s.image}
              alt={s.label}
              fill
              priority={i === 0}
              className="object-cover"
              style={{ transform: `translateY(${scrollY * 0.3}px)` }}
            />
          </div>
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        {/* Contenu hero */}
        <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 md:px-16 md:pb-32 max-w-7xl mx-auto">
          {/* Badge région */}
          <div className="mb-6 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5 text-[#C8860A]" />
              {current.region}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#C8860A] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
              {current.tag}
            </span>
          </div>

          {/* Titre */}
          <h1 className="text-5xl font-black text-white leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl">
            {current.label}
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-xl font-medium">
            Découvrez la République du Congo — ses forêts, ses plages, sa culture vivante et son hospitalité unique.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/explore"
              className="group inline-flex items-center gap-3 rounded-2xl bg-[#1A6B4A] px-8 py-4 text-sm font-bold text-white shadow-2xl shadow-[#1A6B4A]/40 transition-all hover:bg-[#15573D] hover:scale-105 active:scale-95"
            >
              Explorer les offres
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-3 rounded-2xl border border-white/25 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              Créer un compte
            </Link>
          </div>

          {/* Indicateurs de slide */}
          <div className="mt-10 flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-1 rounded-full transition-all duration-500 ${i === slide ? 'w-10 bg-[#C8860A]' : 'w-4 bg-white/40'}`}
              />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 z-10 hidden md:flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs font-bold uppercase tracking-widest rotate-90 mb-2">Scroll</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </section>

      {/* ══════════════════ STATS BAR ══════════════════ */}
      <section className="bg-[#1A1A1A] py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black text-[#C8860A]">{s.value}</p>
              <p className="text-sm font-bold text-white mt-1">{s.unit}</p>
              <p className="text-xs text-white/50 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ CATÉGORIES ══════════════════ */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="mb-14 text-center">
          <p className="text-[#1A6B4A] text-xs font-black uppercase tracking-[0.25em] mb-3">Ce que vous cherchez</p>
          <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tight sm:text-5xl">
            Tous les types d'expériences
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative overflow-hidden rounded-3xl aspect-[4/3] bg-[#1A1A1A] shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              <Image
                src={cat.img}
                alt={cat.title}
                fill
                className="object-cover opacity-70 transition-all duration-700 group-hover:opacity-90 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                    <cat.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-white/70 font-bold uppercase tracking-widest">{cat.count}</span>
                </div>
                <h3 className="text-lg font-black text-white">{cat.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════ DESTINATIONS ══════════════════ */}
      <section className="bg-[#F0F7F4] py-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[#C8860A] text-xs font-black uppercase tracking-[0.25em] mb-3">Destinations phares</p>
              <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tight sm:text-5xl">
                Le Congo à découvrir
              </h2>
            </div>
            <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-bold text-[#1A6B4A] border-2 border-[#1A6B4A] rounded-full px-6 py-3 hover:bg-[#1A6B4A] hover:text-white transition-all">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {destinations.map((d) => (
              <Link key={d.city} href={`/explore?region=${d.city}`} className="group relative overflow-hidden rounded-3xl bg-white shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative h-52 overflow-hidden">
                  <Image src={d.img} alt={d.city} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-xs font-bold text-[#1A6B4A]">
                      <Star className="h-3 w-3 fill-[#C8860A] text-[#C8860A]" />
                      {d.listings} offres
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-black text-[#1A1A1A]">{d.city}</h3>
                  <p className="mt-1 text-sm text-[#5F5E5A]">{d.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ POURQUOI NOUS ══════════════════ */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="mb-14 text-center">
          <p className="text-[#1A6B4A] text-xs font-black uppercase tracking-[0.25em] mb-3">Pourquoi nous choisir</p>
          <h2 className="text-4xl font-black text-[#1A1A1A] tracking-tight sm:text-5xl">
            La plateforme de confiance
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-400">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F5EF] flex items-center justify-center mb-6 group-hover:bg-[#1A6B4A] transition-colors">
                <f.icon className="h-7 w-7 text-[#1A6B4A] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-black text-[#1A1A1A] mb-3">{f.title}</h3>
              <p className="text-sm text-[#5F5E5A] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════ CTA OPÉRATEUR ══════════════════ */}
      <section className="relative overflow-hidden bg-[#1A6B4A] py-24 px-6 md:px-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#C8860A] rounded-full translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
          <div className="flex-1">
            <span className="inline-block bg-[#C8860A] text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              Pour les professionnels
            </span>
            <h2 className="text-4xl font-black text-white sm:text-5xl leading-tight">
              Rejoignez la<br />marketplace congolaise
            </h2>
            <p className="mt-5 text-lg text-white/80 max-w-xl">
              Publiez vos offres, gérez vos réservations et développez votre activité touristique sur la seule plateforme dédiée au Congo.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-3 text-white/70 text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C8860A]" />
                Dès 15 000 FCFA/mois
              </div>
              <div className="flex items-center gap-3 text-white/70 text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C8860A]" />
                Tableau de bord complet
              </div>
              <div className="flex items-center gap-3 text-white/70 text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C8860A]" />
                Support dédié
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 shrink-0">
            <Link
              href="/auth/register?role=OPERATOR"
              className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-5 text-base font-black text-[#1A6B4A] shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              Devenir opérateur
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/tarifs"
              className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-white/30 px-8 py-4 text-sm font-bold text-white hover:bg-white/10 transition-all"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════ FOOTER MINIMAL ══════════════════ */}
      <footer className="bg-[#111] py-12 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white font-black text-lg">Congo Tourisme</p>
            <p className="text-white/40 text-sm mt-1">Par Securits Tech · Pointe-Noire, République du Congo</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-white/50">
            <Link href="/explore" className="hover:text-white transition-colors">Explorer</Link>
            <Link href="/tarifs" className="hover:text-white transition-colors">Tarifs</Link>
            <Link href="/auth/login" className="hover:text-white transition-colors">Connexion</Link>
            <Link href="/auth/register" className="hover:text-white transition-colors">S'inscrire</Link>
          </div>
          <p className="text-white/30 text-xs">© 2026 Securits Tech</p>
        </div>
      </footer>
    </main>
  );
}
