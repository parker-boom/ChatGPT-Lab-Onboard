'use client';

import logisticsContent from '@/content/logistics.json';
import { ChecklistPage } from '@/components/ChecklistPage';
import { ChecklistItem } from '@/lib/types';

// Maps input IDs from the JSON to field names in LogisticsData
const INPUT_TO_FIELD_MAP: Record<string, string> = {
  eventDateTime: 'eventDateTime',
  venue: 'venue',
  presenterList: 'presenterList',
  promotionPlan: 'promotionPlan',
  supplies: 'supplies',
  helpers: 'helpers',
};

export default function LogisticsPage() {
  return (
    <ChecklistPage
      stage="logistics"
      title={logisticsContent.title}
      items={logisticsContent.items as ChecklistItem[]}
      inputToFieldMap={INPUT_TO_FIELD_MAP}
      continueButtonText="Review your plan"
      nextRoute="/logistics-complete"
      nextPage="logistics-complete"
    />
  );
}
