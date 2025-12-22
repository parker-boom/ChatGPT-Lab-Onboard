'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
      // Move to conceptual planning
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
            <h1 className="text-2xl font-bold mb-4">{currentSlide.title}</h1>
            
            <div className="space-y-3">
              {currentSlide.dialogue.map((line, i) => (
                <p key={i} className="text-gray-700" dangerouslySetInnerHTML={{ 
                  __html: line
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/_(.*?)_/g, '<em>$1</em>')
                }} />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <button
                onClick={handleBack}
                disabled={slideIndex === 0}
                className="px-4 py-2 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Back
              </button>

              <span className="text-sm text-gray-400">
                {slideIndex + 1} / {slides.length}
              </span>

              <button
                onClick={handleNext}
                className="px-6 py-2 bg-black text-white rounded"
              >
                {isLastSlide ? (currentSlide.ctaText || 'Continue') : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
