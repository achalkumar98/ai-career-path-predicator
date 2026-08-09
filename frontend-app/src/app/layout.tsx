import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './responsive.css';
import ClientLayout from '@/components/ClientLayout';
import { ThemeProvider } from '@/context/ThemeContext';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'AiCareerNav',
  description: 'AI-powered career navigator — resumes, job search, insights and more.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AiCareerNav',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2255ec',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AiCareerNav" />
        <link rel="apple-touch-icon" href="/assets/aicareernav-logo.png" />
        <link rel="icon" type="image/png" href="/assets/aicareernav-logo.png" />
      </head>
      <body>
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
        {/* Service Worker registration */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').catch(function(){});
            });
          }
        `}} />
      </body>
    </html>
  );
}
