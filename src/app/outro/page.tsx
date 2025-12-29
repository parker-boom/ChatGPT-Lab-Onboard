'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import beakerContent from '@/content/beaker.json';
import { updateProgress } from '@/lib/storage';

export default function OutroPage() {
  const router = useRouter();
  const transition = beakerContent.transitions.outro;

  useEffect(() => {
    updateProgress({ currentPage: 'outro' });
  }, []);

  const handleFinish = () => {
    updateProgress({ currentPage: 'done' });
    router.push('/done');
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
            {/* Celebration badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-lab-yellow-200 rounded-full mb-4">
              <span className="text-lg">🎉</span>
              <span className="text-caption font-medium text-lab-black">You did it!</span>
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
              <button onClick={handleFinish} className="btn-primary">
                {transition.ctaText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
