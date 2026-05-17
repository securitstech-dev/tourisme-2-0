'use client';

import { Shield, Lock, FileText, Scale } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: "Conditions Générales d'Utilisation (CGU)",
      content: "L'accès à la plateforme Congo Tourisme est ouvert à tout utilisateur. Les opérateurs doivent fournir des informations exactes lors de leur inscription. Securits Tech se réserve le droit de suspendre tout compte ne respectant pas la législation congolaise en vigueur."
    },
    {
      icon: Scale,
      title: "Conditions Générales de Vente (CGV)",
      content: "Les abonnements sont facturés mensuellement. Les tarifs sont de 15 000 FCFA (Starter), 45 000 FCFA (Pro) et 120 000 FCFA (Premium). Tout mois commencé est dû. Le non-paiement entraîne la suspension automatique de la visibilité de l'établissement."
    },
    {
      icon: Shield,
      title: "Protection des Données",
      content: "Vos données personnelles sont traitées avec la plus grande confidentialité. Nous ne partageons pas vos informations avec des tiers à des fins commerciales sans votre accord explicite."
    },
    {
      icon: Lock,
      title: "Sécurité des Paiements",
      content: "Tous les paiements effectués par Mobile Money ou Carte Bancaire sont sécurisés par nos partenaires bancaires agréés par la Banque Centrale. Congo Tourisme ne stocke aucune coordonnée bancaire sur ses serveurs."
    }
  ];

  return (
    <div className="pt-32 pb-20 bg-accent/10 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl font-black tracking-tight text-foreground mb-6">Mentions <span className="text-primary">Légales</span></h1>
          <p className="text-subtext text-lg">Dernière mise à jour : 03 Mai 2026</p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-6 mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <section.icon className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-foreground">{section.title}</h2>
              </div>
              <p className="text-subtext text-lg leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 p-10 bg-foreground rounded-[40px] text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Besoin d'aide ?</h3>
          <p className="text-white/60 mb-8 max-w-lg mx-auto">
            Si vous avez des questions concernant nos conditions générales, n'hésitez pas à nous contacter à Brazzaville ou Pointe-Noire.
          </p>
          <button className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all">
            Nous Contacter
          </button>
        </motion.div>
      </div>
    </div>
  );
}
