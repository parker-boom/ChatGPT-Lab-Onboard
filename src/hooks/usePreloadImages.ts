'use client';

import { useEffect, useState } from 'react';
import { BEAKER_IMAGE_URLS } from '@/lib/preloadAssets';

/**
 * Preloads Beaker images on mount to prevent loading flashes
 * when navigating between pages.
 */
export function usePreloadImages(): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;
    const total = BEAKER_IMAGE_URLS.length;

    if (total === 0) {
      setIsReady(true);
      return;
    }

    const handleDone = () => {
      loadedCount += 1;
      if (!isCancelled && loadedCount >= total) {
        setIsReady(true);
      }
    };

    BEAKER_IMAGE_URLS.forEach((src) => {
      const img = new Image();
      img.onload = handleDone;
      img.onerror = handleDone;
      img.src = src;
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  return isReady;
}

