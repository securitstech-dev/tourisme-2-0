/** Pied de page premium de Congo Tourisme — design Luxe Organique. */
import Link from 'next/link';
import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';

const footerGroups = [
  {
    title: 'Explorer',
    links: [
      { href: '/explore', label: 'Toutes les offres' },
      { href: '/explore?type=HOTEL', label: 'Hôtels & Lodges' },
      { href: '/explore?type=RESTAURANT', label: 'Gastronomie' },
      { href: '/explore?type=SITE', label: 'Sites Naturels' },
      { href: '/explore?type=LEISURE_ACTIVITY', label: 'Sorties & Loisirs' },
    ],
  },
  {
    title: 'Opérateurs',
    links: [
      { href: '/operator', label: 'Devenir partenaire' },
      { href: '/pricing', label: 'Nos offres' },
      { href: '/auth/register-operator', label: 'Inscription pro' },
      { href: '/auth/login?portal=operator', label: 'Espace opérateur' },
    ],
  },
  {
    title: 'Informations',
    links: [
      { href: '/about', label: 'À propos' },
      { href: '/guides', label: 'Guides de voyage' },
      { href: '/contact', label: 'Contact' },
      { href: '/terms', label: 'Mentions légales' },
      { href: '/privacy', label: 'Confidentialité' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0F1410] text-white">
      {/* CTA Band */}
      <div className="border-b border-white/10">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[#C8860A] text-xs font-black uppercase tracking-[0.2em] mb-3">Rejoignez l'aventure</p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Le Congo n'attend que vous.
            </h2>
          </div>
          <Link
            href="/auth/register"
            className="group flex items-center gap-3 rounded-[16px] bg-gradient-to-r from-[#1A6B4A] to-[#2D8C64] px-8 py-5 text-sm font-bold text-white shadow-xl shadow-[#1A6B4A]/20 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            Créer mon compte gratuit
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-20">
        <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand Column */}
          <div className="space-y-8">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-[#2D8C64] mb-4">Congo Tourisme</p>
              <h3 className="text-2xl font-black text-white leading-snug">
                La vitrine numérique du tourisme congolais.
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed font-medium">
              Plateforme SaaS de tourisme national — marchés, hôtels, restaurants, parcs et activités vérifiés en République du Congo.
            </p>
            <div className="space-y-4 text-sm">
              <a href="tel:+242053028383" className="flex items-center gap-4 text-gray-400 hover:text-[#2D8C64] transition-colors group">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 group-hover:bg-[#1A6B4A]/20 transition-colors">
                  <Phone className="h-4 w-4 text-[#C8860A]" />
                </div>
                +242 05 302 8383 / +242 06 881 71 04
              </a>
              <a href="mailto:securitstech@gmail.com" className="flex items-center gap-4 text-gray-400 hover:text-[#2D8C64] transition-colors group">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 group-hover:bg-[#1A6B4A]/20 transition-colors">
                  <Mail className="h-4 w-4 text-[#C8860A]" />
                </div>
                securitstech@gmail.com
              </a>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                  <MapPin className="h-4 w-4 text-[#C8860A]" />
                </div>
                Pointe-Noire, République du Congo
              </div>
            </div>
            {/* Réseaux sociaux */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 hover:border-[#2D8C64] hover:bg-[#1A6B4A]/20 hover:text-[#2D8C64] transition-all"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 hover:border-[#2D8C64] hover:bg-[#1A6B4A]/20 hover:text-[#2D8C64] transition-all"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 hover:border-[#2D8C64] hover:bg-[#1A6B4A]/20 hover:text-[#2D8C64] transition-all"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/60 mb-8">{group.title}</h4>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white font-medium transition-colors hover:translate-x-1 inline-block transition-transform duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 font-medium">
            © {new Date().getFullYear()} Congo Tourisme — Securits Tech. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#2D8C64] animate-pulse" />
            <p className="text-sm text-gray-500 font-medium">Plateforme opérationnelle · Pointe-Noire, Congo</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
