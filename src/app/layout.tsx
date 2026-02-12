import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { SkipLink } from '@/components/skip-link';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Digital Prep Brain — Kitchen Operations Platform',
    template: '%s | PrepBrain',
  },
  description:
    'Reduce food waste and labor inefficiency with automated prep list generation. Digital Prep Brain transforms POS sales data into daily kitchen prep plans.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    title: 'Digital Prep Brain',
    description: 'Smart kitchen prep automation from sales data to prep lists.',
    siteName: 'Digital Prep Brain',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SkipLink />
        <Providers>
          <div id="main-content">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
