import { useAnalysis } from "@/context/AnalysisContext";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Download } from "lucide-react";
import { exportRulesCSV } from "@/lib/export-utils";

export const AssociationRulesTable = () => {
  const { associationRules } = useAnalysis();

  return (
    <section className="mb-10">
      <div className="kiosk-section-title">
        <h2>📋 Association Rules</h2>
        {associationRules.length > 0 && (
          <button
            onClick={() => exportRulesCSV(associationRules)}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        )}
      </div>
      {associationRules.length === 0 ? (
        <div className="kiosk-empty">
          <span className="text-5xl block mb-3">📋</span>
          <p className="text-sm font-medium">No association rules yet</p>
          <p className="text-xs mt-1">Upload transaction data to generate rules</p>
        </div>
      ) : (
        <div className="kiosk-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-primary/5 to-accent/5 border-b-2">
                <TableHead className="font-extrabold">Antecedent</TableHead>
                <TableHead className="font-extrabold">Consequent</TableHead>
                <TableHead className="text-right font-extrabold">Support</TableHead>
                <TableHead className="text-right font-extrabold">Confidence</TableHead>
                <TableHead className="text-right font-extrabold">Lift</TableHead>
                <TableHead className="text-right font-extrabold">Leverage</TableHead>
                <TableHead className="text-right font-extrabold">Conviction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {associationRules.map((r, i) => (
                <TableRow key={i} className="hover:bg-accent/5 transition-colors">
                  <TableCell className="font-bold">{r.antecedent}</TableCell>
                  <TableCell>{r.consequent}</TableCell>
                  <TableCell className="text-right">
                    <span className="kiosk-badge bg-accent/15 text-accent-foreground">{r.support}%</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="kiosk-badge bg-primary/10 text-primary">{r.confidence}%</span>
                  </TableCell>
                  <TableCell className="text-right font-extrabold">{r.lift}</TableCell>
                  <TableCell className="text-right">{r.leverage}</TableCell>
                  <TableCell className="text-right">
                    {Number.isFinite(r.conviction) ? r.conviction : "∞"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
};
