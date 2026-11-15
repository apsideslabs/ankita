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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-ink antialiased">
        <SiteHeader />
        <main id="main-content" className="flex-1 flex flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
