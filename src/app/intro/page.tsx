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
            {/* Title */}
            <h1 className="text-heading text-lab-black mb-6 text-balance">
              {currentSlide.title}
            </h1>
            
            {/* Dialogue */}
            <div className="space-y-4">
              {currentSlide.dialogue.map((line, i) => (
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

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-lab-gray-100">
              <button
                onClick={handleBack}
                disabled={slideIndex === 0}
                className="btn-secondary disabled:opacity-0"
              >
                ← Back
              </button>

              {/* Progress dots */}
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === slideIndex 
                        ? 'bg-lab-black' 
                        : i < slideIndex 
                          ? 'bg-lab-gray-400'
                          : 'bg-lab-gray-200'
                    }`}
                  />
                ))}
              </div>

              <button onClick={handleNext} className="btn-primary">
                {isLastSlide ? (currentSlide.ctaText || 'Continue') : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
