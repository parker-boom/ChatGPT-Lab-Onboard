'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { parseBeakerMarkdown } from '@/lib/utils';

interface BeakerLayoutProps {
  /** Title displayed at the top of the speech card */
  title: string;
  /** Array of dialogue lines (supports **bold** and _italic_ markdown) */
  dialogue: string[];
  /** Optional content rendered below the dialogue (e.g., status badges) */
  footer?: ReactNode;
  /** Optional action buttons rendered at the bottom of the speech card */
  actions?: ReactNode;
  /** Path to the Beaker image (defaults to placeholder) */
  imageSrc?: string;
}

/**
 * Shared layout for Beaker mascot pages (intro, transitions, outro).
 * Renders a two-column layout with Beaker's image and a speech card.
 */
export function BeakerLayout({
  title,
  dialogue,
  footer,
  actions,
  imageSrc = '/assets/SmileyFace.png',
}: BeakerLayoutProps) {
  return (
    <div className="flex gap-8 items-stretch">
      {/* Beaker image container */}
      <div className="h-[460px] w-[307px] flex-shrink-0 bg-lab-white/90 backdrop-blur-sm rounded-card shadow-card overflow-hidden">
        <Image
          src={imageSrc}
          alt="Beaker"
          width={307}
          height={460}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Speech card */}
      <div className="h-[460px] w-[560px] flex-shrink-0 card p-8 flex flex-col">
        <h1 className="text-heading text-lab-black mb-6 text-balance">
          {title}
        </h1>

        <div className="space-y-4">
          {dialogue.map((line, i) => (
            <p
              key={i}
              className="text-[1.2rem] text-lab-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parseBeakerMarkdown(line) }}
            />
          ))}
        </div>

        {footer && (
          <div className="mt-auto pt-6">
            {footer}
          </div>
        )}

        {actions && (
          <div className="mt-auto pt-6">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

