'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import transitionsContent from '@/content/transitions.json';
import { updateProgress } from '@/lib/storage';
import { BeakerLayout } from '@/components/BeakerLayout';

export default function LogisticsCompletePage() {
  const router = useRouter();
  const transition = transitionsContent.transitions.afterLogistics;

  const handleContinue = useCallback(() => {
    updateProgress({ currentPage: 'summary' });
    router.push('/summary');
  }, [router]);

  useEffect(() => {
    updateProgress({ currentPage: 'logistics-complete' });
  }, []);

  // Handle Enter key to continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleContinue]);

  return (
    <main className="min-h-screen flex flex-col p-8">
      <div className="flex-1 flex items-center justify-center">
        <BeakerLayout
          title={transition.title}
          dialogue={transition.dialogue}
          footer={
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-lab-green/10 text-lab-green rounded-full">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[1rem] font-medium text-lab-green/90">Stage 2 complete</span>
            </div>
          }
        />
      </div>

      <div className="flex flex-col items-center gap-3 pb-4">
        <button
          onClick={handleContinue}
          className="px-10 py-4 bg-lab-black text-lab-white text-lg font-medium rounded-button hover:bg-lab-gray-800 active:scale-[0.98] transition-all"
        >
          {transition.ctaText}
        </button>
      </div>
    </main>
  );
}
