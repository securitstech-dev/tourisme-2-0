/** Mise en page securisee de l'espace operateur. */
'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Bell,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Receipt,
  Settings,
  Store,
  User as UserIcon,
  X,
} from 'lucide-react';

import { useAuthStore } from '@/store/authStore';

const menuItems = [
  { icon: LayoutDashboard, label: 'Vue d ensemble', href: '/dashboard/operator' },
  { icon: Store, label: 'Mes offres', href: '/dashboard/operator/listings' },
  { icon: CalendarCheck, label: 'Reservations', href: '/dashboard/operator/reservations' },
  { icon: MessageSquare, label: 'Avis clients', href: '/dashboard/operator/reviews' },
  { icon: BarChart3, label: 'Statistiques', href: '/dashboard/operator/stats' },
  { icon: Receipt, label: 'Facturation', href: '/dashboard/operator/billing' },
  { icon: Settings, label: 'Parametres', href: '/dashboard/operator/settings' },
];

export default function OperatorLayout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isOnboarding = pathname === '/dashboard/operator/onboarding';

  useEffect(() => {
    setMounted(true);

    if (mounted && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (isAuthenticated && user?.role === 'OPERATOR' && user.operator && !user.operator.isValidated && !isOnboarding) {
      router.push('/dashboard/operator/onboarding');
    }
  }, [isAuthenticated, isOnboarding, router, user, mounted]);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-accent/35">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Congo Tourisme" width={132} height={44} className="h-11 w-auto object-contain" />
          </Link>
          <button
            type="button"
            className="rounded-xl p-2 text-subtext hover:bg-accent lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-4">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  active ? 'bg-primary text-white' : 'text-subtext hover:bg-accent hover:text-primary'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-danger hover:bg-danger/5"
          >
            <LogOut className="h-5 w-5" />
            Deconnexion
          </button>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-20 items-center justify-between border-b border-border bg-white px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-xl p-2 text-subtext hover:bg-accent lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-subtext">Congo Tourisme</p>
              <h1 className="text-lg font-black text-foreground">Espace operateur</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" className="relative rounded-full p-2 text-subtext hover:bg-accent">
              <Bell className="h-6 w-6" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-white" />
            </button>
            <div className="hidden border-l border-border pl-4 text-right sm:block">
              <p className="text-sm font-black text-foreground">
                {user?.firstName ?? 'Operateur'} {user?.lastName ?? ''}
              </p>
              <p className="text-xs font-bold text-subtext">Partenaire</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary">
              <UserIcon className="h-5 w-5" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
