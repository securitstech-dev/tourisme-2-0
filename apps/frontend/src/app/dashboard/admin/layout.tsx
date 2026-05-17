'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard as Layout, 
  Users, 
  LogOut, 
  Bell,
  ShieldCheck as Shield,
  CreditCard,
  BookOpen,
  Menu,
  MessageSquare,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      // router.push('/auth/login');
    }
  }, [isAuthenticated, user, router]);

  if (!mounted) return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  const menuItems = [
    { icon: Layout, label: 'Tableau de bord', href: '/dashboard/admin' },
    { icon: Users, label: 'Opérateurs', href: '/dashboard/admin/validations' },
    { icon: MessageSquare, label: 'Chatbot IA (Kongo)', href: '/dashboard/admin/chatbot' },
    { icon: CreditCard, label: 'Finance & Stats', href: '/dashboard/admin/settings' },
    { icon: BookOpen, label: 'Mode d\'emploi', href: '/dashboard/admin/manual' },
    { icon: Shield, label: 'Système', href: '/dashboard/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-accent/20 overflow-hidden relative">
      {/* Overlay pour mobile quand la sidebar est ouverte */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Admin" className="h-10 w-auto object-contain" />
          </div>
          <button 
            className="lg:hidden p-2 text-subtext hover:bg-accent rounded-lg"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-subtext font-medium rounded-xl hover:bg-accent hover:text-secondary transition-all group"
            >
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-subtext hover:bg-accent rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg lg:text-xl font-bold text-foreground truncate max-w-[150px] lg:max-w-none">
              Administration
            </h2>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-6">
            <button className="relative p-2 text-subtext hover:bg-accent rounded-full transition-all">
              <Bell className="w-5 h-5 lg:w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-6 border-l border-gray-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs lg:text-sm font-bold text-foreground">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] lg:text-xs text-subtext uppercase tracking-tighter">Admin</p>
              </div>
              <div className="w-8 h-8 lg:w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base">
                {user?.firstName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
