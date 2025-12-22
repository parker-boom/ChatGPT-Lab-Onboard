'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProgress, getRouteForPage } from '@/lib/storage';

/**
 * Boot route - reads localStorage and redirects to the saved page.
 * This page should never render visible content; it immediately redirects.
 */
export default function BootPage() {
  const router = useRouter();

  useEffect(() => {
    const progress = getProgress();
    const route = getRouteForPage(progress.currentPage);
    router.replace(route);
  }, [router]);

  // Show nothing while redirecting
  return null;
}
