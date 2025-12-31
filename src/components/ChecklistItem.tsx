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
  const isSkipped = status === 'skipped';
  const isSaved = status === 'saved';

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-5 px-5 py-4
        bg-lab-white/95 backdrop-blur-sm 
        rounded-card
        transition-all duration-200
        text-left group
        ${isComplete 
          ? 'border-2 border-lab-green/40 shadow-sm' 
          : 'border-2 border-lab-gray-200/80 shadow-card hover:shadow-card-hover hover:border-lab-yellow-400 hover:scale-[1.01]'
        }
      `}
    >
      <span className={`
        text-[1.75rem] font-bold min-w-[2.5rem] text-center
        transition-colors duration-200
        ${isComplete 
          ? 'text-lab-green' 
          : 'text-lab-black group-hover:text-lab-yellow-600'
        }
      `}>
        {number}
      </span>

      <span className={`
        flex-1 text-[1.1rem] font-semibold leading-snug
        ${isComplete ? 'text-lab-gray-500' : 'text-lab-black'}
      `}>
        {title}
      </span>

      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        transition-all duration-200
        ${isComplete 
          ? 'bg-lab-green text-white' 
          : 'border-2 border-lab-gray-300 group-hover:border-lab-yellow-400 group-hover:bg-lab-yellow-50'
        }
      `}>
        {isSkipped ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6l7 6-7 6V6zM13 6l7 6-7 6V6z" />
          </svg>
        ) : isSaved ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-lab-gray-400 group-hover:text-lab-yellow-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </button>
  );
}
