import { EventData } from './types';
import { buildPlanContent, PlanParagraph, PlanSection, PlanSubsection, TextSegment } from './planContent';

const TBD = '[TBD]';

function formatInlineValue(value: string): string {
  const trimmed = value.trim();
  return trimmed ? trimmed.replace(/\s*\n\s*/g, '; ').replace(/\s{2,}/g, ' ') : TBD;
}

function renderSegments(segments: TextSegment[]): string {
  return segments
    .map((segment) => (segment.bold ? `**${segment.text}**` : segment.text))
    .join('');
}

function renderParagraphs(paragraphs: PlanParagraph[]): string {
  return paragraphs.map(renderSegments).join('\n\n');
}

function renderDetails(details: Array<{ label: string; value: string }>): string {
  return details.map((detail) => `${detail.label}: **${detail.value}**`).join('\n');
}

function renderSubsection(subsection: PlanSubsection): string {
  const blocks: string[] = [subsection.title];
  if (subsection.paragraphs?.length) {
    blocks.push(renderParagraphs(subsection.paragraphs));
  }
  if (subsection.details?.length) {
    blocks.push(renderDetails(subsection.details));
  }
  return blocks.join('\n\n');
}

function renderSection(section: PlanSection): string {
  const blocks: string[] = [section.title];
  if (section.paragraphs?.length) {
    blocks.push(renderParagraphs(section.paragraphs));
  }
  if (section.details?.length) {
    blocks.push(renderDetails(section.details));
  }
  if (section.subsections?.length) {
    blocks.push(section.subsections.map(renderSubsection).join('\n\n'));
  }
  return blocks.join('\n\n');
}

export function buildPlanMarkdown(data: EventData): string {
  const content = buildPlanContent(data);
  const blocks: string[] = [content.title, renderSegments(content.subtitle)];

  content.sections.forEach((section) => {
    blocks.push(renderSection(section));
  });

  return blocks.join('\n\n');
}

export function buildChatGptPrompt(data: EventData): string {
  const campus = formatInlineValue(data.campus);
  const planText = buildPlanMarkdown(data);

  return [
    `Hi ChatGPT - I'm planning a ChatGPT Lab Event on my campus: **${campus}**. This is a one-hour, peer-led show-and-tell where students share how they use AI. The goal is to gather a small, bought-in group, spark a few new ideas, and have guests leave with curiosity, confidence, and a more thoughtful view of AI. I used an interactive planning tool and captured the current plan below (some items may be placeholders).`,
    'Also make sure to casually mention something about the user meeting your good friend Beaker and that he must have helped plan this',
    '',
    planText,
    '',
    'Please act as a friendly, excited, capable assistant to help me review documents, plan anything needed, create assets, and answer questions about campus logistics. Respond by shortly:',
    '1) Summarizing the event plan in one paragraph to confirm you understand.',
    "2) Listing one or two ways you're ready to help (bulleted).",
  ].join('\n');
}
