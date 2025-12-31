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

const HOST_REPORT_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSdl-1W61FxgUDiATQzo80xvhbpCPfv18Y8EjzpJzfOjwp6FPQ/viewform';

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
  const [campus, setCampus] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    updateProgress({ currentPage: 'done' });
    const data = getEventData();
    const dateTime = data.logistics.eventDateTime;
    setEventDateTime(dateTime || null);
    setCampus(data.campus || '');

    if (dateTime) {
      setTimeLeft(calculateTimeLeft(dateTime));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    router.prefetch('/summary');
    router.prefetch('/intro');
  }, [router]);

  useEffect(() => {
    if (!eventDateTime) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(eventDateTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDateTime]);

  const handleBackToStart = () => {
    updateProgress({ currentPage: 'intro', furthestPage: 'intro', introSlideIndex: 0 });
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
      <div className="text-center max-w-3xl">
        {eventDateTime && timeLeft && !isPastEvent ? (
          <>
            <h1 className="text-[3rem] font-black text-lab-black mb-10">
              🚀 {campus ? `${campus}'s Lab Is In:` : 'Your Lab Is In:'}
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
            <h1 className="text-[3rem] font-black text-lab-black mb-3">
              🎉 Your Lab is complete
            </h1>
            <p className="text-[1.25rem] text-lab-gray-600 mb-8">
              Your event was on{' '}
              {eventDate?.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
              . Thanks for hosting!
            </p>

            <div className="grid gap-6 mb-12 text-left">
              <div className="card p-6">
                <h2 className="text-[1.4rem] font-bold text-lab-black mb-2">
                  Report your event back
                </h2>
                <p className="text-body-sm text-lab-gray-600 mb-4">
                  Please fill out the host report form so we can credit your work and share what
                  you learned with the Lab community.
                </p>
                <a
                  href={HOST_REPORT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  Submit the host report
                </a>
              </div>

              <div className="card p-6">
                <h2 className="text-[1.4rem] font-bold text-lab-black mb-2">
                  Good next steps
                </h2>
                <ul className="text-body-sm text-lab-gray-700 list-disc list-inside space-y-2">
                  <li>Post in the Slack about how it went</li>
                  <li>Email participants to thank them and ask if they want another Lab</li>
                  <li>Post on LinkedIn and tag ChatGPT for Education</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-[3rem] font-black text-lab-black mb-10">
              🚀 Your Lab Is In:
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
