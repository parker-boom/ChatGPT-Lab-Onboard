'use client';

import { useEffect } from 'react';

/**
 * List of Beaker images to preload.
 * Add new image paths here as they're created.
 */
const BEAKER_IMAGES = [
  '/assets/SmileyFace.png',
  // Future Beaker images will be added here:
  // '/assets/BeakerIntro.png',
  // '/assets/BeakerCelebrate.png',
  // etc.
];

/**
 * Preloads Beaker images on mount to prevent loading flashes
 * when navigating between pages.
 */
export function usePreloadImages() {
  useEffect(() => {
    BEAKER_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);
}

/**
 * Preloads a specific set of images.
 * Useful for preloading page-specific images.
 */
export function usePreloadCustomImages(imageSrcs: string[]) {
  useEffect(() => {
    imageSrcs.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [imageSrcs]);
}

