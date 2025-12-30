import { 
  Progress, 
  EventData, 
  DEFAULT_PROGRESS, 
  DEFAULT_EVENT_DATA,
  ChecklistItemStatus 
} from './types';

const PROGRESS_KEY = 'chatgpt-lab-progress';
const EVENT_DATA_KEY = 'chatgpt-lab-event-data';

type PageId = Progress['currentPage'];

const PAGE_ORDER: PageId[] = [
  'intro',
  'conceptual',
  'conceptual-complete',
  'logistics',
  'logistics-complete',
  'summary',
  'outro',
  'done',
];

function getPageIndex(page: PageId): number {
  return PAGE_ORDER.indexOf(page);
}

function resolvePageId(value: unknown, fallback: PageId): PageId {
  if (typeof value !== 'string') return fallback;
  return PAGE_ORDER.includes(value as PageId) ? (value as PageId) : fallback;
}

export function isPageAfter(current: PageId, target: PageId): boolean {
  return getPageIndex(current) > getPageIndex(target);
}

function resolveFurthestPage(currentPage: PageId, furthestPage?: PageId): PageId {
  if (!furthestPage) return currentPage;
  return isPageAfter(furthestPage, currentPage) ? furthestPage : currentPage;
}

function mergeChecklistProgress(
  defaults: Progress['conceptualChecklist'],
  stored: Partial<Progress['conceptualChecklist']> | undefined,
  hasStoredProgress: boolean
): Progress['conceptualChecklist'] {
  const merged = { ...defaults };
  (Object.keys(defaults) as (keyof Progress['conceptualChecklist'])[]).forEach((key) => {
    const storedValue = stored?.[key];
    if (storedValue === 'pending' || storedValue === 'saved' || storedValue === 'skipped') {
      merged[key] = storedValue;
      return;
    }
    if (hasStoredProgress) {
      // New checklist items for returning users are assumed complete.
      merged[key] = 'skipped';
    }
  });
  return merged;
}

// ============================================
// Progress Storage
// ============================================

export function getProgress(): Progress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (!stored) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(stored) as Partial<Progress>;
    const resolvedCurrentPage = resolvePageId(parsed.currentPage, DEFAULT_PROGRESS.currentPage);
    const resolvedFurthestPage = resolveFurthestPage(
      resolvedCurrentPage,
      resolvePageId(parsed.furthestPage, resolvedCurrentPage)
    );
    const resolvedIntroSlideIndex =
      typeof parsed.introSlideIndex === 'number'
        ? parsed.introSlideIndex
        : DEFAULT_PROGRESS.introSlideIndex;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      currentPage: resolvedCurrentPage,
      furthestPage: resolvedFurthestPage,
      introSlideIndex: resolvedIntroSlideIndex,
      conceptualChecklist: mergeChecklistProgress(
        DEFAULT_PROGRESS.conceptualChecklist,
        parsed.conceptualChecklist,
        true
      ),
      logisticsChecklist: mergeChecklistProgress(
        DEFAULT_PROGRESS.logisticsChecklist,
        parsed.logisticsChecklist,
        true
      ),
    };
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
  const nextCurrentPage = updates.currentPage ?? current.currentPage;
  const nextFurthestCandidate = updates.furthestPage ?? current.furthestPage;
  const updated = {
    ...current,
    ...updates,
    currentPage: nextCurrentPage,
    furthestPage: resolveFurthestPage(nextCurrentPage, nextFurthestCandidate),
  };
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
      campus: parsed.campus || DEFAULT_EVENT_DATA.campus,
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
