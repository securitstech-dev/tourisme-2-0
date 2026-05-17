'use client';

import { Map, Users, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover brightness-[0.4]"
            alt="Nature du Congo"
          />
        </div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">Notre <span className="text-primary">Mission</span></h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto font-medium text-white/90">
            Révéler la splendeur de la République du Congo au monde entier et dynamiser l'économie touristique locale.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="text-primary font-bold tracking-widest uppercase text-sm">Qui sommes-nous ?</span>
            <h2 className="text-4xl font-bold text-foreground leading-tight">
              L'ambition de Securits Tech pour le tourisme congolais
            </h2>
            <p className="text-lg text-subtext leading-relaxed">
              Congo Tourisme est né d'une volonté simple : centraliser et professionnaliser l'offre touristique de notre beau pays. Nous croyons que chaque coin de la République du Congo recèle des trésors qui ne demandent qu'à être découverts.
            </p>
            <p className="text-lg text-subtext leading-relaxed">
              En tant que filiale de Securits Tech, nous utilisons la puissance du numérique pour connecter les opérateurs touristiques locaux avec une clientèle nationale et internationale, tout en garantissant sécurité, transparence et qualité.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-4xl font-black text-primary mb-2">100+</p>
                <p className="text-sm font-bold text-subtext uppercase">Partenaires</p>
              </div>
              <div>
                <p className="text-4xl font-black text-secondary mb-2">12</p>
                <p className="text-sm font-bold text-subtext uppercase">Régions couvertes</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[60px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-full object-cover"
                alt="Equipe Congo Tourisme"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 max-w-xs hidden md:block">
              <p className="text-foreground font-bold italic">
                "Le tourisme est le pétrole vert du Congo. Notre plateforme en est le moteur numérique."
              </p>
              <p className="mt-4 text-primary font-bold">— Direction Securits Tech</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-accent/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Nos Valeurs Fondamentales</h2>
            <p className="text-subtext max-w-2xl mx-auto">Ce qui nous guide chaque jour dans le développement de cette plateforme.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Map, title: "Authenticité", desc: "Mettre en avant le vrai Congo, ses traditions et ses paysages." },
              { icon: ShieldCheck, title: "Confiance", desc: "Garantir des réservations sécurisées et des partenaires vérifiés." },
              { icon: Users, title: "Impact Local", desc: "Soutenir l'économie des communautés et des artisans congolais." },
              { icon: Heart, title: "Passion", desc: "Transmettre l'amour de notre patrie à travers chaque interaction." }
            ].map((value, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-accent/30 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-subtext text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 container mx-auto px-6 text-center">
        <div className="bg-[#1A1A1A] p-12 md:p-20 rounded-[60px] text-white overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Prêt à découvrir le Congo ?</h2>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link href="/explore" className="bg-primary px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all">
                Explorer les offres <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="bg-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all">
                Nous contacter
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 blur-[120px] rounded-full"></div>
        </div>
      </section>
    </div>
  );
}
