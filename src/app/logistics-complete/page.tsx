'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
      <div className="max-w-3xl w-full">
        {/* Beaker + Speech layout */}
        <div className="flex gap-8 items-start">
          {/* Beaker placeholder */}
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-4xl">🧪</span>
          </div>

          {/* Speech card */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">{transition.title}</h1>
            
            <div className="space-y-3">
              {transition.dialogue.map((line, i) => (
                <p key={i} className="text-gray-700" dangerouslySetInnerHTML={{ 
                  __html: line
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/_(.*?)_/g, '<em>$1</em>')
                }} />
              ))}
            </div>

            {/* CTA */}
            <div className="flex justify-end mt-6 pt-4 border-t">
              <button
                onClick={handleContinue}
                className="px-6 py-2 bg-black text-white rounded"
              >
                {transition.ctaText} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
