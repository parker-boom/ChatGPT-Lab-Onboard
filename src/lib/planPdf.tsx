import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { EventData } from './types';
import { buildPlanContent, PlanParagraph, PlanSubsection, TextSegment } from './planContent';

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#111827',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 32,
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
    color: '#1f2937',
  },
  subsection: {
    marginTop: 20,
  },
  subsectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 12,
    color: '#111827',
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 1.45,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    width: 120,
  },
  detailValue: {
    fontFamily: 'Helvetica-Bold',
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
});

function renderSegments(segments: TextSegment[]) {
  return (
    <Text style={styles.paragraph}>
      {segments.map((segment, index) => (
        <Text key={`${segment.text}-${index}`} style={segment.bold ? styles.bold : undefined}>
          {segment.text}
        </Text>
      ))}
    </Text>
  );
}

function renderParagraphs(paragraphs: PlanParagraph[]) {
  return paragraphs.map((paragraph, index) => (
    <View key={`paragraph-${index}`}>
      {renderSegments(paragraph)}
    </View>
  ));
}

function renderSubsections(subsections: PlanSubsection[]) {
  return subsections.map((subsection, index) => (
    <View key={`${subsection.title}-${index}`} style={styles.subsection}>
      <Text style={styles.subsectionTitle}>{subsection.title}</Text>
      {subsection.paragraphs ? renderParagraphs(subsection.paragraphs) : null}
      {subsection.details
        ? subsection.details.map((detail) => (
            <View key={detail.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{detail.label}:</Text>
              <Text style={styles.detailValue}>{detail.value}</Text>
            </View>
          ))
        : null}
    </View>
  ));
}

export function PlanPdfDocument({ data }: { data: EventData }) {
  const content = buildPlanContent(data);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.subtitle}>
          {content.subtitle.map((segment, index) => (
            <Text key={`${segment.text}-${index}`} style={segment.bold ? styles.bold : undefined}>
              {segment.text}
            </Text>
          ))}
        </Text>

        {content.sections.map((section) => (
          <View
            key={section.title}
            style={styles.section}
            break={section.title === 'Details & Logistics'}
          >
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.paragraphs ? renderParagraphs(section.paragraphs) : null}
            {section.details
              ? section.details.map((detail) => (
                  <View key={detail.label} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{detail.label}:</Text>
                    <Text style={styles.detailValue}>{detail.value}</Text>
                  </View>
                ))
              : null}
            {section.subsections ? renderSubsections(section.subsections) : null}
          </View>
        ))}
      </Page>
    </Document>
  );
}

export async function downloadPlanPdf(data: EventData): Promise<void> {
  const blob = await pdf(<PlanPdfDocument data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ChatGPT_Event_Plan.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
