'use client';

import { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  ShieldAlert
} from 'lucide-react';

export default function AdminOperatorsValidation() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for operators pending validation
  const [operators, setOperators] = useState([
    {
      id: '1',
      businessName: 'Grand Hôtel de Brazza',
      manager: 'Sylvain Ngoma',
      type: 'HÔTEL',
      region: 'Brazzaville',
      city: 'Brazzaville',
      phone: '+242 06 123 45 67',
      email: 'contact@grandhotelbrazza.cg',
      status: 'PENDING',
      submittedAt: 'Il y a 2h',
    },
    {
      id: '2',
      businessName: 'Le Mayombe Expériences',
      manager: 'Alice Mviri',
      type: 'AGENCE',
      region: 'Kouilou',
      city: 'Pointe-Noire',
      phone: '+242 05 987 65 43',
      email: 'alice@mayombe-exp.com',
      status: 'PENDING',
      submittedAt: 'Il y a 5h',
    },
    {
      id: '3',
      businessName: 'Mami Wata Coast',
      manager: 'Paul Kimpolo',
      type: 'RESTAURANT',
      region: 'Kouilou',
      city: 'Pointe-Noire',
      phone: '+242 06 444 33 22',
      email: 'paul.k@mamiwata.cg',
      status: 'PENDING',
      submittedAt: 'Hier',
    }
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-black text-gray-900">Validation des Opérateurs</h1>
          </div>
          <p className="text-gray-500 font-medium">Examinez et validez les nouveaux partenaires avant leur mise en ligne.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative w-72">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
             <input 
               type="text" 
               placeholder="Rechercher un opérateur..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 font-medium"
             />
           </div>
           <button className="p-3 bg-white border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all flex items-center gap-2 font-bold">
             <Filter className="w-5 h-5" />
             Filtrer
           </button>
        </div>
      </div>

      {/* List */}
      <div className="grid gap-6">
        {operators.map((operator) => (
          <div key={operator.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between group">
            
            <div className="flex items-center gap-6 flex-1">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors">{operator.businessName}</h3>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    {operator.type}
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-500">Géré par <span className="text-gray-900">{operator.manager}</span></p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4 text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                {operator.city}, {operator.region}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                {operator.phone}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                {operator.email}
              </div>
              <div className="flex items-center gap-2 text-orange-600 font-bold">
                <Clock className="w-4 h-4" />
                Soumis {operator.submittedAt}
              </div>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
              <button className="flex-1 lg:flex-none px-4 py-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 hover:text-gray-900 font-bold transition-all flex items-center justify-center gap-2">
                <Eye className="w-5 h-5" />
                Dossier
              </button>
              <button className="flex-1 lg:flex-none px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white font-bold transition-all flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5" />
                Rejeter
              </button>
              <button className="flex-1 lg:flex-none px-4 py-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white font-bold transition-all flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Approuver
              </button>
            </div>

          </div>
        ))}

        {operators.length === 0 && (
          <div className="bg-white p-20 rounded-[40px] border border-gray-100 shadow-sm text-center">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Aucune validation en attente</h2>
            <p className="text-gray-500">Tous les opérateurs ont été traités. Bon travail !</p>
          </div>
        )}
      </div>
    </div>
  );
}
