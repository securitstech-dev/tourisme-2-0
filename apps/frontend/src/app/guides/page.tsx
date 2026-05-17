'use client';

import { Map, BookOpen, Compass, Coffee, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function GuidesPage() {
  const guides = [
    { title: "Safari au Parc National d'Odzala", category: "Nature", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800" },
    { title: "Escapade Gourmande à Brazzaville", category: "Gastronomie", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800" },
    { title: "Les Plus Belles Plages de Pointe-Noire", category: "Détente", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800" },
    { title: "Culture et Traditions du Pool", category: "Culture", image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=800" }
  ];

  return (
    <div className="bg-background min-h-screen py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Guides de <span className="text-primary">Voyage</span></h1>
          <p className="text-subtext max-w-2xl mx-auto text-lg">
            Découvrez nos conseils d'experts pour préparer votre séjour et ne rien manquer des merveilles de la République du Congo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {guides.map((guide, i) => (
            <div key={i} className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <div className="relative h-64 overflow-hidden">
                <img src={guide.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={guide.title} />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                  {guide.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 leading-tight group-hover:text-primary transition-colors">{guide.title}</h3>
                <button className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-secondary hover:gap-4 transition-all">
                  Lire le guide <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-accent/20 p-12 md:p-20 rounded-[60px] flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">Vous êtes un guide local certifié ?</h2>
            <p className="text-subtext text-lg italic">
              "Partagez votre savoir et accompagnez nos visiteurs dans des aventures inoubliables."
            </p>
            <Link href="/contact" className="inline-block bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              Rejoignez notre réseau
            </Link>
          </div>
          <div className="w-full md:w-1/3 aspect-square bg-white rounded-[40px] shadow-2xl flex items-center justify-center">
            <Compass className="w-32 h-32 text-primary animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
