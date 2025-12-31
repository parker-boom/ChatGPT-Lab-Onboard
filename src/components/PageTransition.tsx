'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Simple fade-in transition for page content.
 * Each route change triggers a quick fade-in animation.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [key, setKey] = useState(pathname);

  // Reset mount state when path changes to trigger new fade-in
  useEffect(() => {
    if (pathname !== key) {
      setMounted(false);
      setKey(pathname);
    }
  }, [pathname, key]);

  // Trigger fade-in after a brief delay (allows content to render)
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(timer);
  }, [key]);

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(4px)',
        transition: 'opacity 150ms ease-out, transform 150ms ease-out',
      }}
    >
      {children}
    </div>
  );
}
