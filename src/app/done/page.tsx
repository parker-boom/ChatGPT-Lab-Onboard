'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProgress, getEventData } from '@/lib/storage';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(eventDate: string): TimeLeft | null {
  const difference = new Date(eventDate).getTime() - new Date().getTime();

  if (difference <= 0) {
    return null;
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-36 h-36 bg-lab-white rounded-card shadow-card flex items-center justify-center mb-3">
        <span className="text-[5rem] font-black text-lab-black tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[1rem] font-semibold text-lab-gray-500 uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

export default function DonePage() {
  const router = useRouter();
  const [eventDateTime, setEventDateTime] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    updateProgress({ currentPage: 'done' });
    const data = getEventData();
    const dateTime = data.logistics.eventDateTime;
    setEventDateTime(dateTime || null);

    if (dateTime) {
      setTimeLeft(calculateTimeLeft(dateTime));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!eventDateTime) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(eventDateTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDateTime]);

  const handleBackToStart = () => {
    updateProgress({ currentPage: 'intro', introSlideIndex: 0 });
    router.push('/intro');
  };

  const handleEditPlan = () => {
    updateProgress({ currentPage: 'summary' });
    router.push('/summary');
  };

  if (!isLoaded) {
    return null;
  }

  const eventDate = eventDateTime ? new Date(eventDateTime) : null;
  const isPastEvent = eventDate && eventDate.getTime() < new Date().getTime();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        {eventDateTime && timeLeft && !isPastEvent ? (
          <>
            <h1 className="text-[3rem] font-black text-lab-black mb-10">
              🚀 Your Lab is in
            </h1>

            <div className="flex gap-6 justify-center mb-14">
              <CountdownUnit value={timeLeft.days} label="Days" />
              <CountdownUnit value={timeLeft.hours} label="Hours" />
              <CountdownUnit value={timeLeft.minutes} label="Minutes" />
              <CountdownUnit value={timeLeft.seconds} label="Seconds" />
            </div>
          </>
        ) : isPastEvent ? (
          <>
            <h1 className="text-[3rem] font-black text-lab-black mb-4">
              🎉 Hope it went great!
            </h1>
            <p className="text-[1.25rem] text-lab-gray-600 mb-10">
              Your event was scheduled for{' '}
              {eventDate?.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              . Don&apos;t forget to fill out the host form!
            </p>
          </>
        ) : (
          <>
            <h1 className="text-[3rem] font-black text-lab-black mb-4">
              ✨ You&apos;re all set!
            </h1>
            <p className="text-[1.25rem] text-lab-gray-600 mb-10">
              Add a date to your plan to see the countdown to your event.
            </p>
          </>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={handleEditPlan}
            className="flex items-center gap-2 px-6 py-3 bg-lab-white hover:bg-lab-gray-50 text-lab-black font-medium rounded-button shadow-card transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit plan
          </button>
          <button
            onClick={handleBackToStart}
            className="flex items-center gap-2 px-6 py-3 bg-lab-white hover:bg-lab-gray-50 text-lab-black font-medium rounded-button shadow-card transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Start over
          </button>
        </div>
      </div>
    </main>
  );
}
