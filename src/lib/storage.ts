import { 
  Progress, 
  EventData, 
  DEFAULT_PROGRESS, 
  DEFAULT_EVENT_DATA,
  ChecklistItemStatus 
} from './types';

const PROGRESS_KEY = 'chatgpt-lab-progress';
const EVENT_DATA_KEY = 'chatgpt-lab-event-data';

// ============================================
// Progress Storage
// ============================================

export function getProgress(): Progress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (!stored) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function setProgress(progress: Progress): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    console.error('Failed to save progress to localStorage');
  }
}

export function updateProgress(updates: Partial<Progress>): Progress {
  const current = getProgress();
  const updated = { ...current, ...updates };
  setProgress(updated);
  return updated;
}

// ============================================
// Event Data Storage
// ============================================

export function getEventData(): EventData {
  if (typeof window === 'undefined') return DEFAULT_EVENT_DATA;
  
  try {
    const stored = localStorage.getItem(EVENT_DATA_KEY);
    if (!stored) return DEFAULT_EVENT_DATA;
    const parsed = JSON.parse(stored);
    return {
      conceptual: { ...DEFAULT_EVENT_DATA.conceptual, ...parsed.conceptual },
      logistics: { ...DEFAULT_EVENT_DATA.logistics, ...parsed.logistics },
    };
  } catch {
    return DEFAULT_EVENT_DATA;
  }
}

export function setEventData(data: EventData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(EVENT_DATA_KEY, JSON.stringify(data));
  } catch {
    console.error('Failed to save event data to localStorage');
  }
}

export function updateConceptualData(updates: Partial<EventData['conceptual']>): EventData {
  const current = getEventData();
  const updated: EventData = {
    ...current,
    conceptual: { ...current.conceptual, ...updates },
  };
  setEventData(updated);
  return updated;
}

export function updateLogisticsData(updates: Partial<EventData['logistics']>): EventData {
  const current = getEventData();
  const updated: EventData = {
    ...current,
    logistics: { ...current.logistics, ...updates },
  };
  setEventData(updated);
  return updated;
}

// ============================================
// Checklist Helpers
// ============================================

export function updateChecklistItem(
  stage: 'conceptual' | 'logistics',
  itemKey: 'item1' | 'item2' | 'item3' | 'item4' | 'item5',
  status: ChecklistItemStatus
): Progress {
  const current = getProgress();
  const checklistKey = stage === 'conceptual' ? 'conceptualChecklist' : 'logisticsChecklist';
  const updated: Progress = {
    ...current,
    [checklistKey]: {
      ...current[checklistKey],
      [itemKey]: status,
    },
  };
  setProgress(updated);
  return updated;
}

export function isChecklistComplete(stage: 'conceptual' | 'logistics'): boolean {
  const progress = getProgress();
  const checklist = stage === 'conceptual' 
    ? progress.conceptualChecklist 
    : progress.logisticsChecklist;
  
  return Object.values(checklist).every(
    (status) => status === 'saved' || status === 'skipped'
  );
}

// ============================================
// Navigation Helpers
// ============================================

export function getRouteForPage(page: Progress['currentPage']): string {
  const routes: Record<Progress['currentPage'], string> = {
    'intro': '/intro',
    'conceptual': '/conceptual',
    'conceptual-complete': '/conceptual-complete',
    'logistics': '/logistics',
    'logistics-complete': '/logistics-complete',
    'summary': '/summary',
    'outro': '/outro',
    'done': '/done',
  };
  return routes[page];
}
