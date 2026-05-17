'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Save, 
  Sparkles, 
  Info,
  AlertCircle,
  Loader2,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import api from '@/lib/api';

export default function ChatbotEducationPage() {
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [newTopic, setNewTopic] = useState('');
  const [newContent, setNewContent] = useState('');

  const fetchKnowledge = async () => {
    try {
      const res = await api.get('/chatbot/knowledge');
      setKnowledge(res.data);
    } catch (err) {
      console.error('Error fetching knowledge:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic || !newContent) return;

    setSaving(true);
    setSuccess(null);
    setError(null);
    
    try {
      await api.post('/chatbot/knowledge', { topic: newTopic, content: newContent });
      setSuccess('Mémoire mise à jour ! Kongo en sait un peu plus.');
      setNewTopic('');
      setNewContent('');
      fetchKnowledge();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError('Erreur lors de l\'ajout de connaissance');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette connaissance ?')) return;
    
    try {
      await api.delete(`/chatbot/knowledge/${id}`);
      fetchKnowledge();
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Éducation de Kongo</h1>
            <p className="text-subtext font-medium">Gérez la base de connaissances et la personnalité de votre IA.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-xl text-secondary text-sm font-bold animate-pulse">
          <Sparkles className="w-4 h-4" />
          IA Active (Claude 3.5 Sonnet)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm sticky top-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Ajouter un savoir
            </h3>
            
            <form onSubmit={handleAdd} className="space-y-4">
              {success && (
                <div className="p-4 bg-green-50 border border-green-100 text-green-700 text-sm rounded-2xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {success}
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-2xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div>
                <label className="text-xs font-black text-subtext uppercase tracking-widest ml-1 mb-2 block">Sujet / Thème</label>
                <input 
                  type="text" 
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="ex: Géographie du Nord Congo"
                  className="w-full bg-accent/30 border border-transparent rounded-2xl px-5 py-4 focus:bg-white focus:border-primary/30 transition-all font-medium text-sm outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="text-xs font-black text-subtext uppercase tracking-widest ml-1 mb-2 block">Contenu détaillé</label>
                <textarea 
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Décrivez ici ce que Kongo doit savoir..."
                  className="w-full bg-accent/30 border border-transparent rounded-2xl px-5 py-4 focus:bg-white focus:border-primary/30 transition-all font-medium text-sm resize-none outline-none"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={saving}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Enregistrer dans la mémoire
              </button>
            </form>

            <div className="mt-8 p-4 bg-blue-50 rounded-2xl flex gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0" />
              <p className="text-xs text-blue-700 font-medium leading-relaxed">
                Plus vos informations sont précises, plus Kongo sera utile. Mentionnez Brazzaville explicitement pour éviter la confusion avec la RDC.
              </p>
            </div>
          </div>
        </div>

        {/* Knowledge List Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm min-h-[400px]">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" />
              Mémoire actuelle de Kongo
            </h3>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-subtext">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="font-bold">Chargement de la conscience...</p>
              </div>
            ) : knowledge.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-gray-200" />
                </div>
                <div>
                  <p className="font-bold text-gray-400">Kongo n'a pas encore de savoir spécifique.</p>
                  <p className="text-sm text-gray-300">Utilisez le formulaire pour commencer son éducation.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {knowledge.map((item) => (
                  <div key={item.id} className="group p-6 bg-accent/20 rounded-[24px] border border-transparent hover:border-primary/20 transition-all hover:bg-white hover:shadow-xl relative">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-lg text-primary">{item.topic}</h4>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-subtext leading-relaxed whitespace-pre-wrap">
                      {item.content}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                      <span>Ajouté le {new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
