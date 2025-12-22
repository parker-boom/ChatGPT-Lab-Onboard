'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import logisticsContent from '@/content/logistics.json';
import { ChecklistItem } from '@/components/ChecklistItem';
import { ChecklistModal } from '@/components/ChecklistModal';
import { ChecklistItem as ChecklistItemType, ChecklistProgress } from '@/lib/types';
import { 
  getProgress, 
  updateProgress, 
  getEventData, 
  updateLogisticsData,
  updateChecklistItem,
  isChecklistComplete 
} from '@/lib/storage';
import { LogisticsData } from '@/lib/types';

// Map item numbers to checklist keys
const itemKeyMap: Record<number, keyof ChecklistProgress> = {
  1: 'item1',
  2: 'item2',
  3: 'item3',
  4: 'item4',
  5: 'item5',
};

// Map input IDs to eventData field names (same as LogisticsData keys)
const inputToFieldMap: Record<string, keyof LogisticsData> = {
  eventDateTime: 'eventDateTime',
  venue: 'venue',
  presenterList: 'presenterList',
  promotionPlan: 'promotionPlan',
  supplies: 'supplies',
  helpers: 'helpers',
};

export default function LogisticsPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistProgress | null>(null);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [eventData, setEventDataState] = useState<LogisticsData | null>(null);

  const items = logisticsContent.items as ChecklistItemType[];

  // Load state on mount
  useEffect(() => {
    const progress = getProgress();
    const data = getEventData();
    
    setChecklist(progress.logisticsChecklist);
    setEventDataState(data.logistics);
    updateProgress({ currentPage: 'logistics' });
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
    const updates: Partial<LogisticsData> = {};
    Object.entries(values).forEach(([inputId, value]) => {
      const fieldName = inputToFieldMap[inputId];
      if (fieldName) {
        updates[fieldName] = value;
      }
    });
    
    const newEventData = { ...eventData, ...updates };
    setEventDataState(newEventData);
    updateLogisticsData(updates);

    // Mark item as saved
    const itemKey = itemKeyMap[itemNumber];
    const newProgress = updateChecklistItem('logistics', itemKey, 'saved');
    setChecklist(newProgress.logisticsChecklist);
    
    setOpenModalIndex(null);
  };

  const handleSkip = (itemNumber: number) => {
    // Mark item as skipped
    const itemKey = itemKeyMap[itemNumber];
    const newProgress = updateChecklistItem('logistics', itemKey, 'skipped');
    setChecklist(newProgress.logisticsChecklist);
    
    setOpenModalIndex(null);
  };

  const handleMoveOn = () => {
    updateProgress({ currentPage: 'logistics-complete' });
    router.push('/logistics-complete');
  };

  const allComplete = isChecklistComplete('logistics');

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
        <h1 className="text-2xl font-bold mb-2">{logisticsContent.pageTitle}</h1>
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
