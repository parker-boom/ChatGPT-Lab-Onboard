'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import transitionsContent from '@/content/transitions.json';
import { updateProgress } from '@/lib/storage';
import { BeakerLayout } from '@/components/BeakerLayout';

export default function LogisticsCompletePage() {
  const router = useRouter();
  const transition = transitionsContent.transitions.afterLogistics;
  const beakerImageSrc = transition.imageKey ? `/assets/${transition.imageKey}` : undefined;

  const handleContinue = useCallback(() => {
    updateProgress({ currentPage: 'summary' });
    router.push('/summary');
  }, [router]);

  useEffect(() => {
    updateProgress({ currentPage: 'logistics-complete' });
  }, []);

  useEffect(() => {
    router.prefetch('/summary');
  }, [router]);

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
          imageSrc={beakerImageSrc}
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
