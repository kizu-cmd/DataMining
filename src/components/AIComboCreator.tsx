import { aiRecommendedCombo } from "@/data/dashboard-data";
import { Sparkles, TrendingUp, Target, BarChart3, ArrowUpRight } from "lucide-react";

export const AIComboCreator = () => {
  const combo = aiRecommendedCombo;
  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-accent" />
        <h2 className="text-xl font-bold">AI Combo Meal Creator</h2>
      </div>
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-primary-foreground shadow-lg">
        <div className="absolute -top-6 -right-6 text-8xl opacity-10 select-none">🍗🍝🥤</div>
        <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-2">AI Recommended Combo</p>
        <h3 className="text-2xl font-black mb-1">
          {combo.items.join(" + ")}
        </h3>
        <p className="text-sm opacity-90 mb-5">Based on strongest association rules in the dataset</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Support", value: `${combo.support}%`, icon: BarChart3 },
            { label: "Confidence", value: `${combo.confidence}%`, icon: Target },
            { label: "Lift", value: `${combo.lift}`, icon: TrendingUp },
            { label: "Est. Sales ↑", value: `+${combo.estimatedSalesIncrease}%`, icon: ArrowUpRight },
          ].map((m) => (
            <div key={m.label} className="bg-primary-foreground/15 rounded-lg p-3">
              <m.icon className="w-4 h-4 mb-1 opacity-80" />
              <p className="text-xs opacity-80">{m.label}</p>
              <p className="text-lg font-bold">{m.value}</p>
            </div>
          ))}
        </div>
        <button className="bg-accent text-accent-foreground font-bold py-2.5 px-6 rounded-lg hover:bg-accent/90 transition-colors text-sm">
          🚀 Launch This Combo
        </button>
      </div>
    </section>
  );
};
