'use client';

import { BookOpen, Shield, Users, CreditCard, Layout, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function AdminManualPage() {
  const sections = [
    {
      title: "Gestion des Opérateurs",
      icon: Users,
      steps: [
        "Accédez à l'onglet 'Validations' pour voir les nouveaux dossiers.",
        "Examinez les informations et les documents fournis.",
        "Approuvez pour donner accès au dashboard opérateur ou rejetez avec motif.",
        "Les opérateurs approuvés doivent payer leur abonnement pour être visibles."
      ]
    },
    {
      title: "Modération des Annonces",
      icon: Layout,
      steps: [
        "Consultez 'Annonces' pour voir toutes les publications en ligne.",
        "Vous pouvez suspendre une annonce si elle ne respecte pas la charte.",
        "Vérifiez la qualité des images et des descriptions."
      ]
    },
    {
      title: "Finance & Commissions",
      icon: CreditCard,
      steps: [
        "L'onglet 'Finance' affiche le chiffre d'affaires global.",
        "Suivez les abonnements mensuels payés par les opérateurs.",
        "Gérez les remboursements en cas de litige client."
      ]
    },
    {
      title: "Sécurité & Système",
      icon: Shield,
      steps: [
        "Configurez les clés API Stripe et Cloudinary dans 'Système'.",
        "Activez le mode maintenance si nécessaire.",
        "Consultez les logs d'erreurs en cas de dysfonctionnement."
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mode d'emploi Super Admin</h1>
        <p className="text-subtext">Guide complet pour la gestion de la plateforme Congo Tourisme.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <section.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{section.title}</h3>
            </div>
            <ul className="space-y-4">
              {section.steps.map((step, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-subtext">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-[#1A1A1A] p-10 rounded-[40px] text-white flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-secondary" />
            Besoin d'assistance technique ?
          </h3>
          <p className="text-white/60">
            En cas de problème critique sur les serveurs ou la base de données, contactez l'équipe technique de Securits Tech directement via le canal d'urgence.
          </p>
        </div>
        <button className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-secondary hover:text-white transition-all shrink-0">
          Ouvrir un ticket
        </button>
      </div>
    </div>
  );
}
