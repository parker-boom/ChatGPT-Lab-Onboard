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

  const requiredInputs = item.inputs.filter(input => !input.label.includes('optional'));
  const allRequiredFilled = requiredInputs.length === 0 || requiredInputs.every(input => values[input.id]?.trim());

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col h-full max-h-[85vh]">
        <div className="flex items-center justify-between px-8 py-5 border-b border-lab-gray-200">
          <h2 className="text-[1.5rem] font-bold text-lab-black">{item.title}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-lab-gray-400 hover:text-lab-black hover:bg-lab-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-3 mb-6">
            {item.description.map((paragraph, i) => (
              <p key={i} className="text-body-sm text-lab-gray-600 leading-relaxed">{paragraph}</p>
            ))}
          </div>

          {item.brainstormQuestion && (
            <div className="bg-lab-yellow-100 border border-lab-yellow-300 rounded-card p-5 mb-6">
              <div className="text-caption font-semibold text-lab-gray-700 mb-1">💡 Think about</div>
              <p className="text-body-sm text-lab-black">{item.brainstormQuestion}</p>
            </div>
          )}

          {item.templateButton && (
            <div className="mb-6">
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

          {item.inputs.length > 0 && (
            <div className="space-y-5">
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

        <div className="px-8 py-5 bg-lab-white border-t border-lab-gray-200 flex justify-between items-center">
          <button onClick={handleSkip} className="btn-secondary">
            Skip for now
          </button>
          <button 
            onClick={handleSave} 
            disabled={!allRequiredFilled}
            className="btn-primary"
          >
            Save & continue
          </button>
        </div>
      </div>
    </Modal>
  );
}
