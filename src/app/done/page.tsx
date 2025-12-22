'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateProgress } from '@/lib/storage';

export default function DonePage() {
  const router = useRouter();

  useEffect(() => {
    updateProgress({ currentPage: 'done' });
  }, []);

  const handleBackToStart = () => {
    // Navigate to intro but DO NOT clear localStorage (per spec)
    updateProgress({ currentPage: 'intro', introSlideIndex: 0 });
    router.push('/intro');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✓</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">All set.</h1>
        <p className="text-gray-600 mb-8">
          You&apos;ve completed the planning guide. Good luck with your event!
        </p>

        <button
          onClick={handleBackToStart}
          className="px-6 py-3 bg-black text-white rounded"
        >
          ← Back to start
        </button>
      </div>
    </main>
  );
}
