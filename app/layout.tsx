import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/navigation/site-header';
import { SiteFooter } from '@/components/footer/site-footer';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  title: {
    template: '%s | Aṅkita',
    default: 'Aṅkita — Numerology, with its sources attached',
  },
  description: SITE_CONFIG.description,
  keywords: ['Numerology', 'Aṅka', 'Chaldean', 'Lo Shu', 'Kaṭapayādi', 'Bhūtasaṅkhyā', 'Nāmākṣara', 'Jyotiṣa'],
  openGraph: {
    title: 'Aṅkita — Numerology, with its sources attached',
    description: SITE_CONFIG.description,
    type: 'website',
    siteName: 'Aṅkita',
  },
  icons: { icon: '/logo.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-canvas text-ink antialiased">
        <SiteHeader />
        <main id="main-content" className="flex-1 flex flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
