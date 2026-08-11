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
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />

        {/* ── iOS Splash Screens (apple-touch-startup-image) ──────────────
            Each link must exactly match the device's logical resolution
            multiplied by its pixel ratio — iOS picks the closest match.     */}

        {/* iPhone SE 1st gen — 320×568 @2x */}
        <link rel="apple-touch-startup-image"
          href="/icons/splash-640x1136.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />

        {/* iPhone 8 / SE 2nd & 3rd gen — 375×667 @2x */}
        <link rel="apple-touch-startup-image"
          href="/icons/splash-750x1334.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />

        {/* iPhone 8 Plus — 414×736 @3x */}
        <link rel="apple-touch-startup-image"
          href="/icons/splash-1242x2208.png"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />

        {/* iPhone X / XS / 11 Pro / 12 mini / 13 mini — 375×812 @3x */}
        <link rel="apple-touch-startup-image"
          href="/icons/splash-1125x2436.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />

        {/* iPhone XR / 11 — 414×896 @2x */}
        <link rel="apple-touch-startup-image"
          href="/icons/splash-1242x2688.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />

        {/* iPhone XS Max / 11 Pro Max — 414×896 @3x */}
        <link rel="apple-touch-startup-image"
          href="/icons/splash-1242x2688.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />

        {/* iPhone 12 / 12 Pro / 13 / 13 Pro / 14 — 390×844 @3x */}
        <link rel="apple-touch-startup-image"
          href="/icons/splash-1170x2532.png"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />

        {/* iPhone 12 Pro Max / 13 Pro Max / 14 Plus — 428×926 @3x */}
        <link rel="apple-touch-startup-image"
          href="/icons/splash-1284x2778.png"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />

        {/* iPhone 14 Pro / 15 / 15 Pro / 16 — 393×852 @3x */}
        <link rel="apple-touch-startup-image"
          href="/icons/splash-1179x2556.png"
          media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />

        {/* iPhone 14 Pro Max / 15 Plus / 15 Pro Max / 16 Plus / 16 Pro Max — 430×932 @3x */}
        <link rel="apple-touch-startup-image"
          href="/icons/splash-1290x2796.png"
          media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />

        {/* iPad general fallback */}
        <link rel="apple-touch-startup-image"
          href="/icons/splash-1668x2388.png"
          media="(min-device-width: 768px) and (orientation: portrait)" />
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
