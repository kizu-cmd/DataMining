import { trendingCombos } from "@/data/dashboard-data";
import { Flame } from "lucide-react";

const itemIcon: Record<string, string> = {
  Chickenjoy: "🍗", Rice: "🍚", Coke: "🥤", "Burger Steak": "🍔",
  Fries: "🍟", "Jolly Spaghetti": "🍝", "Peach Mango Pie": "🥧",
  "Jolly Palabok": "🍜", "Iced Tea": "🧊", "Chocolate Sundae": "🍨",
  "Jolly Crispy Fries": "🍟",
};

export const TrendingCombos = () => (
  <section className="mb-10">
    <div className="flex items-center gap-2 mb-4">
      <Flame className="w-5 h-5 text-primary" />
      <h2 className="text-xl font-bold">Trending Combos</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {trendingCombos.map((combo) => (
        <div key={combo.id} className="bg-card rounded-lg border p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-1 text-2xl">
            {combo.items.map((item, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-muted-foreground text-sm mx-0.5">+</span>}
                <span title={item}>{itemIcon[item] || "🍽️"}</span>
              </span>
            ))}
          </div>
          <p className="text-sm font-semibold">{combo.items.join(" + ")}</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>Support: <strong className="text-foreground">{combo.support}%</strong></span>
            <span>Confidence: <strong className="text-foreground">{combo.confidence}%</strong></span>
          </div>
          <button className="mt-auto bg-primary text-primary-foreground text-sm font-bold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
            Create Combo Meal
          </button>
        </div>
      ))}
    </div>
  </section>
);
