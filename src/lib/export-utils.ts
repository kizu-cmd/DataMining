import type { AssociationRule, ComboPattern } from "@/data/dashboard-data";

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportRulesCSV(rules: AssociationRule[]) {
  const header = "Antecedent,Consequent,Support (%),Confidence (%),Lift";
  const rows = rules.map(
    (r) => `"${r.antecedent}","${r.consequent}",${r.support},${r.confidence},${r.lift}`
  );
  downloadFile([header, ...rows].join("\n"), "association-rules.csv", "text/csv");
}

export function exportCombosCSV(combos: ComboPattern[]) {
  const header = "Items,Support (%),Confidence (%)";
  const rows = combos.map(
    (c) => `"${c.items.join(" + ")}",${c.support},${c.confidence}`
  );
  downloadFile([header, ...rows].join("\n"), "trending-combos.csv", "text/csv");
}

export function exportFullReport(
  rules: AssociationRule[],
  combos: ComboPattern[],
  totalTransactions: number,
  patternsDiscovered: number
) {
  const lines = [
    "JOLLIBEE MARKET BASKET INTELLIGENCE REPORT",
    `Generated: ${new Date().toLocaleString()}`,
    `Total Transactions Analyzed: ${totalTransactions}`,
    `Patterns Discovered: ${patternsDiscovered}`,
    "",
    "=== TRENDING COMBOS ===",
    ...combos.map(
      (c, i) => `${i + 1}. ${c.items.join(" + ")} | Support: ${c.support}% | Confidence: ${c.confidence}%`
    ),
    "",
    "=== ASSOCIATION RULES ===",
    "Antecedent → Consequent | Support | Confidence | Lift",
    ...rules.map(
      (r) => `${r.antecedent} → ${r.consequent} | ${r.support}% | ${r.confidence}% | ${r.lift}`
    ),
  ];
  downloadFile(lines.join("\n"), "mba-full-report.txt", "text/plain");
}
