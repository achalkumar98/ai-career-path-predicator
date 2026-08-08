import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './responsive.css';
import ClientLayout from '@/components/ClientLayout';
import { ThemeProvider } from '@/context/ThemeContext';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'AI Career Navigator',
  description: 'Personalized skill-based guidance for your career journey',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
