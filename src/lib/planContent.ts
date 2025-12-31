import { EventData } from './types';

const TBD = '[TBD]';

export type TextSegment = {
  text: string;
  bold?: boolean;
};

export type PlanParagraph = TextSegment[];

export type PlanSubsection = {
  title: string;
  paragraphs?: PlanParagraph[];
  details?: Array<{
    label: string;
    value: string;
  }>;
};

export type PlanSection = {
  title: string;
  paragraphs?: PlanParagraph[];
  details?: Array<{
    label: string;
    value: string;
  }>;
  subsections?: PlanSubsection[];
};

export type PlanContent = {
  title: string;
  subtitle: TextSegment[];
  sections: PlanSection[];
};

function formatValue(value: string): string {
  const trimmed = value.trim();
  return trimmed ? trimmed : TBD;
}

function formatInlineValue(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return TBD;
  return trimmed.replace(/\s*\n\s*/g, '; ').replace(/\s{2,}/g, ' ');
}

function formatDateTimeParts(dateTime: string): { date: string; time: string } {
  const trimmed = dateTime.trim();
  if (!trimmed) {
    return { date: TBD, time: TBD };
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    const [datePart, timePart] = trimmed.split('T');
    return {
      date: datePart || TBD,
      time: timePart || TBD,
    };
  }

  return {
    date: parsed.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: parsed.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }),
  };
}

export function buildPlanContent(data: EventData): PlanContent {
  const campus = formatInlineValue(data.campus);
  const theme = formatInlineValue(data.conceptual.theme);
  const community = formatInlineValue(data.conceptual.hostGroup);
  const presenters = formatInlineValue(data.logistics.presenterList);
  const yourUseCase = formatInlineValue(data.conceptual.yourUseCase);
  const guidingQuestion = formatInlineValue(data.conceptual.guidingQuestion);
  const venue = formatInlineValue(data.logistics.venue);
  const promotionPlan = formatInlineValue(data.logistics.promotionPlan);
  const supplies = formatInlineValue(data.logistics.supplies);
  const helpers = formatInlineValue(data.logistics.helpers);
  const sharingPlan = formatInlineValue(data.conceptual.sharingPlan);
  const { date, time } = formatDateTimeParts(data.logistics.eventDateTime);

  return {
    title: 'ChatGPT Lab Event Plan',
    subtitle: [
      { text: 'Hosted at ' },
      { text: campus, bold: true },
    ],
    sections: [
      {
        title: 'Overview',
        paragraphs: [
          [
            {
              text: "This ChatGPT Lab is a one-hour, peer-led show-and-tell where students share how they're using AI. The goal is to gather a small, bought-in group, spark a few new ideas, and have guests leave with curiosity, confidence, and a more thoughtful view of AI.",
            },
          ],
        ],
      },
      {
        title: 'Event Focus',
        details: [
          { label: 'Theme', value: theme },
          { label: 'Hosted with', value: community },
        ],
      },
      {
        title: 'Structure of the Event',
        paragraphs: [
          [
            {
              text: 'To keep the experience organized and flowing, a simple slideshow will be used. The event begins with a quick explanation of what a ChatGPT Lab is, then moves into show-and-tells. Each presenter will interactively demonstrate a creative way they use ChatGPT, ideally with a live walkthrough.',
            },
          ],
          [
            {
              text: 'After the show-and-tells, attendees will have a few minutes to share their own use cases or reflect with a neighbor on what stood out. The event then opens into a broader discussion about AI and its impact using a guiding question.',
            },
          ],
          [
            {
              text: 'To close the event, the group will be asked whether they discovered a new way to use ChatGPT, and optional contact information can be collected so the community can keep exploring together.',
            },
          ],
        ],
        details: [
          { label: "Presenters I'll invite", value: presenters },
          { label: 'My use case', value: yourUseCase },
          { label: 'Guiding question', value: guidingQuestion },
        ],
      },
      {
        title: 'Details & Logistics',
        subsections: [
          {
            title: 'Event Details',
            details: [
              { label: 'Date', value: date },
              { label: 'Time', value: time },
              { label: 'Location', value: venue },
            ],
          },
          {
            title: 'Promotion',
            paragraphs: [
              [{ text: 'Promotion focuses on targeted, personal outreach to bring the right group together.' }],
            ],
            details: [{ label: 'Promotion plan', value: promotionPlan }],
          },
          {
            title: 'Day-of Support',
            details: [
              { label: 'Supplies needed', value: supplies },
              { label: 'People helping out', value: helpers },
            ],
          },
          {
            title: 'Sharing Back',
            details: [{ label: "How I'll capture the moment", value: sharingPlan }],
            paragraphs: [
              [
                {
                  text: 'Highlights can be shared back with the Lab community and OpenAI so others can learn from the event. Host community channels (e.g., Slack) are a good place to post, along with standout moments or photos for social highlights and monthly recaps.',
                },
              ],
            ],
          },
        ],
      },
    ],
  };
}
