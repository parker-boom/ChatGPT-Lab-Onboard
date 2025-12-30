'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import introContent from '@/content/intro.json';
import { getProgress, updateProgress, getEventData, setEventData } from '@/lib/storage';
import { BeakerLayout } from '@/components/BeakerLayout';
import { usePreloadImages } from '@/hooks/usePreloadImages';
import { IntroSlide } from '@/lib/types';

export default function IntroPage() {
  const router = useRouter();
  const [slideIndex, setSlideIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [campusValue, setCampusValue] = useState('');

  const slides = introContent.slides as IntroSlide[];
  const currentSlide = slides[slideIndex];
  const isLastSlide = slideIndex === slides.length - 1;

  // Preload all Beaker images on first page load
  usePreloadImages();

  // Handle Enter key to progress
  const handleNext = useCallback(() => {
    if (isLastSlide) {
      updateProgress({ currentPage: 'conceptual' });
      router.push('/conceptual');
    } else {
      setSlideIndex((prev) => prev + 1);
    }
  }, [isLastSlide, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext]);

  // Load saved slide index and campus value on mount
  useEffect(() => {
    const progress = getProgress();
    const eventData = getEventData();
    
    if (progress.introSlideIndex < slides.length) {
      setSlideIndex(progress.introSlideIndex);
    }
    setCampusValue(eventData.campus || '');
    setIsLoaded(true);
  }, [slides.length]);

  // Save slide index when it changes
  useEffect(() => {
    if (isLoaded) {
      updateProgress({ introSlideIndex: slideIndex, currentPage: 'intro' });
    }
  }, [slideIndex, isLoaded]);

  // Save campus value when it changes
  const handleCampusChange = (value: string) => {
    setCampusValue(value);
    const eventData = getEventData();
    setEventData({ ...eventData, campus: value });
  };

  const handleBack = () => {
    if (slideIndex > 0) {
      setSlideIndex((prev) => prev - 1);
    }
  };

  if (!isLoaded) {
    return null;
  }

  // Render input field if this slide has one
  const inputContent = currentSlide.input ? (
    <div className="mt-6">
      <label className="block text-[0.85rem] font-semibold text-lab-gray-500 uppercase tracking-wide mb-2">
        {currentSlide.input.label}
      </label>
      <input
        type="text"
        value={campusValue}
        onChange={(e) => handleCampusChange(e.target.value)}
        placeholder={currentSlide.input.placeholder || ''}
        className="w-full px-4 py-3 bg-lab-gray-50 border-2 border-lab-gray-200 rounded-button text-[1rem] placeholder:text-lab-gray-400 focus:outline-none focus:border-lab-yellow-400 focus:bg-lab-white transition-colors"
      />
    </div>
  ) : null;

  return (
    <main className="min-h-screen flex flex-col p-8">
      {/* Main content - centered */}
      <div className="flex-1 flex items-center justify-center">
        <BeakerLayout
          title={currentSlide.title}
          dialogue={currentSlide.dialogue}
          footer={inputContent}
        />
      </div>

      {/* Bottom navigation - fixed at bottom */}
      <div className="flex flex-col items-center gap-3 pb-4">
        <button
          onClick={handleNext}
          className="px-10 py-4 bg-lab-black text-lab-white text-lg font-medium rounded-button hover:bg-lab-gray-800 active:scale-[0.98] transition-all"
        >
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
