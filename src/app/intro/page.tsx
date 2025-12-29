'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import introContent from '@/content/intro.json';
import { getProgress, updateProgress } from '@/lib/storage';

export default function IntroPage() {
  const router = useRouter();
  const [slideIndex, setSlideIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const slides = introContent.slides;
  const currentSlide = slides[slideIndex];
  const isLastSlide = slideIndex === slides.length - 1;

  // Load saved slide index on mount
  useEffect(() => {
    const progress = getProgress();
    if (progress.introSlideIndex < slides.length) {
      setSlideIndex(progress.introSlideIndex);
    }
    setIsLoaded(true);
  }, [slides.length]);

  // Save slide index when it changes
  useEffect(() => {
    if (isLoaded) {
      updateProgress({ introSlideIndex: slideIndex, currentPage: 'intro' });
    }
  }, [slideIndex, isLoaded]);

  const handleNext = () => {
    if (isLastSlide) {
      updateProgress({ currentPage: 'conceptual' });
      router.push('/conceptual');
    } else {
      setSlideIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (slideIndex > 0) {
      setSlideIndex((prev) => prev - 1);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col p-8">
      {/* Main content - centered */}
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
              {currentSlide.title}
            </h1>
            
            <div className="space-y-4">
              {currentSlide.dialogue.map((line, i) => (
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
          </div>
        </div>
      </div>

      {/* Bottom navigation - fixed at bottom */}
      <div className="flex flex-col items-center gap-3 pb-4">
        <button onClick={handleNext} className="px-10 py-4 bg-lab-black text-lab-white text-lg font-medium rounded-button hover:bg-lab-gray-800 active:scale-[0.98] transition-all">
          {isLastSlide ? (currentSlide.ctaText || 'Continue') : 'Next'}
        </button>
        <button
          onClick={handleBack}
          disabled={slideIndex === 0}
          className={`text-body text-lab-gray-600 underline hover:text-lab-black transition-colors ${
            slideIndex === 0 ? 'invisible' : ''
          }`}
        >
          Back
        </button>
      </div>
    </main>
  );
}
