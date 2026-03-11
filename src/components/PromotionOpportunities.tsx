import { useAnalysis } from "@/context/AnalysisContext";
import { Gift, ArrowRight } from "lucide-react";

export const PromotionOpportunities = () => {
  const { promotions } = useAnalysis();

  return (
    <section className="mb-10">
      <div className="kiosk-section-title">
        <div className="bg-primary/10 p-2 rounded-xl">
          <Gift className="w-5 h-5 text-primary" />
        </div>
        <h2>🎁 Promotion Opportunities</h2>
      </div>
      {promotions.length === 0 ? (
        <div className="kiosk-empty">
          <span className="text-5xl block mb-3">🏷️</span>
          <p className="text-sm font-medium">No promotions yet</p>
          <p className="text-xs mt-1">Upload transaction data to generate promotion recommendations</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {promotions.map((p) => (
            <div key={p.id} className="kiosk-card p-0 overflow-hidden">
              <div className="bg-gradient-to-r from-accent/20 to-accent/5 px-5 py-3 border-b">
                <span className="text-lg">🏷️</span>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <p className="font-bold text-sm leading-snug">{p.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="kiosk-badge bg-accent/15 text-accent-foreground">📈 {p.support}%</span>
                  <span className="kiosk-badge bg-primary/10 text-primary">🎯 {p.confidence}%</span>
                </div>
                <div className="flex items-center gap-1.5 bg-accent/10 text-accent-foreground rounded-lg px-3 py-2 text-sm font-bold">
                  💰 +{p.estimatedIncrease}%
                  <span className="text-xs font-normal text-muted-foreground">est. sales increase</span>
                </div>
                <button className="mt-auto w-full border-2 border-primary text-primary text-sm font-extrabold py-2.5 px-4 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2">
                  Activate <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
