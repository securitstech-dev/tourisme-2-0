'use client';

import { Settings, Shield, Bell, Database, Globe, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuration Système</h1>
        <p className="text-subtext">Gérez les paramètres globaux de la plateforme Congo Tourisme.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* General Config */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Paramètres Généraux
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-subtext uppercase">Nom de la Plateforme</label>
                  <input type="text" defaultValue="Congo Tourisme" className="w-full px-6 py-4 bg-accent/10 border-none rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-subtext uppercase">Email Support</label>
                  <input type="email" defaultValue="support@congotourisme.cg" className="w-full px-6 py-4 bg-accent/10 border-none rounded-2xl" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-subtext uppercase">Maintenance du site</label>
                <div className="flex items-center gap-4 p-4 bg-accent/10 rounded-2xl">
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-foreground">Mode Maintenance</p>
                    <p className="text-xs text-subtext">Désactiver l'accès public pour les mises à jour.</p>
                  </div>
                  <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-secondary" />
              Sécurité & API
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-accent/10 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Clé API Stripe</p>
                  <p className="text-xs text-subtext">sk_test_••••••••••••••••••••</p>
                </div>
                <button className="text-primary font-bold text-xs">Mettre à jour</button>
              </div>
              <div className="p-4 bg-accent/10 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Cloudinary Config</p>
                  <p className="text-xs text-subtext">Cloud: congo-tourisme-cdn</p>
                </div>
                <button className="text-primary font-bold text-xs">Vérifier</button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1A1A1A] p-8 rounded-[32px] text-white shadow-xl shadow-gray-200">
            <Database className="w-12 h-12 text-primary mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">Base de données</h3>
            <p className="text-white/60 text-sm mb-6">Dernière sauvegarde effectuée il y a 4 heures.</p>
            <button className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold transition-all text-sm">
              Sauvegarder maintenant
            </button>
          </div>

          <button className="w-full bg-primary text-white p-6 rounded-[32px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
            <Save className="w-6 h-6" />
            Enregistrer tout
          </button>
        </div>
      </div>
    </div>
  );
}
