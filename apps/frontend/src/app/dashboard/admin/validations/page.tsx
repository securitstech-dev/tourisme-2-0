'use client';

import { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Search, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Building2,
  Calendar,
  Eye
} from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AdminValidationsPage() {
  const [operators, setOperators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const response = await api.get('/admin/operators/pending');
        setOperators(response.data);
      } catch (error) {
        console.error('Erreur rcupration attente:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleAction = async (id: string, action: 'validate' | 'reject') => {
    const confirmed = confirm(`Voulez-vous vraiment ${action === 'validate' ? 'valider' : 'rejeter'} cet opérateur ?`);
    if (!confirmed) return;

    try {
      await api.patch(`/admin/operators/${id}/${action}`);
      setOperators(prev => prev.filter(op => op.id !== id));
    } catch (error) {
      alert(`Erreur lors de l'action ${action}.`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Validations de Dossiers</h1>
          <p className="text-subtext">Examinez les demandes d'inscription des nouveaux partenaires.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-subtext/40" />
          <input 
            type="text" 
            placeholder="Rechercher un dossier..." 
            className="w-full pl-12 pr-4 py-3 bg-accent/20 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" /></div>
        ) : operators.length === 0 ? (
          <div className="p-20 text-center">
            <Building2 className="w-12 h-12 text-subtext/20 mx-auto mb-4" />
            <p className="text-subtext font-bold">Aucune demande en attente de validation.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-accent/5 text-subtext text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-4">Opérateur / Entreprise</th>
                  <th className="px-6 py-4">Ville / Région</th>
                  <th className="px-6 py-4">Date de soumission</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {operators.map((op) => (
                  <tr key={op.id} className="hover:bg-accent/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center font-bold">
                          {op.businessName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm">{op.businessName}</p>
                          <p className="text-xs text-subtext">{op.businessType} • {op.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-foreground">{op.city}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-subtext flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(op.createdAt), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-accent rounded-xl transition-all" title="Voir le dossier">
                          <Eye className="w-5 h-5 text-subtext" />
                        </button>
                        <button 
                          onClick={() => handleAction(op.id, 'validate')}
                          className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all shadow-sm border border-green-100"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleAction(op.id, 'reject')}
                          className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all shadow-sm border border-red-100"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
