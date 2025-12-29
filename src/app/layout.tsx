import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ChatGPT Lab - Host Guide',
  description: 'Plan your ChatGPT Lab on Campus event',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
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
          {children}
        </div>
      </body>
    </html>
  );
}
