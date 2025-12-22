'use client';

import { ChecklistItemStatus } from '@/lib/types';

interface ChecklistItemProps {
  number: number;
  title: string;
  status: ChecklistItemStatus;
  onClick: () => void;
}

export function ChecklistItem({ number, title, status, onClick }: ChecklistItemProps) {
  const isComplete = status === 'saved' || status === 'skipped';

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded hover:border-gray-400 transition-colors text-left"
    >
      {/* Number */}
      <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded font-bold text-lg">
        {number}
      </div>

      {/* Title */}
      <div className="flex-1">
        <span className="font-medium">{title}</span>
        {status === 'skipped' && (
          <span className="ml-2 text-sm text-gray-400">(skipped)</span>
        )}
      </div>

      {/* Status indicator */}
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
        isComplete 
          ? 'bg-green-500 border-green-500 text-white' 
          : 'border-gray-300'
      }`}>
        {isComplete && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </button>
  );
}

