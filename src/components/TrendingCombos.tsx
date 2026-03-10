import { trendingCombos } from "@/data/dashboard-data";
import { Flame, Zap } from "lucide-react";

const itemIcon: Record<string, string> = {
  Chickenjoy: "🍗", Rice: "🍚", Coke: "🥤", "Burger Steak": "🍔",
  Fries: "🍟", "Jolly Spaghetti": "🍝", "Peach Mango Pie": "🥧",
  "Jolly Palabok": "🍜", "Iced Tea": "🧊", "Chocolate Sundae": "🍨",
  "Jolly Crispy Fries": "🍟",
};

export const TrendingCombos = () => (
  <section className="mb-10">
    <div className="kiosk-section-title">
      <div className="bg-primary/10 p-2 rounded-xl">
        <Flame className="w-5 h-5 text-primary" />
      </div>
      <h2>🔥 Trending Combos</h2>
    </div>
    {trendingCombos.length === 0 ? (
      <div className="kiosk-empty">
        <span className="text-5xl block mb-3">🍽️</span>
        <p className="text-sm font-medium">No trending combos yet</p>
        <p className="text-xs mt-1">Upload transaction data to discover popular meal patterns</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendingCombos.map((combo, idx) => (
          <div key={combo.id} className="kiosk-card p-0 overflow-hidden group">
            {/* Promo-style top stripe */}
            <div className={`h-1.5 ${idx === 0 ? 'bg-primary' : 'bg-accent'}`} />
            <div className="p-5">
              {/* Food icons row */}
              <div className="flex items-center gap-2 mb-3">
                {combo.items.map((item, i) => (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-muted-foreground font-bold text-xs">+</span>}
                    <span className="food-icon text-xl w-10 h-10">{itemIcon[item] || "🍽️"}</span>
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
                <span className="kiosk-badge bg-accent/15 text-accent-foreground">
                  📈 {combo.support}% support
                </span>
                <span className="kiosk-badge bg-primary/10 text-primary">
                  🎯 {combo.confidence}%
                </span>
              </div>
              <button className="w-full bg-primary text-primary-foreground text-sm font-extrabold py-2.5 px-4 rounded-xl hover:bg-primary/90 transition-all hover:shadow-md">
                🍱 Create Combo Meal
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
);
