'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { updateProgress } from '@/lib/storage';

export default function DonePage() {
  const router = useRouter();

  useEffect(() => {
    updateProgress({ currentPage: 'done' });
  }, []);

  const handleBackToStart = () => {
    updateProgress({ currentPage: 'intro', introSlideIndex: 0 });
    router.push('/intro');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* Beaker celebration */}
        <div className="w-32 h-32 bg-lab-white rounded-full shadow-card flex items-center justify-center mx-auto mb-8 overflow-hidden">
          <Image
            src="/assets/SmileyFace.png"
            alt="Beaker"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
        
        {/* Success message */}
        <div className="card p-8">
          <div className="w-12 h-12 bg-lab-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-lab-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-heading text-lab-black mb-3">All set!</h1>
          <p className="text-body text-lab-gray-500 mb-8">
            You&apos;ve completed the planning guide. Your progress is saved — come back anytime to review or update your plan.
          </p>

          <button
            onClick={handleBackToStart}
            className="btn-secondary"
          >
            ← Start over
          </button>
        </div>
      </div>
    </main>
  );
}
