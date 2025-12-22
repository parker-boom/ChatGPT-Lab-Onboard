'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EventData } from '@/lib/types';
import { getEventData, setEventData, updateProgress } from '@/lib/storage';

// Field definitions for display
const conceptualFields = [
  { key: 'hostGroup', label: 'Host community' },
  { key: 'theme', label: 'Theme' },
  { key: 'yourUseCase', label: 'Your show & tell use case' },
  { key: 'potentialPresenters', label: 'Other potential presenters', multiline: true },
  { key: 'guidingQuestion', label: 'Guiding question' },
  { key: 'sharingPlan', label: 'Sharing plan', multiline: true },
];

const logisticsFields = [
  { key: 'eventDateTime', label: 'Event date/time', type: 'datetime' },
  { key: 'venue', label: 'Venue/location' },
  { key: 'presenterList', label: 'Presenter list', multiline: true },
  { key: 'promotionPlan', label: 'Promotion plan', multiline: true },
  { key: 'supplies', label: 'Supplies', multiline: true },
  { key: 'helpers', label: 'Helpers', multiline: true },
];

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
}

function EditableField({ label, value, onChange, multiline, type }: EditableFieldProps) {
  const displayValue = value || '[ADD LATER]';
  const isEmpty = !value;

  return (
    <div className="py-3 border-b border-gray-100">
      <label className="block text-sm font-medium text-gray-500 mb-1">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="[ADD LATER]"
          className={`w-full px-2 py-1 border border-transparent hover:border-gray-300 focus:border-gray-400 focus:outline-none rounded resize-none ${
            isEmpty ? 'text-gray-400 italic' : ''
          }`}
          rows={3}
        />
      ) : type === 'datetime' ? (
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-2 py-1 border border-transparent hover:border-gray-300 focus:border-gray-400 focus:outline-none rounded ${
            isEmpty ? 'text-gray-400' : ''
          }`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="[ADD LATER]"
          className={`w-full px-2 py-1 border border-transparent hover:border-gray-300 focus:border-gray-400 focus:outline-none rounded ${
            isEmpty ? 'text-gray-400 italic' : ''
          }`}
        />
      )}
    </div>
  );
}

export default function SummaryPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<EventData | null>(null);

  useEffect(() => {
    const eventData = getEventData();
    setData(eventData);
    updateProgress({ currentPage: 'summary' });
    setIsLoaded(true);
  }, []);

  const handleConceptualChange = (key: string, value: string) => {
    if (!data) return;
    const newData: EventData = {
      ...data,
      conceptual: { ...data.conceptual, [key]: value },
    };
    setData(newData);
    setEventData(newData);
  };

  const handleLogisticsChange = (key: string, value: string) => {
    if (!data) return;
    const newData: EventData = {
      ...data,
      logistics: { ...data.logistics, [key]: value },
    };
    setData(newData);
    setEventData(newData);
  };

  const handleContinue = () => {
    updateProgress({ currentPage: 'outro' });
    router.push('/outro');
  };

  if (!isLoaded || !data) {
    return null;
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold mb-2">Your Event Plan</h1>
        <p className="text-gray-600 mb-8">Review and edit your plan. All changes are saved automatically.</p>

        {/* Conceptual Planning Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b-2 border-black">
            Conceptual Planning
          </h2>
          <div>
            {conceptualFields.map((field) => (
              <EditableField
                key={field.key}
                label={field.label}
                value={data.conceptual[field.key as keyof typeof data.conceptual] || ''}
                onChange={(value) => handleConceptualChange(field.key, value)}
                multiline={field.multiline}
              />
            ))}
          </div>
        </section>

        {/* Logistical Planning Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b-2 border-black">
            Logistical Planning
          </h2>
          <div>
            {logisticsFields.map((field) => (
              <EditableField
                key={field.key}
                label={field.label}
                value={data.logistics[field.key as keyof typeof data.logistics] || ''}
                onChange={(value) => handleLogisticsChange(field.key, value)}
                multiline={field.multiline}
                type={field.type}
              />
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            disabled
            className="px-4 py-2 bg-gray-200 text-gray-500 rounded cursor-not-allowed"
          >
            Download planning PDF
          </button>
          <button
            disabled
            className="px-4 py-2 bg-gray-200 text-gray-500 rounded cursor-not-allowed"
          >
            Talk to ChatGPT about it
          </button>
          <div className="flex-1" />
          <button
            onClick={handleContinue}
            className="px-6 py-2 bg-black text-white rounded"
          >
            Continue →
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          PDF and ChatGPT features coming in Phase 5
        </p>
      </div>
    </main>
  );
}
