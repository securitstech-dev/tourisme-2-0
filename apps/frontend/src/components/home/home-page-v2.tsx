'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Hotel,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Utensils,
  Camera,
  Map,
  Tent
} from 'lucide-react';

const slides = [
  {
    title: "L'Aventure à l'État Pur",
    subtitle: "Randonnées inoubliables, rencontres authentiques et paysages à couper le souffle au cœur de la nature congolaise.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2940&auto=format&fit=crop",
    href: "/explore?type=SITE",
    tag: "Exploration",
  },
  {
    title: "Safaris & Réserves Naturelles",
    subtitle: "Embarquez dans nos camions de safari pour observer une faune exceptionnelle dans son habitat naturel.",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2938&auto=format&fit=crop",
    href: "/explore?type=SITE",
    tag: "Safari",
  },
  {
    title: "Séjours de Luxe & Confort",
    subtitle: "Des chambres d'hôtel somptueuses et des lodges étoilés pour des nuits paisibles après vos journées de découverte.",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2940&auto=format&fit=crop",
    href: "/explore?type=HOTEL",
    tag: "Hôtel Premium",
  },
  {
    title: "Nuits Vibrantes & VIP",
    subtitle: "Découvrez la vie nocturne congolaise : bars concepts, clubs privés et ambiances festives inoubliables.",
    image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2940&auto=format&fit=crop",
    href: "/explore?type=LEISURE_ACTIVITY",
    tag: "Vie Nocturne",
  }
];

