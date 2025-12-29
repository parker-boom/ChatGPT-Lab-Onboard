'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import conceptualContent from '@/content/conceptual.json';
import { ChecklistItem } from '@/components/ChecklistItem';
import { ChecklistModal } from '@/components/ChecklistModal';
import { ChecklistItem as ChecklistItemType, ChecklistProgress, ConceptualData } from '@/lib/types';
import { 
  getProgress, 
  updateProgress, 
  getEventData, 
  updateConceptualData,
  updateChecklistItem,
  isChecklistComplete 
} from '@/lib/storage';

const itemKeyMap: Record<number, keyof ChecklistProgress> = {
  1: 'item1',
  2: 'item2',
  3: 'item3',
  4: 'item4',
  5: 'item5',
};

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

    const itemKey = itemKeyMap[itemNumber];
    const newProgress = updateChecklistItem('conceptual', itemKey, 'saved');
    setChecklist(newProgress.conceptualChecklist);
    
    setOpenModalIndex(null);
  };

  const handleSkip = (itemNumber: number) => {
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
  const completedCount = checklist 
    ? Object.values(checklist).filter(s => s === 'saved' || s === 'skipped').length 
    : 0;

  if (!isLoaded || !checklist || !eventData) {
    return null;
  }

  const openItem = openModalIndex !== null ? items[openModalIndex] : null;

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
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-content">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-lab-white/80 backdrop-blur-sm rounded-full shadow-card mb-4">
            <span className="text-caption font-medium text-lab-gray-500">Stage 1 of 2</span>
            <span className="text-lab-gray-300">•</span>
            <span className="text-caption font-medium text-lab-black">{completedCount}/5 complete</span>
          </div>
          <h1 className="text-display text-lab-black mb-3">Conceptual Planning</h1>
          <p className="text-body text-lab-gray-500 max-w-md mx-auto">
            What kind of Lab event are you running? Complete each step below.
          </p>
        </div>

        {/* Checklist */}
        <div className="space-y-3 mb-10">
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
        <div className="flex justify-center">
          <button
            onClick={handleMoveOn}
            disabled={!allComplete}
            className="btn-primary px-8"
          >
            Continue to logistics →
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
