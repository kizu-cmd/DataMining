import { associationRules } from "@/data/dashboard-data";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { TableProperties } from "lucide-react";

export const AssociationRulesTable = () => (
  <section className="mb-10">
    <div className="flex items-center gap-2 mb-4">
      <TableProperties className="w-5 h-5 text-primary" />
      <h2 className="text-xl font-bold">Association Rules</h2>
    </div>
    {associationRules.length === 0 ? (
      <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">
        <TableProperties className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No association rules yet. Upload transaction data to generate rules.</p>
      </div>
    ) : (
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Antecedent</TableHead>
              <TableHead>Consequent</TableHead>
              <TableHead className="text-right">Support</TableHead>
              <TableHead className="text-right">Confidence</TableHead>
              <TableHead className="text-right">Lift</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {associationRules.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{r.antecedent}</TableCell>
                <TableCell>{r.consequent}</TableCell>
                <TableCell className="text-right">{r.support}%</TableCell>
                <TableCell className="text-right">{r.confidence}%</TableCell>
                <TableCell className="text-right font-semibold">{r.lift}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )}
  </section>
);
