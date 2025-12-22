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

  // Reset values when modal opens with new initial values
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
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-1">Step {item.number}</div>
          <h2 className="text-2xl font-bold">{item.title}</h2>
        </div>

        {/* Description */}
        <div className="space-y-3 mb-6">
          {item.description.map((paragraph, i) => (
            <p key={i} className="text-gray-700">{paragraph}</p>
          ))}
        </div>

        {/* Brainstorm question */}
        {item.brainstormQuestion && (
          <div className="bg-gray-50 p-4 rounded mb-6">
            <div className="text-sm font-medium text-gray-500 mb-1">Think about:</div>
            <p className="text-gray-800 italic">{item.brainstormQuestion}</p>
          </div>
        )}

        {/* Template button (if exists) */}
        {item.templateButton && (
          <div className="mb-6">
            <button
              disabled={item.templateButton.comingSoon}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded disabled:opacity-50"
            >
              {item.templateButton.label}
            </button>
            {item.templateButton.comingSoon && (
              <span className="ml-2 text-sm text-gray-400">Coming soon</span>
            )}
          </div>
        )}

        {/* Inputs */}
        {item.inputs.length > 0 && (
          <div className="space-y-4 mb-6">
            {item.inputs.map((input) => (
              <div key={input.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {input.label}
                </label>
                {input.type === 'textarea' ? (
                  <textarea
                    value={values[input.id] || ''}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                    rows={4}
                  />
                ) : input.type === 'datetime' ? (
                  <input
                    type="datetime-local"
                    value={values[input.id] || ''}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={values[input.id] || ''}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={handleSkip}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Skip for now
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}

