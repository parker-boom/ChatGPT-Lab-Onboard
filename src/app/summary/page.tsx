'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EventData } from '@/lib/types';
import { getEventData, setEventData, updateProgress } from '@/lib/storage';

const conceptualFields = [
  { key: 'hostGroup', label: 'Host community' },
  { key: 'theme', label: 'Theme' },
  { key: 'yourUseCase', label: 'Your show & tell use case' },
  { key: 'potentialPresenters', label: 'Other potential presenters', multiline: true },
  { key: 'guidingQuestion', label: 'Guiding question' },
  { key: 'sharingPlan', label: 'Sharing plan', multiline: true },
];

const logisticsFields = [
  { key: 'eventDateTime', label: 'Event date & time', type: 'datetime' },
  { key: 'venue', label: 'Venue / location' },
  { key: 'presenterList', label: 'Confirmed presenters', multiline: true },
  { key: 'promotionPlan', label: 'Promotion plan', multiline: true },
  { key: 'supplies', label: 'Supplies needed', multiline: true },
  { key: 'helpers', label: 'Day-of helpers', multiline: true },
];

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
}

function EditableField({ label, value, onChange, multiline, type }: EditableFieldProps) {
  const isEmpty = !value;

  return (
    <div className="group py-4 border-b border-lab-gray-100 last:border-b-0">
      <label className="block text-caption font-medium text-lab-gray-500 mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Add later..."
          className={`
            w-full px-3 py-2 -mx-3
            bg-transparent rounded-button
            text-body-sm leading-relaxed
            border border-transparent
            transition-all duration-200
            focus:bg-lab-white focus:border-lab-gray-200 focus:outline-none
            group-hover:bg-lab-gray-50
            resize-none
            ${isEmpty ? 'text-lab-gray-400 italic' : 'text-lab-black'}
          `}
          rows={2}
        />
      ) : type === 'datetime' ? (
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-3 py-2 -mx-3
            bg-transparent rounded-button
            text-body-sm
            border border-transparent
            transition-all duration-200
            focus:bg-lab-white focus:border-lab-gray-200 focus:outline-none
            group-hover:bg-lab-gray-50
            ${isEmpty ? 'text-lab-gray-400' : 'text-lab-black'}
          `}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Add later..."
          className={`
            w-full px-3 py-2 -mx-3
            bg-transparent rounded-button
            text-body-sm
            border border-transparent
            transition-all duration-200
            focus:bg-lab-white focus:border-lab-gray-200 focus:outline-none
            group-hover:bg-lab-gray-50
            ${isEmpty ? 'text-lab-gray-400 italic' : 'text-lab-black'}
          `}
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
    <main className="min-h-screen py-12 px-8">
      <div className="max-w-content-wide mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-lab-green/10 text-lab-green rounded-full mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-caption font-medium">Planning complete</span>
          </div>
          <h1 className="text-display text-lab-black mb-3">Your Event Plan</h1>
          <p className="text-body text-lab-gray-500 max-w-md mx-auto">
            Review and refine your plan. Click any field to edit — changes save automatically.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          {/* Conceptual Planning */}
          <section className="card p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-lab-gray-200">
              <div className="w-8 h-8 rounded-full bg-lab-yellow-200 flex items-center justify-center">
                <span className="text-sm font-semibold">1</span>
              </div>
              <h2 className="text-subheading text-lab-black">Conceptual</h2>
            </div>
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

          {/* Logistical Planning */}
          <section className="card p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-lab-gray-200">
              <div className="w-8 h-8 rounded-full bg-lab-yellow-200 flex items-center justify-center">
                <span className="text-sm font-semibold">2</span>
              </div>
              <h2 className="text-subheading text-lab-black">Logistics</h2>
            </div>
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
        </div>

        {/* Actions */}
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <button
                disabled
                className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-lab-gray-200 rounded-button text-body-sm font-medium text-lab-gray-400"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
                <span className="text-caption text-lab-gray-300 ml-1">Soon</span>
              </button>
              <button
                disabled
                className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-lab-gray-200 rounded-button text-body-sm font-medium text-lab-gray-400"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chat with GPT
                <span className="text-caption text-lab-gray-300 ml-1">Soon</span>
              </button>
            </div>
            <button onClick={handleContinue} className="btn-primary">
              Finish up →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
