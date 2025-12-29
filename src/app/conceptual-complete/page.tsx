'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import beakerContent from '@/content/beaker.json';
import { updateProgress } from '@/lib/storage';

export default function ConceptualCompletePage() {
  const router = useRouter();
  const transition = beakerContent.transitions.afterConceptual;

  useEffect(() => {
    updateProgress({ currentPage: 'conceptual-complete' });
  }, []);

  const handleContinue = () => {
    updateProgress({ currentPage: 'logistics' });
    router.push('/logistics');
  };

  return (
    <main className="min-h-screen flex flex-col p-8">
      <div className="flex-1 flex items-center justify-center">
        <div className="flex gap-8 items-stretch">
          <div className="h-[460px] w-[307px] flex-shrink-0 bg-lab-white/90 backdrop-blur-sm rounded-card shadow-card overflow-hidden">
            <Image
              src="/assets/SmileyFace.png"
              alt="Beaker"
              width={307}
              height={460}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="h-[460px] w-[560px] flex-shrink-0 card p-8 flex flex-col">
            <h1 className="text-heading text-lab-black mb-6 text-balance">
              {transition.title}
            </h1>
            
            <div className="space-y-4">
              {transition.dialogue.map((line, i) => (
                <p 
                  key={i} 
                  className="text-[1.2rem] text-lab-gray-700 leading-relaxed" 
                  dangerouslySetInnerHTML={{ 
                    __html: line
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-lab-black font-semibold">$1</strong>')
                      .replace(/_(.*?)_/g, '<em>$1</em>')
                  }} 
                />
              ))}
            </div>

            <div className="mt-auto pt-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-lab-green/10 text-lab-green rounded-full">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[1rem] font-medium text-lab-green/90">Stage 1 complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 pb-4">
        <button onClick={handleContinue} className="px-10 py-4 bg-lab-black text-lab-white text-lg font-medium rounded-button hover:bg-lab-gray-800 active:scale-[0.98] transition-all">
          {transition.ctaText}
        </button>
      </div>
    </main>
  );
}
