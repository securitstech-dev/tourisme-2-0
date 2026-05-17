'use client';

import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-4xl bg-white p-12 md:p-20 rounded-[40px] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8 text-primary">
          <Shield className="w-10 h-10" />
          <h1 className="text-4xl font-black text-foreground">Politique de Confidentialité</h1>
        </div>
        
        <p className="text-subtext mb-12 text-lg">
          Dernière mise à jour : 1er Mai 2026. Chez Congo Tourisme, la protection de vos données personnelles est une priorité absolue.
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-secondary" />
              1. Collecte des données
            </h2>
            <p className="text-subtext leading-relaxed">
              Nous collectons les informations que vous nous fournissez directement lors de la création de votre compte : nom, prénom, adresse e-mail, numéro de téléphone et, pour les opérateurs, les informations légales relatives à votre entreprise.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-secondary" />
              2. Utilisation des données
            </h2>
            <p className="text-subtext leading-relaxed">
              Vos données sont utilisées exclusivement pour :
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-subtext">
              <li>Gérer vos réservations et vos paiements.</li>
              <li>Vous envoyer des notifications relatives à votre compte.</li>
              <li>Améliorer l'expérience utilisateur sur la plateforme.</li>
              <li>Assurer la sécurité des transactions via nos partenaires (Stripe, MTN, Airtel).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-secondary" />
              3. Sécurité et Partage
            </h2>
            <p className="text-subtext leading-relaxed">
              Nous ne vendons jamais vos données à des tiers. Vos informations ne sont partagées qu'avec les opérateurs touristiques auprès desquels vous effectuez une réservation, et nos partenaires de paiement sécurisé. Toutes les données sensibles sont cryptées.
            </p>
          </section>

          <section className="bg-accent/20 p-8 rounded-3xl border border-primary/10">
            <h3 className="font-bold mb-2">Vos droits</h3>
            <p className="text-sm text-subtext">
              Conformément à la législation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour toute demande, contactez notre Délégué à la Protection des Données à privacy@congotourisme.cg.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
