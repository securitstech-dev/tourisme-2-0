'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Star, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2,
  Bot
} from 'lucide-react';
import api from '@/lib/api';

export default function OperatorReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews/operator/my-reviews');
        setReviews(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Commentaires Clients</h1>
            <p className="text-subtext font-medium">Retours d'expérience modérés par l'IA Kongo.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-subtext">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-bold">Analyse des retours...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white p-20 rounded-[40px] text-center border border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-12 h-12 text-gray-200" />
          </div>
          <h3 className="text-xl font-bold text-gray-400 mb-2">Aucun commentaire pour le moment</h3>
          <p className="text-gray-300 max-w-xs mx-auto">Vos clients pourront bientôt laisser leurs avis sur vos établissements.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all group">
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex text-yellow-400 bg-yellow-50 px-3 py-1.5 rounded-full">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-full">{review.listing.title}</span>
                  </div>
                  
                  <p className="text-lg text-foreground font-semibold mb-6 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-primary font-black text-xs">
                      {review.author.firstName?.charAt(0)}
                    </div>
                    <div className="flex items-center gap-2 text-subtext">
                      <span className="font-bold text-foreground">{review.author.firstName} {review.author.lastName}</span>
                      <span>•</span>
                      <span className="font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:w-72 bg-gray-50 rounded-[24px] p-6 border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                    <Bot className="w-12 h-12" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 relative z-10">
                    <Bot className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-subtext">Moderator Kongo</span>
                  </div>
                  
                  {review.status === 'APPROVED' ? (
                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center gap-2 text-green-600 text-sm font-black uppercase tracking-tight">
                        <CheckCircle className="w-5 h-5" />
                        Approuvé
                      </div>
                      <p className="text-[11px] text-subtext font-medium leading-tight">
                        Ce commentaire est visible par tous les usagers sur votre fiche.
                      </p>
                    </div>
                  ) : review.status === 'REJECTED' ? (
                    <div className="space-y-3 relative z-10">
                      <div className="flex items-center gap-2 text-red-600 text-sm font-black uppercase tracking-tight">
                        <XCircle className="w-5 h-5" />
                        Rejeté
                      </div>
                      <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-[11px] text-red-700 font-bold leading-snug italic">
                          "{review.moderationComment}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-orange-500 text-sm font-black uppercase tracking-tight animate-pulse relative z-10">
                      <AlertCircle className="w-5 h-5" />
                      Analyse...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