const categories = [
  { title: "Sites naturels", icon: Tent, href: "/explore?type=SITE", text: "Parcs, cascades, circuits", img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2940&auto=format&fit=crop" },
  { title: "Hôtels de prestige", icon: Hotel, href: "/explore?type=HOTEL", text: "Chambres, suites et lodges", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940&auto=format&fit=crop" },
  { title: "Gastronomie locale", icon: Utensils, href: "/explore?type=RESTAURANT", text: "Tables étoilées et terrasses", img: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2940&auto=format&fit=crop" },
  { title: "Sorties & Bars", icon: Gamepad2, href: "/explore?type=LEISURE_ACTIVITY", text: "Nightclubs, VIP et loisirs", img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2874&auto=format&fit=crop" },
];

const featured = [
  {
    title: "Lodge Safari au cœur de la Cuvette",
    location: "Cuvette-Ouest",
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2940&auto=format&fit=crop",
    type: "Lodge & Safari",
  },
  {
    title: "Suite Océanique à Pointe-Noire",
    location: "Pointe-Noire",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2874&auto=format&fit=crop",
    type: "Hôtel Premium",
  },
  {
    title: "Club Lounge Panafricain VIP",
    location: "Brazzaville",
    image: "https://images.unsplash.com/photo-1574096079513-d8259312b78a?q=80&w=2940&auto=format&fit=crop",
    type: "Nightclub",
  }
];

export default function HomePageV2() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  const goToSlide = (direction: 1 | -1) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] overflow-hidden selection:bg-[#1A6B4A] selection:text-white">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full bg-black overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image src={slides[activeSlide].image} alt={slides[activeSlide].title} fill priority className="object-cover" />
          </motion.div>
        </AnimatePresence>

        {/* Glass Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/30 to-transparent" />
        
        <div className="relative z-10 flex h-full flex-col justify-end pb-24 md:pb-32 px-6 md:px-12 max-w-screen-2xl mx-auto">
          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur-md shadow-2xl">
                  <Sparkles className="h-4 w-4 text-[#C8860A]" />
                  {slides[activeSlide].tag}
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                  {slides[activeSlide].title}
                </h1>
                <p className="mt-6 text-lg md:text-2xl text-white/90 max-w-2xl leading-relaxed font-medium drop-shadow-lg">
                  {slides[activeSlide].subtitle}
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Link href={slides[activeSlide].href} className="group flex items-center justify-center gap-3 rounded-[16px] bg-gradient-to-r from-[#1A6B4A] to-[#2D8C64] px-8 py-5 text-sm font-bold text-white shadow-xl shadow-[#1A6B4A]/20 transition-all hover:scale-105 active:scale-95">
                    Explorer maintenant
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href="/auth/register" className="group flex items-center justify-center gap-3 rounded-[16px] border border-white/20 bg-white/10 px-8 py-5 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 active:scale-95">
                    Créer un compte
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-12 right-6 md:right-12 flex gap-3">
            <button onClick={() => goToSlide(-1)} className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-xl transition hover:bg-white/20 hover:scale-110 active:scale-95">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={() => goToSlide(1)} className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-xl transition hover:bg-white/20 hover:scale-110 active:scale-95">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORIES / VITRINE */}
      <section className="py-32 px-6 md:px-12 max-w-screen-2xl mx-auto">
        <div className="mb-16 md:mb-24 text-center">
          <p className="text-[#C8860A] text-sm font-black uppercase tracking-[0.2em] mb-4">L'Essentiel du Congo</p>
          <h2 className="text-4xl md:text-6xl font-black text-[#1A1A1A] tracking-tight">Que souhaitez-vous vivre ?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <Link key={cat.title} href={cat.href} className="group relative h-[420px] overflow-hidden rounded-[32px] bg-[#1A1A1A] shadow-lg hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
              <Image src={cat.img} alt={cat.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/20 to-transparent transition-opacity duration-700" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-[16px] bg-white/20 backdrop-blur-md text-white border border-white/10 transition-transform duration-500 group-hover:-translate-y-2 group-hover:bg-[#1A6B4A]/80">
                  <cat.icon className="h-7 w-7" />
                </div>
                <h3 className="text-3xl font-black text-white mb-3 transition-transform duration-500 group-hover:-translate-y-2">{cat.title}</h3>
                <p className="text-white/80 font-medium transition-transform duration-500 group-hover:-translate-y-2 text-lg">{cat.text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED ESTABLISHMENTS */}
      <section className="py-32 px-6 md:px-12 bg-white rounded-t-[64px] shadow-[0_-20px_40px_rgba(0,0,0,0.03)] relative z-20 -mt-10">
        <div className="max-w-screen-2xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-[#1A6B4A] text-sm font-black uppercase tracking-[0.2em] mb-4">Sélection Premium</p>
              <h2 className="text-4xl md:text-6xl font-black text-[#1A1A1A] tracking-tight">Vitrines d'Exception</h2>
            </div>
            <Link href="/explore" className="inline-flex items-center gap-3 rounded-full border-2 border-[#1A6B4A] px-8 py-4 text-sm font-black text-[#1A6B4A] hover:bg-[#1A6B4A] hover:text-white uppercase tracking-wider transition-all hover:scale-105 active:scale-95">
              Explorer le catalogue
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {featured.map((item, index) => (
              <Link key={item.title} href="/explore" className="group rounded-[40px] bg-[#FAFAF8] border border-gray-100 p-5 transition-all duration-700 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-3">
                <div className="relative h-[340px] w-full overflow-hidden rounded-[32px]">
                  <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute top-5 left-5 rounded-[12px] bg-white/90 backdrop-blur-md px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A6B4A] shadow-lg">
                    {item.type}
                  </div>
                </div>
                <div className="p-8 pb-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C8860A] mb-4">
                    <MapPin className="h-4 w-4" />
                    {item.location}
                  </div>
                  <h3 className="text-2xl font-black text-[#1A1A1A] mb-8 leading-tight group-hover:text-[#1A6B4A] transition-colors">{item.title}</h3>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-1 text-[#C8860A]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1A6B4A]/10 text-[#1A6B4A] group-hover:bg-[#1A6B4A] group-hover:text-white transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US - LUXE ORGANIQUE */}
      <section className="relative py-40 overflow-hidden bg-[#1A1A1A]">
        <div className="absolute inset-0 opacity-20">
          <Image src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2938&auto=format&fit=crop" alt="Congo Forest Pattern" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] via-[#1A1A1A]/80 to-[#1A1A1A]" />
        
        <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-[#C8860A] text-sm font-black uppercase tracking-[0.2em] mb-6">L'Expérience</p>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8 leading-[1.1]">Pensé pour sublimer<br/>votre voyage.</h2>
            <p className="text-xl text-gray-400 leading-relaxed max-w-xl mb-12 font-medium">
              Une interface fluide, des établissements soigneusement vérifiés par Securits Tech, et une immersion visuelle dès le premier clic. Le tourisme de luxe à portée de main.
            </p>
            <Link href="/explore" className="inline-flex items-center justify-center gap-3 rounded-[16px] bg-white px-10 py-6 text-sm font-bold text-[#1A1A1A] transition-all hover:scale-105 active:scale-95 shadow-2xl">
              Rejoindre l'aventure
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          
          <div className="grid gap-6">
            {[
              { icon: ShieldCheck, title: "Établissements Certifiés", text: "Chaque opérateur est vérifié administrativement pour votre sécurité totale." },
              { icon: Map, title: "Exploration Intuitive", text: "Trouvez votre prochaine destination via notre carte interactive ou nos collections organisées." },
              { icon: Camera, title: "Immersion Visuelle", text: "Des galeries photos haute-définition pour faire votre choix sans mauvaise surprise." }
            ].map((item, i) => (
              <div key={i} className="group flex items-start gap-8 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:-translate-y-2">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[16px] bg-[#1A6B4A]/20 text-[#2D8C64] border border-[#1A6B4A]/30 group-hover:scale-110 group-hover:bg-[#1A6B4A] group-hover:text-white transition-all duration-500">
                  <item.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
