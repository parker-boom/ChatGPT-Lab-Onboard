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
      className={`
        w-full flex items-center gap-5 p-5 
        bg-lab-white/90 backdrop-blur-sm 
        border-2 rounded-card
        transition-all duration-200
        text-left group
        ${isComplete 
          ? 'border-lab-green/30 hover:border-lab-green/50' 
          : 'border-transparent hover:border-lab-yellow-400 shadow-card hover:shadow-card-hover'
        }
      `}
    >
      {/* Number badge */}
      <div className={`
        w-11 h-11 flex items-center justify-center 
        rounded-full font-semibold text-lg
        transition-colors
        ${isComplete 
          ? 'bg-lab-green/10 text-lab-green' 
          : 'bg-lab-yellow-200 text-lab-black group-hover:bg-lab-yellow-300'
        }
      `}>
        {isComplete ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          number
        )}
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <span className={`
          text-body font-medium block truncate
          ${isComplete ? 'text-lab-gray-500' : 'text-lab-black'}
        `}>
          {title}
        </span>
        {status === 'skipped' && (
          <span className="text-caption text-lab-gray-400">Skipped for now</span>
        )}
      </div>

      {/* Arrow indicator */}
      <div className={`
        w-8 h-8 flex items-center justify-center rounded-full
        transition-all duration-200
        ${isComplete 
          ? 'text-lab-gray-300' 
          : 'text-lab-gray-400 group-hover:text-lab-black group-hover:bg-lab-gray-100'
        }
      `}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
