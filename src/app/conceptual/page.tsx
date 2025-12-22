'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import conceptualContent from '@/content/conceptual.json';
import { ChecklistItem } from '@/components/ChecklistItem';
import { ChecklistModal } from '@/components/ChecklistModal';
import { ChecklistItem as ChecklistItemType, ChecklistProgress } from '@/lib/types';
import { 
  getProgress, 
  updateProgress, 
  getEventData, 
  updateConceptualData,
  updateChecklistItem,
  isChecklistComplete 
} from '@/lib/storage';
import { ConceptualData } from '@/lib/types';

// Map item numbers to checklist keys
const itemKeyMap: Record<number, keyof ChecklistProgress> = {
  1: 'item1',
  2: 'item2',
  3: 'item3',
  4: 'item4',
  5: 'item5',
};

// Map input IDs to eventData field names (same as ConceptualData keys)
const inputToFieldMap: Record<string, keyof ConceptualData> = {
  hostGroup: 'hostGroup',
  theme: 'theme',
  yourUseCase: 'yourUseCase',
  potentialPresenters: 'potentialPresenters',
  guidingQuestion: 'guidingQuestion',
  sharingPlan: 'sharingPlan',
};

export default function ConceptualPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistProgress | null>(null);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [eventData, setEventDataState] = useState<ConceptualData | null>(null);

  const items = conceptualContent.items as ChecklistItemType[];

  // Load state on mount
  useEffect(() => {
    const progress = getProgress();
    const data = getEventData();
    
    setChecklist(progress.conceptualChecklist);
    setEventDataState(data.conceptual);
    updateProgress({ currentPage: 'conceptual' });
    setIsLoaded(true);
  }, []);

  const handleItemClick = (index: number) => {
    setOpenModalIndex(index);
  };

  const handleModalClose = () => {
    setOpenModalIndex(null);
  };

  const handleSave = (itemNumber: number, values: Record<string, string>) => {
    if (!eventData) return;
    
    // Save to event data
    const updates: Partial<ConceptualData> = {};
    Object.entries(values).forEach(([inputId, value]) => {
      const fieldName = inputToFieldMap[inputId];
      if (fieldName) {
        updates[fieldName] = value;
      }
    });
    
    const newEventData = { ...eventData, ...updates };
    setEventDataState(newEventData);
    updateConceptualData(updates);

    // Mark item as saved
    const itemKey = itemKeyMap[itemNumber];
    const newProgress = updateChecklistItem('conceptual', itemKey, 'saved');
    setChecklist(newProgress.conceptualChecklist);
    
    setOpenModalIndex(null);
  };

  const handleSkip = (itemNumber: number) => {
    // Mark item as skipped
    const itemKey = itemKeyMap[itemNumber];
    const newProgress = updateChecklistItem('conceptual', itemKey, 'skipped');
    setChecklist(newProgress.conceptualChecklist);
    
    setOpenModalIndex(null);
  };

  const handleMoveOn = () => {
    updateProgress({ currentPage: 'conceptual-complete' });
    router.push('/conceptual-complete');
  };

  const allComplete = isChecklistComplete('conceptual');

  if (!isLoaded || !checklist || !eventData) {
    return null;
  }

  const openItem = openModalIndex !== null ? items[openModalIndex] : null;

  // Get current values for the open modal
  const getModalValues = (): Record<string, string> => {
    if (!openItem) return {};
    const values: Record<string, string> = {};
    openItem.inputs.forEach((input) => {
      const fieldName = inputToFieldMap[input.id];
      if (fieldName && eventData[fieldName]) {
        values[input.id] = eventData[fieldName];
      }
    });
    return values;
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-2">{conceptualContent.pageTitle}</h1>
        <p className="text-gray-600 mb-8">Complete each item to move on.</p>

        {/* Checklist */}
        <div className="space-y-3 mb-8">
          {items.map((item, index) => (
            <ChecklistItem
              key={item.number}
              number={item.number}
              title={item.title}
              status={checklist[itemKeyMap[item.number]]}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </div>

        {/* Move on button */}
        <div className="flex justify-end">
          <button
            onClick={handleMoveOn}
            disabled={!allComplete}
            className="px-6 py-3 bg-black text-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Move on →
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
