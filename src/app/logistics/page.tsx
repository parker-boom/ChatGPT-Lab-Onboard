'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import logisticsContent from '@/content/logistics.json';
import { ChecklistItem } from '@/components/ChecklistItem';
import { ChecklistModal } from '@/components/ChecklistModal';
import { ChecklistItem as ChecklistItemType, ChecklistProgress, LogisticsData } from '@/lib/types';
import { 
  getProgress, 
  updateProgress, 
  getEventData, 
  updateLogisticsData,
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

    const itemKey = itemKeyMap[itemNumber];
    const newProgress = updateChecklistItem('logistics', itemKey, 'saved');
    setChecklist(newProgress.logisticsChecklist);
    
    setOpenModalIndex(null);
  };

  const handleSkip = (itemNumber: number) => {
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
        <div className="text-center mb-12">
          <h1 className="text-[2.75rem] font-black italic text-lab-black tracking-tight drop-shadow-sm">
            {logisticsContent.title}
          </h1>
        </div>

        {/* Checklist */}
        <div className="space-y-4 mb-12">
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
            Review your plan
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
