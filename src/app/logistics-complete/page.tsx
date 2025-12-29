'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import beakerContent from '@/content/beaker.json';
import { updateProgress } from '@/lib/storage';

export default function LogisticsCompletePage() {
  const router = useRouter();
  const transition = beakerContent.transitions.afterLogistics;

  useEffect(() => {
    updateProgress({ currentPage: 'logistics-complete' });
  }, []);

  const handleContinue = () => {
    updateProgress({ currentPage: 'summary' });
    router.push('/summary');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-flow w-full">
        {/* Beaker + Speech layout */}
        <div className="flex gap-10 items-center">
          {/* Beaker */}
          <div className="flex-shrink-0">
            <div className="w-36 h-36 bg-lab-white rounded-full shadow-card flex items-center justify-center overflow-hidden">
              <Image
                src="/assets/SmileyFace.png"
                alt="Beaker"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
          </div>

          {/* Speech card */}
          <div className="flex-1 card p-8">
            {/* Success badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-lab-green/10 text-lab-green rounded-full mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-caption font-medium">Stage 2 complete</span>
            </div>

            {/* Title */}
            <h1 className="text-heading text-lab-black mb-6 text-balance">
              {transition.title}
            </h1>
            
            {/* Dialogue */}
            <div className="space-y-4">
              {transition.dialogue.map((line, i) => (
                <p 
                  key={i} 
                  className="text-body text-lab-gray-700 leading-relaxed" 
                  dangerouslySetInnerHTML={{ 
                    __html: line
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-lab-black font-semibold">$1</strong>')
                      .replace(/_(.*?)_/g, '<em>$1</em>')
                  }} 
                />
              ))}
            </div>

            {/* CTA */}
            <div className="flex justify-end mt-8 pt-6 border-t border-lab-gray-100">
              <button onClick={handleContinue} className="btn-primary">
                {transition.ctaText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
