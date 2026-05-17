'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { 
  Heart, 
  Map as MapIcon, 
  Calendar, 
  User as UserIcon, 
  Settings, 
  LogOut,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

export default function TouristLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (mounted && (!isAuthenticated)) {
      // router.push('/auth/login');
    }
  }, [isAuthenticated, router, mounted]);

  if (!mounted) return <div className="flex h-screen items-center justify-center bg-accent/10"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  const menuItems = [
    { icon: Calendar, label: 'Mes Réservations', href: '/dashboard/tourist' },
    { icon: Heart, label: 'Favoris', href: '/dashboard/tourist/favorites' },
    { icon: UserIcon, label: 'Mon Profil', href: '/dashboard/tourist/profile' },
    { icon: Settings, label: 'Paramètres', href: '/dashboard/tourist/settings' },
  ];

  return (
    <div className="min-h-screen bg-accent/10">
      {/* Top Bar */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-12 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <ChevronLeft className="w-5 h-5 text-subtext" />
          <span className="font-bold text-foreground">Retour à l'accueil</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-foreground">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-subtext">Usager</p>
          </div>
          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
            {user?.firstName?.charAt(0)}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-1">
            {menuItems.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-subtext font-bold rounded-2xl hover:bg-accent hover:text-primary transition-all group"
              >
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-all" />
                {item.label}
              </Link>
            ))}
            <div className="h-px bg-gray-50 my-2"></div>
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-bold rounded-2xl hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          {children}
        </main>
      </div>
    </div>
  );
}
