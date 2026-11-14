import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/caveat';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import './globals.scss';
import { SITE } from '@/data/content';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    title: SITE.title,
    description: SITE.description,
    url: '/',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: SITE.title }],
  },
  twitter: { card: 'summary_large_image', title: SITE.title, description: SITE.description },
};

export const viewport: Viewport = {
  themeColor: '#0e0d0c',
  colorScheme: 'dark',
  viewportFit: 'cover',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.name,
  jobTitle: 'Java Full Stack Developer',
  email: `mailto:${SITE.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Kathmandu', addressCountry: 'NP' },
  sameAs: [SITE.github, SITE.linkedin],
  url: SITE.url,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
