import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PreloadAssets } from '@/components/PreloadAssets';
import { PageTransition } from '@/components/PageTransition';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const siteTitle = 'Host a ChatGPT Lab At Your Campus';
const siteDescription =
  'Plan a one-hour, peer-led ChatGPT Lab with a guided checklist, editable event plan, and downloadable artifacts. Built to help student hosts organize a great on-campus AI event.';

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: '/assets/favicon.png',
    shortcut: '/assets/favicon.png',
    apple: '/assets/favicon.png',
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: '/assets/shareImage.png',
        width: 1200,
        height: 630,
        alt: 'ChatGPT Lab event planning preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/assets/shareImage.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <PreloadAssets />
        {/* Background layer */}
        <div 
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: 'url(/assets/Background.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Blur + yellow tint overlay */}
          <div className="absolute inset-0 backdrop-blur-bg bg-lab-yellow-50/40" />
        </div>
        
        {/* Mobile gate - shown only on small screens */}
        <div className="lg:hidden fixed inset-0 z-50 flex items-center justify-center bg-lab-yellow p-8">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-lab-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-card">
              <span className="text-2xl">💻</span>
            </div>
            <h1 className="text-heading text-lab-black mb-3">Desktop Required</h1>
            <p className="text-body text-lab-gray-600">
              This planning tool works best on a larger screen. Please visit on a desktop or laptop.
            </p>
          </div>
        </div>
        
        {/* Main content - hidden on mobile */}
        <div className="hidden lg:block min-h-screen">
          <PageTransition>{children}</PageTransition>
        </div>
      </body>
    </html>
  );
}
