'use client';

import Link from 'next/link';
import { CheckCircle2, Home, Calendar, ArrowRight } from 'lucide-react';

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-foreground">Réservation confirmée !</h1>
          <p className="text-lg text-subtext leading-relaxed">
            Votre demande a été envoyée avec succès. Vous recevrez un email de confirmation d'ici quelques instants.
          </p>
        </div>

        <div className="bg-accent/10 p-6 rounded-[32px] space-y-4 text-left">
          <p className="text-sm font-bold text-foreground">Prochaines étapes :</p>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm text-subtext">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">1</div>
              L'opérateur valide votre disponibilité.
            </li>
            <li className="flex gap-3 text-sm text-subtext">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">2</div>
              Retrouvez vos billets dans votre tableau de bord.
            </li>
            <li className="flex gap-3 text-sm text-subtext">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">3</div>
              Préparez vos bagages pour le Congo !
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Link 
            href="/dashboard/tourist" 
            className="w-full bg-primary text-white py-5 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Mes réservations
          </Link>
          <Link 
            href="/" 
            className="w-full bg-accent text-foreground py-5 rounded-2xl font-bold hover:bg-accent/80 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
