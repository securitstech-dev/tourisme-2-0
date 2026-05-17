'use client';

import { useState } from 'react';
import { FileText, Printer, Building2, User, MapPin, CreditCard, CheckCircle2, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function ManualRegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: 'HOTEL',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessPhone: '',
    region: 'Brazzaville',
    city: 'Brazzaville',
    address: '',
    rccmNumber: '',
    taxId: '',
    subscriptionPlan: 'STARTER'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.patch('/admin/operators/manual', formData);
      setSuccess(true);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création du compte. Vérifiez si l\'email existe déjà.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-4">Dossier créé avec succès !</h2>
        <p className="text-subtext mb-8">Le compte a été créé en attente de validation. Le client devra réinitialiser son mot de passe lors de sa première connexion.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold"
        >
          Saisir un nouveau dossier
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 print:bg-white print:m-0 print:p-0">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-black text-foreground mb-2">Enregistrement Physique (Guichet)</h1>
          <p className="text-subtext">Saisie des dossiers papiers déposés physiquement au bureau.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-accent text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
        >
          <Printer className="w-5 h-5" />
          Imprimer la Fiche Vierge
        </button>
      </div>

      <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm print:border-none print:shadow-none print:rounded-none">
        
        {/* En-tête impression */}
        <div className="hidden print:block text-center mb-10 pb-10 border-b-2 border-gray-800">
          <h1 className="text-3xl font-black mb-2 uppercase">Fiche d'enregistrement Opérateur</h1>
          <p className="font-bold text-gray-600">Plateforme Congo Tourisme — Securits Tech</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Section 1: Etablissement */}
          <div>
            <h3 className="text-xl font-black flex items-center gap-2 mb-6 border-b pb-2">
              <Building2 className="w-5 h-5 text-primary" /> 1. Informations de l'établissement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Nom de l'établissement *</label>
                <input 
                  required
                  type="text"
                  value={formData.businessName}
                  onChange={e => setFormData({...formData, businessName: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 print:bg-transparent print:border-b print:border-t-0 print:border-x-0 print:rounded-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Type d'activité *</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 print:bg-transparent print:border-b print:border-t-0 print:border-x-0 print:rounded-none"
                  value={formData.businessType}
                  onChange={e => setFormData({...formData, businessType: e.target.value})}
                >
                  <option value="HOTEL">Hôtel / Hébergement</option>
                  <option value="RESTAURANT">Restaurant / Maquis</option>
                  <option value="LEISURE">Loisirs / Tourisme</option>
                  <option value="NIGHTLIFE">Vie Nocturne (Boîtes, Bars)</option>
                  <option value="AGENCY">Agence de Voyage</option>
                  <option value="CASINO">Casino / Salle de jeux</option>
                  <option value="EVENT_HALL">Salle de Fête / Conférence</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Numéro RCCM *</label>
                <input 
                  required
                  type="text"
                  value={formData.rccmNumber}
                  onChange={e => setFormData({...formData, rccmNumber: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 print:bg-transparent print:border-b print:border-t-0 print:border-x-0 print:rounded-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Numéro d'Identification Unique (NIU)</label>
                <input 
                  type="text"
                  value={formData.taxId}
                  onChange={e => setFormData({...formData, taxId: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 print:bg-transparent print:border-b print:border-t-0 print:border-x-0 print:rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact */}
          <div>
            <h3 className="text-xl font-black flex items-center gap-2 mb-6 border-b pb-2">
              <User className="w-5 h-5 text-primary" /> 2. Responsable / Propriétaire
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Prénom *</label>
                <input 
                  required
                  type="text"
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 print:bg-transparent print:border-b print:border-t-0 print:border-x-0 print:rounded-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Nom *</label>
                <input 
                  required
                  type="text"
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 print:bg-transparent print:border-b print:border-t-0 print:border-x-0 print:rounded-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Email (obligatoire pour le compte) *</label>
                <input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 print:bg-transparent print:border-b print:border-t-0 print:border-x-0 print:rounded-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Téléphone *</label>
                <input 
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 print:bg-transparent print:border-b print:border-t-0 print:border-x-0 print:rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Adresse */}
          <div>
            <h3 className="text-xl font-black flex items-center gap-2 mb-6 border-b pb-2">
              <MapPin className="w-5 h-5 text-primary" /> 3. Localisation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Département *</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 print:bg-transparent print:border-b print:border-t-0 print:border-x-0 print:rounded-none"
                  value={formData.region}
                  onChange={e => setFormData({...formData, region: e.target.value})}
                >
                  <option value="Brazzaville">Brazzaville</option>
                  <option value="Pointe-Noire">Pointe-Noire</option>
                  <option value="Kouilou">Kouilou</option>
                  <option value="Niari">Niari</option>
                  <option value="Bouenza">Bouenza</option>
                  <option value="Lékoumou">Lékoumou</option>
                  <option value="Pool">Pool</option>
                  <option value="Plateaux">Plateaux</option>
                  <option value="Cuvette">Cuvette</option>
                  <option value="Cuvette-Ouest">Cuvette-Ouest</option>
                  <option value="Sangha">Sangha</option>
                  <option value="Likouala">Likouala</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Ville / Arrondissement *</label>
                <input 
                  required
                  type="text"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 print:bg-transparent print:border-b print:border-t-0 print:border-x-0 print:rounded-none"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-foreground">Adresse complète *</label>
                <input 
                  required
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 print:bg-transparent print:border-b print:border-t-0 print:border-x-0 print:rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Abonnement */}
          <div>
            <h3 className="text-xl font-black flex items-center gap-2 mb-6 border-b pb-2">
              <CreditCard className="w-5 h-5 text-primary" /> 4. Abonnement choisi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['STARTER', 'PROFESSIONAL', 'PREMIUM'].map((plan) => (
                <label key={plan} className={`flex flex-col p-4 border rounded-2xl cursor-pointer print:border-gray-800 ${formData.subscriptionPlan === plan ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <input 
                      type="radio" 
                      name="plan" 
                      value={plan} 
                      checked={formData.subscriptionPlan === plan}
                      onChange={e => setFormData({...formData, subscriptionPlan: e.target.value})}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="font-black text-foreground">{plan}</span>
                  </div>
                  <span className="text-xs text-subtext font-medium ml-7">
                    {plan === 'STARTER' ? '15 000 FCFA/mois' : plan === 'PROFESSIONAL' ? '45 000 FCFA/mois' : '120 000 FCFA/mois'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Checklist Documents - Visible à l'impression */}
          <div className="hidden print:block mt-12 border-2 border-gray-800 p-6">
            <h4 className="font-black uppercase mb-4">Pièces à fournir (Cocher si reçu)</h4>
            <div className="space-y-4">
              <div className="flex gap-4 items-center"><div className="w-6 h-6 border-2 border-gray-800"></div> <span>Copie RCCM</span></div>
              <div className="flex gap-4 items-center"><div className="w-6 h-6 border-2 border-gray-800"></div> <span>Copie Pièce d'identité du gérant</span></div>
              <div className="flex gap-4 items-center"><div className="w-6 h-6 border-2 border-gray-800"></div> <span>Justificatif d'adresse / Contrat de bail</span></div>
              <div className="flex gap-4 items-center"><div className="w-6 h-6 border-2 border-gray-800"></div> <span>Reçu de paiement du premier mois / année</span></div>
            </div>
          </div>

          {/* Signatures - Visible à l'impression */}
          <div className="hidden print:grid grid-cols-2 mt-12 pt-12">
            <div className="text-center">
              <p className="font-bold mb-16">Signature du Client</p>
              <p className="text-sm text-gray-500">Lu et approuvé</p>
            </div>
            <div className="text-center">
              <p className="font-bold mb-16">Cachet & Signature Securits Tech</p>
              <p className="text-sm text-gray-500">Agent traitant</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 print:hidden pt-6">
            <button 
              type="button"
              onClick={handlePrint}
              className="px-6 py-4 rounded-xl font-bold text-subtext bg-gray-100 hover:bg-gray-200 transition-all"
            >
              Imprimer la fiche vierge
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
              Créer le compte opérateur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
