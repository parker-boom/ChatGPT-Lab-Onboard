'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import transitionsContent from '@/content/transitions.json';
import { updateProgress, getEventData } from '@/lib/storage';
import { BeakerLayout } from '@/components/BeakerLayout';

export default function OutroPage() {
  const router = useRouter();
  const transition = transitionsContent.transitions.outro;
  const beakerImageSrc = transition.imageKey ? `/assets/${transition.imageKey}` : undefined;

  const handleFinish = useCallback(() => {
    updateProgress({ currentPage: 'done' });
    router.push('/done');
  }, [router]);

  useEffect(() => {
    updateProgress({ currentPage: 'outro' });
  }, []);

  useEffect(() => {
    router.prefetch('/done');
  }, [router]);

  // Handle Enter key to finish
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish]);

  const handleDownloadPDF = () => {
    // PDF generation will be implemented in a future phase
    alert('PDF download coming soon!');
  };

  const handleChatGPT = () => {
    const data = getEventData();
    const message = `Hey ChatGPT — I'm planning a ChatGPT Lab on my campus. Here are the details:

Campus: ${data.campus || '[Not set]'}
Community: ${data.conceptual.hostGroup || '[Not set]'}
Theme: ${data.conceptual.theme || '[Not set]'}
Date & Time: ${data.logistics.eventDateTime || '[Not set]'}
Venue: ${data.logistics.venue || '[Not set]'}
My Use Case: ${data.conceptual.yourUseCase || '[Not set]'}
Guiding Question: ${data.conceptual.guidingQuestion || '[Not set]'}
Promotion Plan: ${data.logistics.promotionPlan || '[Not set]'}
Day-of Supplies: ${data.logistics.supplies || '[Not set]'}
Day-of Helpers: ${data.logistics.helpers || '[Not set]'}
Post-Event Sharing Plan: ${data.conceptual.sharingPlan || '[Not set]'}

1) Confirm you understand the plan.
2) Summarize the plan in a few sentences.
3) Be ready to help me refine anything: presenters, promo, run-of-show, discussion question, follow-up recap.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://chat.openai.com/?q=${encodedMessage}`, '_blank');
  };

  return (
    <main className="min-h-screen flex flex-col p-8">
      <div className="flex-1 flex items-center justify-center">
        <BeakerLayout
          title={transition.title}
          dialogue={transition.dialogue}
          imageSrc={beakerImageSrc}
          actions={
            <div className="flex gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 flex items-center justify-center gap-3 px-5 py-5 bg-lab-gray-100 hover:bg-lab-gray-200 text-lab-black font-semibold rounded-button transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {transition.pdfButtonText}
              </button>
              <button
                onClick={handleChatGPT}
                className="flex-1 flex items-center justify-center gap-3 px-5 py-5 bg-lab-gray-100 hover:bg-lab-gray-200 text-lab-black font-semibold rounded-button transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {transition.chatButtonText}
              </button>
            </div>
          }
        />
      </div>

      <div className="flex flex-col items-center gap-3 pb-4">
        <button
          onClick={handleFinish}
          className="px-10 py-4 bg-lab-black text-lab-white text-lg font-medium rounded-button hover:bg-lab-gray-800 active:scale-[0.98] transition-all"
        >
          {transition.ctaText}
        </button>
      </div>
    </main>
  );
}
