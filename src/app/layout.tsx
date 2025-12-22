import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
    <html lang="en">
      <body className={`${inter.className} bg-lab-yellow-50 text-lab-black antialiased`}>
        {/* Mobile gate - shown only on small screens */}
        <div className="lg:hidden fixed inset-0 z-50 flex items-center justify-center bg-lab-yellow p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please view on desktop</h1>
            <p className="text-lab-gray-700">
              This planning tool is designed for desktop browsers.
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
