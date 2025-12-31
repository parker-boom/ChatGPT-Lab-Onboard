'use client';

import { usePreloadImages } from '@/hooks/usePreloadImages';

export function PreloadAssets() {
  usePreloadImages();
  return null;
}
