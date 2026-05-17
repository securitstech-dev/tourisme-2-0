'use client';

import { Store, CreditCard, Bell, Save, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function OperatorSettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres de l'établissement</h1>
        <p className="text-subtext">Gérez les informations de votre entreprise et vos préférences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Business Profile */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              Profil Professionnel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-subtext uppercase">Nom de l'établissement</label>
                <input type="text" defaultValue={user?.operator?.businessName} className="w-full px-6 py-4 bg-accent/10 border-none rounded-2xl" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-subtext uppercase">Type d'activité</label>
                <select className="w-full px-6 py-4 bg-accent/10 border-none rounded-2xl">
                  <option>HOTEL</option>
                  <option>RESTAURANT</option>
                  <option>NIGHTCLUB</option>
                  <option>SITE</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-subtext uppercase">Adresse Physique</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext" />
                  <input type="text" placeholder="Ex: Avenue de l'indépendance, Pointe-Noire" className="w-full pl-12 pr-6 py-4 bg-accent/10 border-none rounded-2xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Management */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm border-l-4 border-l-secondary">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-secondary" />
                  Gérer mon Abonnement
                </h3>
                <p className="text-xs text-subtext mt-1">Gérez votre pack et visualisez vos factures.</p>
              </div>
              <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-lg text-xs font-black uppercase tracking-wider">Plan Business</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-accent/30 rounded-2xl border border-primary/10">
              <div>
                <p className="text-[10px] font-bold text-subtext uppercase tracking-widest">Date de renouvellement</p>
                <p className="text-lg font-black text-foreground">12 Juin 2026</p>
                <p className="text-xs text-subtext mt-1 italic">Renouvellement automatique par Mobile Money</p>
              </div>
              <div className="flex flex-col gap-2">
                <button className="bg-primary text-white text-xs font-bold py-3 rounded-xl hover:opacity-90 transition-all">Changer de Pack</button>
                <button className="text-primary text-[10px] font-bold hover:underline">Accéder à l'historique des factures (PDF)</button>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Réception des Paiements Clients
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-green-800">Compte MTN MoMo</p>
                  <p className="text-xs text-green-600">+242 06 123 45 67 (Actif)</p>
                </div>
                <button className="text-green-800 font-bold text-xs">Modifier</button>
              </div>
              <div className="p-4 bg-accent/10 border border-gray-100 rounded-2xl flex items-center justify-between opacity-60">
                <div>
                  <p className="text-sm font-bold">Compte Airtel Money</p>
                  <p className="text-xs text-subtext">Non configuré</p>
                </div>
                <button className="text-primary font-bold text-xs">Configurer</button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              Notifications
            </h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-subtext">Nouvelle réservation</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-subtext">Avis client</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-subtext">Newsletter Opérateurs</span>
              </label>
            </div>
          </div>

          <button className="w-full bg-primary text-white p-6 rounded-[32px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
            <Save className="w-6 h-6" />
            Enregistrer les réglages
          </button>
        </div>
      </div>
    </div>
  );
}
