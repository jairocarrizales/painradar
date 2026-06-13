import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import type { Opportunity } from "@/shared/types/domain";

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica", color: "#0A0A0A" },
  header: {
    borderWidth: 2,
    borderColor: "#0A0A0A",
    backgroundColor: "#FFDB3D",
    padding: 12,
    marginBottom: 16,
  },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold" },
  subtitle: { fontSize: 10, marginTop: 4 },
  card: { borderWidth: 2, borderColor: "#0A0A0A", padding: 12, marginBottom: 12 },
  rankRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  oppTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", flex: 1, paddingRight: 8 },
  overall: { fontSize: 13, fontFamily: "Helvetica-Bold" },
  es: { fontStyle: "italic", color: "#555", marginTop: 2 },
  summary: { marginBottom: 6, lineHeight: 1.4 },
  scoresRow: { flexDirection: "row", gap: 12, marginBottom: 8 },
  score: { fontSize: 9 },
  scoreLabel: { fontFamily: "Helvetica-Bold" },
  ideaBox: {
    borderWidth: 1,
    borderColor: "#0A0A0A",
    backgroundColor: "#EEF7D6",
    padding: 8,
    marginBottom: 8,
  },
  ideaName: { fontFamily: "Helvetica-Bold", fontSize: 11, marginBottom: 2 },
  quote: { borderLeftWidth: 2, borderLeftColor: "#0A0A0A", paddingLeft: 6, marginBottom: 4, color: "#333" },
  link: { color: "#1a4dd0", fontSize: 8 },
  meta: { fontSize: 8, color: "#666", marginTop: 2 },
  footer: { position: "absolute", bottom: 20, left: 36, right: 36, fontSize: 8, color: "#999", textAlign: "center" },
});

export function OpportunitiesPdf({
  niche,
  opportunities,
}: {
  niche: string;
  opportunities: Opportunity[];
}) {
  return (
    <Document title={`PainRadar — ${niche}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>PainRadar</Text>
          <Text style={styles.subtitle}>
            {opportunities.length} oportunidades de app para &quot;{niche}&quot; — rankeadas por
            dolor, frecuencia y hueco de mercado.
          </Text>
        </View>

        {opportunities.map((opp, i) => (
          <View key={opp.id} style={styles.card} wrap={false}>
            <View style={styles.rankRow}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.oppTitle}>
                  #{i + 1} · {opp.title}
                </Text>
                {opp.titleEs ? <Text style={styles.es}>ES: {opp.titleEs}</Text> : null}
              </View>
              <Text style={styles.overall}>{opp.overall}</Text>
            </View>

            <View style={styles.summary}>
              <Text>{opp.problemSummary}</Text>
              {opp.problemSummaryEs ? <Text style={styles.es}>ES: {opp.problemSummaryEs}</Text> : null}
            </View>

            <View style={styles.scoresRow}>
              <Text style={styles.score}>
                <Text style={styles.scoreLabel}>Dolor </Text>
                {opp.scores.pain}
              </Text>
              <Text style={styles.score}>
                <Text style={styles.scoreLabel}>Frecuencia </Text>
                {opp.scores.frequency}
              </Text>
              <Text style={styles.score}>
                <Text style={styles.scoreLabel}>Hueco </Text>
                {opp.scores.marketGap}
              </Text>
            </View>

            <View style={styles.ideaBox}>
              <Text style={styles.ideaName}>Idea de app: {opp.appIdea.name}</Text>
              <Text>{opp.appIdea.pitch}</Text>
              {opp.appIdea.pitchEs ? <Text style={styles.es}>ES: {opp.appIdea.pitchEs}</Text> : null}
              <Text style={styles.meta}>Funciones: {opp.appIdea.keyFeatures.join(" · ")}</Text>
            </View>

            {opp.citations.map((c, ci) => (
              <View key={ci}>
                <Text style={styles.quote}>&quot;{c.text}&quot;</Text>
                {c.textEs ? <Text style={[styles.quote, styles.es]}>ES: &quot;{c.textEs}&quot;</Text> : null}
                <Text style={styles.meta}>
                  {c.platform} · {c.author}
                  {c.context ? ` · ${c.context}` : ""}
                </Text>
                <Link src={c.url} style={styles.link}>
                  {c.url}
                </Link>
              </View>
            ))}
          </View>
        ))}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `PainRadar — quejas reales entran, ideas validadas salen.  ·  ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
