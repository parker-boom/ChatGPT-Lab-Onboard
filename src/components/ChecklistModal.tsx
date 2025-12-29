'use client';

import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { ChecklistItem as ChecklistItemType } from '@/lib/types';

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ChecklistItemType;
  initialValues: Record<string, string>;
  onSave: (values: Record<string, string>) => void;
  onSkip: () => void;
}

export function ChecklistModal({ 
  isOpen, 
  onClose, 
  item, 
  initialValues,
  onSave, 
  onSkip 
}: ChecklistModalProps) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues, isOpen]);

  const handleInputChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    onSave(values);
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-lab-yellow-100 rounded-full mb-4">
            <span className="text-caption font-medium text-lab-gray-600">Step {item.number} of 5</span>
          </div>
          <h2 className="text-heading text-lab-black text-balance">{item.title}</h2>
        </div>

        {/* Description */}
        <div className="space-y-3 mb-8">
          {item.description.map((paragraph, i) => (
            <p key={i} className="text-body-sm text-lab-gray-600 leading-relaxed">{paragraph}</p>
          ))}
        </div>

        {/* Brainstorm question */}
        {item.brainstormQuestion && (
          <div className="bg-lab-yellow-50 border border-lab-yellow-200 rounded-card p-5 mb-8">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-lab-yellow-300 flex items-center justify-center">
                <span className="text-sm">💡</span>
              </div>
              <div>
                <div className="text-caption font-medium text-lab-gray-500 mb-1">Think about</div>
                <p className="text-body-sm text-lab-black">{item.brainstormQuestion}</p>
              </div>
            </div>
          </div>
        )}

        {/* Template button */}
        {item.templateButton && (
          <div className="mb-8">
            <button
              disabled={item.templateButton.comingSoon}
              className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-lab-gray-200 rounded-button text-body-sm font-medium text-lab-gray-500 disabled:opacity-60"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {item.templateButton.label}
            </button>
            {item.templateButton.comingSoon && (
              <span className="ml-3 text-caption text-lab-gray-400">Coming soon</span>
            )}
          </div>
        )}

        {/* Inputs */}
        {item.inputs.length > 0 && (
          <div className="space-y-5 mb-8">
            {item.inputs.map((input) => (
              <div key={input.id}>
                <label className="block text-body-sm font-medium text-lab-black mb-2">
                  {input.label}
                </label>
                {input.type === 'textarea' ? (
                  <textarea
                    value={values[input.id] || ''}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                    placeholder="Type your answer..."
                    className="w-full px-4 py-3 bg-lab-gray-50 border border-lab-gray-200 rounded-button text-body-sm placeholder:text-lab-gray-400 focus:outline-none focus:border-lab-yellow-400 focus:bg-lab-white transition-colors resize-none"
                    rows={4}
                  />
                ) : input.type === 'datetime' ? (
                  <input
                    type="datetime-local"
                    value={values[input.id] || ''}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                    className="w-full px-4 py-3 bg-lab-gray-50 border border-lab-gray-200 rounded-button text-body-sm focus:outline-none focus:border-lab-yellow-400 focus:bg-lab-white transition-colors"
                  />
                ) : (
                  <input
                    type="text"
                    value={values[input.id] || ''}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                    placeholder="Type your answer..."
                    className="w-full px-4 py-3 bg-lab-gray-50 border border-lab-gray-200 rounded-button text-body-sm placeholder:text-lab-gray-400 focus:outline-none focus:border-lab-yellow-400 focus:bg-lab-white transition-colors"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions - sticky footer */}
      <div className="sticky bottom-0 px-8 py-5 bg-lab-white border-t border-lab-gray-100 flex justify-between items-center">
        <button onClick={handleSkip} className="btn-secondary">
          Skip for now
        </button>
        <button onClick={handleSave} className="btn-primary">
          Save & continue
        </button>
      </div>
    </Modal>
  );
}
