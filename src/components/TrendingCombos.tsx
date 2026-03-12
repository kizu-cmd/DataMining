import { useState } from "react";
import { useAnalysis } from "@/context/AnalysisContext";
import { Zap, Download } from "lucide-react";
import { exportCombosCSV } from "@/lib/export-utils";
import { apiEnabled, createCombo } from "@/lib/api";
import { toast } from "sonner";

const itemIcon: Record<string, string> = {
  Chickenjoy: "🍗", Rice: "🍚", Coke: "🥤", "Burger Steak": "🍔",
  Fries: "🍟", "Jolly Spaghetti": "🍝", "Peach Mango Pie": "🥧",
  "Jolly Palabok": "🍜", "Iced Tea": "🧊", "Chocolate Sundae": "🍨",
};

function getIcon(name: string): string {
  if (itemIcon[name]) return itemIcon[name];
  const lower = name.toLowerCase();
  if (lower.includes("chicken")) return "🍗";
  if (lower.includes("rice")) return "🍚";
  if (lower.includes("coke") || lower.includes("drink")) return "🥤";
  if (lower.includes("burger")) return "🍔";
  if (lower.includes("fries")) return "🍟";
  if (lower.includes("spag")) return "🍝";
  if (lower.includes("pie")) return "🥧";
  if (lower.includes("tea")) return "🧊";
  return "🍽️";
}

export const TrendingCombos = () => {
  const { trendingCombos } = useAnalysis();
  const [creating, setCreating] = useState<Record<string, boolean>>({});
  const [created, setCreated] = useState<Record<string, boolean>>({});

  const handleCreateCombo = async (id: string, items: string[], support: number, confidence: number) => {
    if (creating[id] || created[id]) return;
    setCreating((prev) => ({ ...prev, [id]: true }));
    try {
      if (apiEnabled()) {
        await createCombo({ items, support, confidence, source: "trending" });
      }
      setCreated((prev) => ({ ...prev, [id]: true }));
      toast.success(`Combo created: ${items.join(" + ")}`);
    } catch (err) {
      toast.error("Failed to create combo. Please try again.");
    } finally {
      setCreating((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <section className="mb-10">
      <div className="kiosk-section-title">
        <h2>🔥 Trending Combos</h2>
        {trendingCombos.length > 0 && (
          <button
            onClick={() => exportCombosCSV(trendingCombos)}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        )}
      </div>
      {trendingCombos.length === 0 ? (
        <div className="kiosk-empty">
          <span className="text-5xl block mb-3">🍽️</span>
          <p className="text-sm font-medium">No trending combos yet</p>
          <p className="text-xs mt-1">Upload transaction data to discover popular meal patterns</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingCombos.map((combo, idx) => {
            const isCreated = !!created[combo.id];
            const isBusy = !!creating[combo.id];
            return (
              <div
                key={combo.id}
                onClick={() => handleCreateCombo(combo.id, combo.items, combo.support, combo.confidence)}
                className={`kiosk-card p-0 overflow-hidden group ${
                  isCreated || isBusy ? "cursor-default" : "cursor-pointer"
                }`}
              >
                <div className={`h-1.5 ${idx === 0 ? "bg-primary" : "bg-accent"}`} />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {combo.items.map((item, i) => (
                      <span key={i} className="flex items-center gap-1">
                        {i > 0 && <span className="text-muted-foreground font-bold text-xs">+</span>}
                        <span className="food-icon text-xl w-10 h-10">{getIcon(item)}</span>
                      </span>
                    ))}
                    {idx === 0 && (
                      <span className="kiosk-badge bg-primary/10 text-primary ml-auto">
                        <Zap className="w-3 h-3" /> #1
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold mb-3">{combo.items.join(" + ")}</p>
                  <div className="flex gap-3 mb-4">
                    <span className="kiosk-badge bg-accent/15 text-accent-foreground">📈 {combo.support}% support</span>
                    <span className="kiosk-badge bg-primary/10 text-primary">🎯 {combo.confidence}%</span>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleCreateCombo(combo.id, combo.items, combo.support, combo.confidence);
                    }}
                    disabled={isCreated || isBusy}
                    className={`w-full text-sm font-extrabold py-2.5 px-4 rounded-xl transition-all hover:shadow-md ${
                      isCreated
                        ? "bg-primary text-primary-foreground opacity-80 cursor-default"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {isCreated ? "Combo Created" : isBusy ? "Creating..." : "🍱 Create Combo Meal"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
