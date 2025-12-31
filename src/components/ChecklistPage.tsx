'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChecklistItem } from './ChecklistItem';
import { ChecklistModal } from './ChecklistModal';
import { ChecklistItem as ChecklistItemType, ChecklistProgress, ConceptualData, LogisticsData } from '@/lib/types';
import {
  getProgress,
  updateProgress,
  getEventData,
  updateConceptualData,
  updateLogisticsData,
  updateChecklistItem,
  isChecklistComplete,
} from '@/lib/storage';

// Shared mapping for item numbers to checklist keys
const ITEM_KEY_MAP: Record<number, keyof ChecklistProgress> = {
  1: 'item1',
  2: 'item2',
  3: 'item3',
  4: 'item4',
  5: 'item5',
};

interface ChecklistPageProps {
  /** Which stage this checklist is for */
  stage: 'conceptual' | 'logistics';
  /** Page title (e.g., "💭 Conceptual Planning") */
  title: string;
  /** Checklist items from the content JSON */
  items: ChecklistItemType[];
  /** Mapping of input IDs to field names in the data model */
  inputToFieldMap: Record<string, string>;
  /** Text for the continue button */
  continueButtonText: string;
  /** Route to navigate to after completion */
  nextRoute: string;
  /** Page ID to save in progress */
  nextPage: 'conceptual-complete' | 'logistics-complete';
}

/**
 * Generic checklist page component used by both conceptual and logistics stages.
 * Handles item state, modal interactions, and navigation.
 */
export function ChecklistPage({
  stage,
  title,
  items,
  inputToFieldMap,
  continueButtonText,
  nextRoute,
  nextPage,
}: ChecklistPageProps) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistProgress | null>(null);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [stageData, setStageData] = useState<ConceptualData | LogisticsData | null>(null);

  // Load initial state from localStorage
  useEffect(() => {
    const progress = getProgress();
    const eventData = getEventData();

    const checklistKey = stage === 'conceptual' ? 'conceptualChecklist' : 'logisticsChecklist';
    setChecklist(progress[checklistKey]);
    setStageData(eventData[stage]);
    updateProgress({ currentPage: stage });
    setIsLoaded(true);
  }, [stage]);

  useEffect(() => {
    router.prefetch(nextRoute);
  }, [nextRoute, router]);

  const handleItemClick = (index: number) => {
    setOpenModalIndex(index);
  };

  const handleModalClose = () => {
    setOpenModalIndex(null);
  };

  const handleSave = (itemNumber: number, values: Record<string, string>) => {
    if (!stageData) return;

    // Map input values to field names and update state
    const updates: Record<string, string> = {};
    Object.entries(values).forEach(([inputId, value]) => {
      const fieldName = inputToFieldMap[inputId];
      if (fieldName) {
        updates[fieldName] = value;
      }
    });

    const newStageData = { ...stageData, ...updates } as ConceptualData | LogisticsData;
    setStageData(newStageData);

    // Persist to localStorage
    if (stage === 'conceptual') {
      updateConceptualData(updates);
    } else {
      updateLogisticsData(updates);
    }

    // Mark item as saved
    const itemKey = ITEM_KEY_MAP[itemNumber];
    const newProgress = updateChecklistItem(stage, itemKey, 'saved');
    const checklistKey = stage === 'conceptual' ? 'conceptualChecklist' : 'logisticsChecklist';
    setChecklist(newProgress[checklistKey]);

    setOpenModalIndex(null);
  };

  const handleSkip = (itemNumber: number) => {
    const itemKey = ITEM_KEY_MAP[itemNumber];
    const newProgress = updateChecklistItem(stage, itemKey, 'skipped');
    const checklistKey = stage === 'conceptual' ? 'conceptualChecklist' : 'logisticsChecklist';
    setChecklist(newProgress[checklistKey]);

    setOpenModalIndex(null);
  };

  const handleMoveOn = useCallback(() => {
    updateProgress({ currentPage: nextPage });
    router.push(nextRoute);
  }, [nextPage, nextRoute, router]);

  const allComplete = isChecklistComplete(stage);
  const nextIncompleteIndex = checklist
    ? items.findIndex((item) => checklist[ITEM_KEY_MAP[item.number]] === 'pending')
    : -1;

  useEffect(() => {
    if (!isLoaded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      if (openModalIndex !== null) return;
      e.preventDefault();
      if (allComplete || nextIncompleteIndex === -1) {
        handleMoveOn();
        return;
      }
      setOpenModalIndex(nextIncompleteIndex);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allComplete, handleMoveOn, isLoaded, nextIncompleteIndex, openModalIndex]);

  if (!isLoaded || !checklist || !stageData) {
    return null;
  }

  const openItem = openModalIndex !== null ? items[openModalIndex] : null;

  // Get current values for the modal form
  const getModalValues = (): Record<string, string> => {
    if (!openItem) return {};
    const values: Record<string, string> = {};
    openItem.inputs.forEach((input) => {
      const fieldName = inputToFieldMap[input.id];
      const dataRecord = stageData as unknown as Record<string, string>;
      if (fieldName && dataRecord[fieldName]) {
        values[input.id] = dataRecord[fieldName];
      }
    });
    return values;
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-content">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[2.75rem] font-black italic text-lab-black tracking-tight drop-shadow-sm">
            {title}
          </h1>
        </div>

        {/* Checklist */}
        <div className="space-y-4 mb-12">
          {items.map((item, index) => (
            <div key={item.number} className="relative">
              {index === nextIncompleteIndex && (
                <div
                  className="absolute -left-10 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ filter: 'drop-shadow(0 6px 14px rgba(0, 0, 0, 0.35))' }}
                >
                  <svg
                    className="w-9 h-9"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h12m0 0-4-4m4 4-4 4"
                      stroke="white"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
              <ChecklistItem
                number={item.number}
                title={item.title}
                status={checklist[ITEM_KEY_MAP[item.number]]}
                onClick={() => handleItemClick(index)}
              />
            </div>
          ))}
        </div>

        {/* Move on button */}
        <div className="flex justify-center">
          <button
            onClick={handleMoveOn}
            disabled={!allComplete}
            className="btn-primary px-8"
          >
            {continueButtonText}
          </button>
        </div>

        {/* Modal */}
        {openItem && (
          <ChecklistModal
            isOpen={openModalIndex !== null}
            onClose={handleModalClose}
            item={openItem}
            initialValues={getModalValues()}
            onSave={(values) => handleSave(openItem.number, values)}
            onSkip={() => handleSkip(openItem.number)}
          />
        )}
      </div>
    </main>
  );
}

