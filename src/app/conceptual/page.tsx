'use client';

import conceptualContent from '@/content/conceptual.json';
import { ChecklistPage } from '@/components/ChecklistPage';
import { ChecklistItem } from '@/lib/types';

// Maps input IDs from the JSON to field names in ConceptualData
const INPUT_TO_FIELD_MAP: Record<string, string> = {
  hostGroup: 'hostGroup',
  theme: 'theme',
  yourUseCase: 'yourUseCase',
  guidingQuestion: 'guidingQuestion',
  sharingPlan: 'sharingPlan',
};

export default function ConceptualPage() {
  return (
    <ChecklistPage
      stage="conceptual"
      title={conceptualContent.title}
      items={conceptualContent.items as ChecklistItem[]}
      inputToFieldMap={INPUT_TO_FIELD_MAP}
      continueButtonText="Continue to logistics"
      nextRoute="/conceptual-complete"
      nextPage="conceptual-complete"
    />
  );
}
