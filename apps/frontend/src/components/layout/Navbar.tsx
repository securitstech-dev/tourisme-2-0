/** Barre de navigation principale — design premium flottant. */
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const navLinks = [
  { href: '/explore', label: 'Explorer' },
  { href: '/explore?type=HOTEL', label: 'Hôtels' },
  { href: '/explore?type=SITE', label: 'Nature & Parcs' },
  { href: '/pricing', label: 'Tarifs' },
];

export default function Navbar() {
  const { isAuthenticated: storedAuthenticated, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      setIsAtTop(scrollY < 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAuthenticated = isMounted && storedAuthenticated;
  const dashboardHref =
    user?.role === 'ADMIN'
      ? '/dashboard/admin'
      : user?.role === 'OPERATOR'
        ? '/dashboard/operator'
        : '/dashboard/tourist';

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6">
      <nav
        className={`mx-auto flex max-w-screen-2xl items-center justify-between rounded-[20px] px-5 py-3 transition-all duration-500 ${
          isScrolled
            ? 'border border-black/8 bg-white/95 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl'
            : 'border border-white/30 bg-white/15 shadow-sm backdrop-blur-md'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className={`flex h-10 w-10 items-center justify-center rounded-[12px] font-black text-lg transition-colors ${isScrolled ? 'bg-[#1A6B4A] text-white' : 'bg-white/20 text-white backdrop-blur-md border border-white/20'}`}>
            CT
          </div>
          <div className="min-w-0">
            <p className={`text-xs font-black uppercase tracking-[0.25em] transition-colors ${isScrolled ? 'text-[#1A6B4A]' : 'text-white'}`}>
              Congo Tourisme
            </p>
            <p className={`text-[10px] font-medium transition-colors hidden sm:block ${isScrolled ? 'text-gray-400' : 'text-white/70'}`}>
              par Securits Tech
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-[12px] px-4 py-2 text-sm font-bold transition-all hover:bg-white/20 ${
                isScrolled
                  ? 'text-gray-600 hover:text-[#1A6B4A] hover:bg-[#1A6B4A]/8'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <Link
                href={dashboardHref}
                className={`rounded-[12px] px-4 py-2 text-sm font-bold transition-all ${
                  isScrolled
                    ? 'text-gray-600 hover:text-[#1A6B4A] hover:bg-[#1A6B4A]/8'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                Mon espace
              </Link>
              <button
                type="button"
                onClick={() => useAuthStore.getState().logout()}
                className={`rounded-[12px] border px-5 py-2.5 text-sm font-bold transition-all hover:scale-105 active:scale-95 ${
                  isScrolled
                    ? 'border-gray-200 text-gray-600 hover:border-[#1A6B4A]/30 hover:text-[#1A6B4A]'
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={`rounded-[12px] px-4 py-2 text-sm font-bold transition-all ${
                  isScrolled
                    ? 'text-gray-600 hover:text-[#1A6B4A] hover:bg-[#1A6B4A]/8'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                Connexion
              </Link>
              <Link
                href="/auth/register"
                className={`rounded-[12px] px-5 py-2.5 text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 ${
                  isScrolled
                    ? 'bg-[#1A6B4A] text-white shadow-[#1A6B4A]/20'
                    : 'bg-white text-[#1A1A1A] shadow-black/10'
                }`}
              >
                Rejoindre
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-[12px] border transition-all lg:hidden ${
            isScrolled
              ? 'border-gray-200 bg-white text-gray-700 hover:border-[#1A6B4A]/30'
              : 'border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
          }`}
          aria-label="Menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mx-auto mt-3 max-w-screen-2xl rounded-[24px] border border-black/8 bg-white p-4 shadow-2xl shadow-black/10 backdrop-blur-xl lg:hidden">
          <div className="grid gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-[14px] px-4 py-3.5 text-sm font-bold text-gray-700 transition hover:bg-[#1A6B4A]/8 hover:text-[#1A6B4A]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 grid gap-2 border-t border-gray-100 pt-3">
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={() => setIsOpen(false)}
                  className="rounded-[14px] px-4 py-3.5 text-sm font-bold text-gray-700 transition hover:bg-[#1A6B4A]/8 hover:text-[#1A6B4A]"
                >
                  Mon espace
                </Link>
                <button
                  type="button"
                  onClick={() => { useAuthStore.getState().logout(); setIsOpen(false); }}
                  className="rounded-[14px] border border-gray-200 px-4 py-3.5 text-left text-sm font-bold text-gray-700"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="rounded-[14px] border border-gray-200 px-4 py-3.5 text-center text-sm font-bold text-gray-700"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="rounded-[14px] bg-[#1A6B4A] px-4 py-3.5 text-center text-sm font-bold text-white"
                >
                  Rejoindre gratuitement
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
