'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import introContent from '@/content/intro.json';
import { getProgress, updateProgress, getEventData, setEventData, isPageAfter } from '@/lib/storage';
import { BeakerLayout } from '@/components/BeakerLayout';
import { usePreloadImages } from '@/hooks/usePreloadImages';
import { IntroSlide } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';

type IntroRootField = 'campus';

const INTRO_INPUT_FIELD_MAP: Record<string, IntroRootField> = {
  campus: 'campus',
};

export default function IntroPage() {
  const router = useRouter();
  const [slideIndex, setSlideIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [introValues, setIntroValues] = useState<Record<string, string>>({});
  const isFirstSlideRender = useRef(true);

  const slides = introContent.slides as IntroSlide[];
  const currentSlide = slides[slideIndex];
  const isLastSlide = slideIndex === slides.length - 1;
  const beakerImageSrc = currentSlide.imageKey ? `/assets/${currentSlide.imageKey}` : undefined;

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

  useEffect(() => {
    isFirstSlideRender.current = false;
  }, []);

  useEffect(() => {
    router.prefetch('/conceptual');
  }, [router]);

  // Load saved slide index and intro input values on mount
  useEffect(() => {
    const progress = getProgress();
    const eventData = getEventData();
    const lastIndex = Math.max(slides.length - 1, 0);
    const hasPassedIntro = isPageAfter(progress.furthestPage, 'intro');
    const resolvedSlideIndex = hasPassedIntro
      ? lastIndex
      : Math.min(progress.introSlideIndex, lastIndex);
    setSlideIndex(resolvedSlideIndex);
    const initialValues: Record<string, string> = {};
    Object.entries(INTRO_INPUT_FIELD_MAP).forEach(([inputId, fieldKey]) => {
      initialValues[inputId] = eventData[fieldKey] || '';
    });
    setIntroValues(initialValues);
    setIsLoaded(true);
  }, [slides.length]);

  // Save slide index when it changes
  useEffect(() => {
    if (isLoaded) {
      updateProgress({ introSlideIndex: slideIndex, currentPage: 'intro' });
    }
  }, [slideIndex, isLoaded]);

  // Save intro values when they change
  const handleIntroChange = (id: string, value: string) => {
    setIntroValues((prev) => ({ ...prev, [id]: value }));
    const fieldKey = INTRO_INPUT_FIELD_MAP[id];
    if (!fieldKey) return;
    const eventData = getEventData();
    setEventData({ ...eventData, [fieldKey]: value });
  };

  const handleBack = () => {
    if (slideIndex > 0) {
      setSlideIndex((prev) => prev - 1);
    }
  };

  if (!isLoaded) {
    return null;
  }

  const slideInputs = currentSlide.inputs ?? (currentSlide.input ? [currentSlide.input] : []);

  // Render input field(s) if this slide has them
  const inputContent = slideInputs.length > 0 ? (
    <div className="mt-6 space-y-4">
      {slideInputs.map((input) => (
        <div key={input.id}>
          <label className="block text-[0.85rem] font-semibold text-lab-gray-500 uppercase tracking-wide mb-2">
            {input.label}
          </label>
          <input
            type={input.type || 'text'}
            value={introValues[input.id] || ''}
            onChange={(e) => handleIntroChange(input.id, e.target.value)}
            placeholder={input.placeholder || ''}
            className="w-full px-4 py-3 bg-lab-gray-50 border-2 border-lab-gray-200 rounded-button text-[1rem] placeholder:text-lab-gray-400 focus:outline-none focus:border-lab-yellow-400 focus:bg-lab-white transition-colors"
          />
        </div>
      ))}
    </div>
  ) : null;

  return (
    <main className="min-h-screen flex flex-col p-8">
      {/* Main content - centered */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slideIndex}
            initial={isFirstSlideRender.current ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <BeakerLayout
              title={currentSlide.title}
              dialogue={currentSlide.dialogue}
              footer={inputContent}
              imageSrc={beakerImageSrc}
            />
          </motion.div>
        </AnimatePresence>
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
