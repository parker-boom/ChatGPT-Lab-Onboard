"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EventData } from "@/lib/types";
import { getEventData, setEventData, updateProgress } from "@/lib/storage";

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
  half?: boolean;
}

function Field({ label, value, onChange, multiline, type, half }: FieldProps) {
  const isEmpty = !value;

  return (
    <div className={half ? "flex-1" : "w-full"}>
      <label className="block text-[0.8rem] font-semibold text-lab-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Not set"
          className={`
            w-full px-4 py-3
            bg-lab-white border-2 border-lab-gray-200 rounded-button
            text-[1rem] leading-relaxed
            transition-all duration-200
            focus:border-lab-yellow-400 focus:outline-none
            resize-none
            ${isEmpty ? "text-lab-gray-400 italic" : "text-lab-black"}
          `}
          rows={3}
        />
      ) : type === "datetime" ? (
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full px-4 py-3
            bg-lab-white border-2 border-lab-gray-200 rounded-button
            text-[1rem]
            transition-all duration-200
            focus:border-lab-yellow-400 focus:outline-none
            ${isEmpty ? "text-lab-gray-400" : "text-lab-black"}
          `}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Not set"
          className={`
            w-full px-4 py-3
            bg-lab-white border-2 border-lab-gray-200 rounded-button
            text-[1rem]
            transition-all duration-200
            focus:border-lab-yellow-400 focus:outline-none
            ${isEmpty ? "text-lab-gray-400 italic" : "text-lab-black"}
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
    updateProgress({ currentPage: "summary" });
    setIsLoaded(true);
  }, []);

  const handleChange = (
    section: "conceptual" | "logistics",
    key: string,
    value: string
  ) => {
    if (!data) return;
    const newData: EventData = {
      ...data,
      [section]: { ...data[section], [key]: value },
    };
    setData(newData);
    setEventData(newData);
  };

  const handleContinue = () => {
    updateProgress({ currentPage: "outro" });
    router.push("/outro");
  };

  if (!isLoaded || !data) {
    return null;
  }

  return (
    <main className="min-h-screen py-12 px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-[2.75rem] font-black italic text-lab-black tracking-tight drop-shadow-sm mb-2">
            🧪 Your Event Plan
          </h1>
          <p className="text-[1.1rem] text-lab-gray-600">
            Review and edit your plan below
          </p>
        </div>

        <div className="card p-8 mb-8">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Field
                label="Community"
                value={data.conceptual.hostGroup}
                onChange={(v) => handleChange("conceptual", "hostGroup", v)}
                half
              />
              <Field
                label="Theme"
                value={data.conceptual.theme}
                onChange={(v) => handleChange("conceptual", "theme", v)}
                half
              />
            </div>

            <div className="flex gap-4">
              <Field
                label="Date & Time"
                value={data.logistics.eventDateTime}
                onChange={(v) => handleChange("logistics", "eventDateTime", v)}
                type="datetime"
                half
              />
              <Field
                label="Venue"
                value={data.logistics.venue}
                onChange={(v) => handleChange("logistics", "venue", v)}
                half
              />
            </div>

            <div className="border-t border-lab-gray-100 pt-6">
              <Field
                label="My Use Case"
                value={data.conceptual.yourUseCase}
                onChange={(v) => handleChange("conceptual", "yourUseCase", v)}
              />
            </div>

            <div className="flex gap-4">
              <Field
                label="Other Presenters"
                value={data.conceptual.potentialPresenters}
                onChange={(v) =>
                  handleChange("conceptual", "potentialPresenters", v)
                }
                multiline
                half
              />
              <Field
                label="Promotion Plan"
                value={data.logistics.promotionPlan}
                onChange={(v) => handleChange("logistics", "promotionPlan", v)}
                multiline
                half
              />
            </div>

            <div className="flex gap-4">
              <Field
                label="Day-of Supplies"
                value={data.logistics.supplies}
                onChange={(v) => handleChange("logistics", "supplies", v)}
                multiline
                half
              />
              <Field
                label="Day-of Helpers"
                value={data.logistics.helpers}
                onChange={(v) => handleChange("logistics", "helpers", v)}
                multiline
                half
              />
            </div>

            <div className="border-t border-lab-gray-100 pt-6">
              <Field
                label="Post-Event Sharing Plan"
                value={data.conceptual.sharingPlan}
                onChange={(v) => handleChange("conceptual", "sharingPlan", v)}
                multiline
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button onClick={handleContinue} className="btn-primary px-10">
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
