'use client';

import { useEffect } from 'react';
import introContent from '@/content/intro.json';
import transitionsContent from '@/content/transitions.json';

/**
 * List of Beaker images to preload.
 * Add new image paths here as they're created.
 */
const introImages = (introContent.slides || [])
  .map((slide: { imageKey?: string }) => slide.imageKey)
  .filter(Boolean)
  .map((key) => `/assets/${key}`);

const transitionImages = Object.values(transitionsContent.transitions || {})
  .map((transition: { imageKey?: string }) => transition.imageKey)
  .filter(Boolean)
  .map((key) => `/assets/${key}`);

const BEAKER_IMAGES = Array.from(
  new Set(['/assets/SmileyFace.png', ...introImages, ...transitionImages])
);

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

