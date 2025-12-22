// React hook for reading/writing event state
// Will be fully implemented in Phase 2 when we wire up the forms

import { useState, useEffect, useCallback } from 'react';
import { 
  EventData, 
  Progress,
  DEFAULT_EVENT_DATA,
  DEFAULT_PROGRESS,
} from '@/lib/types';
import {
  getEventData,
  setEventData,
  getProgress,
  setProgress,
} from '@/lib/storage';

/**
 * Hook for accessing and updating event data from localStorage.
 * Handles SSR by initializing with defaults and syncing on mount.
 */
export function useEventData() {
  const [eventData, setEventDataState] = useState<EventData>(DEFAULT_EVENT_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setEventDataState(getEventData());
    setIsLoaded(true);
  }, []);

  const updateEventData = useCallback((data: EventData) => {
    setEventDataState(data);
    setEventData(data);
  }, []);

  return { eventData, updateEventData, isLoaded };
}

/**
 * Hook for accessing and updating progress from localStorage.
 * Handles SSR by initializing with defaults and syncing on mount.
 */
export function useProgress() {
  const [progress, setProgressState] = useState<Progress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProgressState(getProgress());
    setIsLoaded(true);
  }, []);

  const updateProgress = useCallback((data: Progress) => {
    setProgressState(data);
    setProgress(data);
  }, []);

  return { progress, updateProgress, isLoaded };
}
