import { promotions } from "@/data/dashboard-data";
import { Gift } from "lucide-react";

export const PromotionOpportunities = () => (
  <section className="mb-10">
    <div className="flex items-center gap-2 mb-4">
      <Gift className="w-5 h-5 text-primary" />
      <h2 className="text-xl font-bold">Promotion Opportunities</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {promotions.map((p) => (
        <div key={p.id} className="bg-card border rounded-lg p-5 shadow-sm flex flex-col gap-3">
          <p className="font-semibold text-sm leading-snug">{p.description}</p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>Support: <strong className="text-foreground">{p.support}%</strong></span>
            <span>Confidence: <strong className="text-foreground">{p.confidence}%</strong></span>
          </div>
          <div className="flex items-center gap-1 text-sm font-bold text-primary">
            <span>+{p.estimatedIncrease}%</span>
            <span className="text-xs font-normal text-muted-foreground">est. sales increase</span>
          </div>
          <button className="mt-auto border border-primary text-primary text-sm font-bold py-2 px-4 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors">
            Activate Promotion
          </button>
        </div>
      ))}
    </div>
  </section>
);
