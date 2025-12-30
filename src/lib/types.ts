// ============================================
// Progress State - tracks where the user is
// ============================================

export type PageId = 
  | 'intro'
  | 'conceptual'
  | 'conceptual-complete'
  | 'logistics'
  | 'logistics-complete'
  | 'summary'
  | 'outro'
  | 'done';

export type ChecklistItemStatus = 'pending' | 'saved' | 'skipped';

export interface ChecklistProgress {
  item1: ChecklistItemStatus;
  item2: ChecklistItemStatus;
  item3: ChecklistItemStatus;
  item4: ChecklistItemStatus;
  item5: ChecklistItemStatus;
}

export interface Progress {
  currentPage: PageId;
  introSlideIndex: number;
  conceptualChecklist: ChecklistProgress;
  logisticsChecklist: ChecklistProgress;
}

export const DEFAULT_PROGRESS: Progress = {
  currentPage: 'intro',
  introSlideIndex: 0,
  conceptualChecklist: {
    item1: 'pending',
    item2: 'pending',
    item3: 'pending',
    item4: 'pending',
    item5: 'pending',
  },
  logisticsChecklist: {
    item1: 'pending',
    item2: 'pending',
    item3: 'pending',
    item4: 'pending',
    item5: 'pending',
  },
};

// ============================================
// Event Data - all user-entered content
// ============================================

export interface ConceptualData {
  // Item 1: Host with an existing community
  hostGroup: string;
  // Item 2: Select a theme
  theme: string;
  // Item 3: Plan 5 show and tells
  yourUseCase: string;
  // Item 4: Explore a guiding question
  guidingQuestion: string;
  // Item 5: Choose how you will share
  sharingPlan: string;
}

export interface LogisticsData {
  // Item 1: Decide when and where to host
  eventDateTime: string;
  venue: string;
  // Item 2: Secure your fellow presenters
  presenterList: string;
  // Item 3: Create a slideshow (no input, just completion)
  // Item 4: Invite people & promote
  promotionPlan: string;
  // Item 5: Plan the day-of logistics
  supplies: string;
  helpers: string;
}

export interface EventData {
  // Top-level info collected during intro
  campus: string;
  // Stage-specific data
  conceptual: ConceptualData;
  logistics: LogisticsData;
}

export const DEFAULT_EVENT_DATA: EventData = {
  campus: '',
  conceptual: {
    hostGroup: '',
    theme: '',
    yourUseCase: '',
    guidingQuestion: '',
    sharingPlan: '',
  },
  logistics: {
    eventDateTime: '',
    venue: '',
    presenterList: '',
    promotionPlan: '',
    supplies: '',
    helpers: '',
  },
};

// ============================================
// Content Types - for JSON content files
// ============================================

export interface IntroSlideInput {
  id: string;
  label: string;
  placeholder?: string;
}

export interface IntroSlide {
  title: string;
  dialogue: string[];
  ctaText?: string;
  input?: IntroSlideInput;
}

export interface ChecklistItemInput {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'datetime';
}

export interface ChecklistItem {
  number: number;
  title: string;
  description: string[];
  brainstormQuestion?: string;
  inputs: ChecklistItemInput[];
  templateButton?: {
    label: string;
    comingSoon: boolean;
  };
}

export interface BeakerTransition {
  title: string;
  dialogue: string[];
  ctaText: string;
}
