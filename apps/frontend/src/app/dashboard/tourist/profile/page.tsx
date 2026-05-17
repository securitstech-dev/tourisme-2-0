'use client';

import { User, Mail, Phone, Shield, Camera, Save } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';

export default function TouristProfilePage() {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mon Profil</h1>
        <p className="text-subtext">Gérez vos informations personnelles et votre sécurité.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Avatar Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full bg-accent/30 rounded-full flex items-center justify-center text-primary text-4xl font-black">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg border-4 border-white hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h3>
            <p className="text-subtext text-sm mb-6">{user?.email}</p>
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              Touriste Usager
            </span>
          </div>
        </div>

        {/* Info Form */}
        <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Informations Personnelles</h3>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-primary font-bold text-sm hover:underline"
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-subtext uppercase">Prénom</label>
              <input 
                type="text" 
                defaultValue={user?.firstName}
                disabled={!isEditing}
                className="w-full px-6 py-4 bg-accent/10 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-subtext uppercase">Nom</label>
              <input 
                type="text" 
                defaultValue={user?.lastName}
                disabled={!isEditing}
                className="w-full px-6 py-4 bg-accent/10 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-subtext uppercase">Email</label>
              <input 
                type="email" 
                defaultValue={user?.email}
                disabled={!isEditing}
                className="w-full px-6 py-4 bg-accent/10 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-subtext uppercase">Téléphone</label>
              <input 
                type="tel" 
                placeholder="+242 -- --- ----"
                disabled={!isEditing}
                className="w-full px-6 py-4 bg-accent/10 border-none rounded-2xl focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
              />
            </div>
          </div>

          {isEditing && (
            <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-all">
              <Save className="w-5 h-5" />
              Enregistrer les modifications
            </button>
          )}

          <div className="mt-12 pt-12 border-t border-gray-50">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-secondary" />
              Sécurité & Compte
            </h3>
            <div className="space-y-4">
              <button className="w-full text-left p-4 bg-accent/10 rounded-2xl hover:bg-accent/20 transition-all text-sm font-bold text-foreground">
                Changer le mot de passe
              </button>
              <button className="w-full text-left p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-all text-sm font-bold text-red-600">
                Supprimer mon compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
