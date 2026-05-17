/** Layout racine de l'application frontend Congo Tourisme. */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import KongoChat from '@/components/chatbot/KongoChat';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Congo Tourisme | Marketplace touristique de la Republique du Congo',
  description:
    'Plateforme SaaS de tourisme national pour explorer les offres congolaises, reserver des experiences et accompagner les operateurs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <KongoChat />
        </div>
      </body>
    </html>
  );
}
