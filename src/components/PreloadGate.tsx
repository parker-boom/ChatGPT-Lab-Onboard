'use client';

import { ReactNode } from 'react';
import { usePreloadImages } from '@/hooks/usePreloadImages';

interface PreloadGateProps {
  children: ReactNode;
}

export function PreloadGate({ children }: PreloadGateProps) {
  const isReady = usePreloadImages();

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-body text-lab-gray-600">Loading assets...</div>
      </div>
    );
  }

  return <>{children}</>;
}
