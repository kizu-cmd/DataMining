import { useState } from "react";
import { menuItems, upsellMap } from "@/data/dashboard-data";
import { ShoppingCart, Plus } from "lucide-react";

export const SmartUpsell = () => {
  const [selected, setSelected] = useState("");
  const suggestions = selected ? upsellMap[selected] || [] : [];
  const hasItems = menuItems.length > 0;

  return (
    <section className="mb-10">
      <div className="kiosk-section-title">
        <div className="bg-primary/10 p-2 rounded-xl">
          <ShoppingCart className="w-5 h-5 text-primary" />
        </div>
        <h2>🛒 Smart Upsell Predictor</h2>
      </div>
      <div className="kiosk-card p-6">
        {!hasItems ? (
          <div className="text-center py-6">
            <span className="text-5xl block mb-3">🖥️</span>
            <p className="text-sm font-medium text-muted-foreground">POS simulator is waiting for data</p>
            <p className="text-xs text-muted-foreground mt-1">Upload transaction data to enable the upsell predictor</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🖥️</span>
              <div>
                <p className="text-sm font-bold">Self-Order Kiosk Simulation</p>
                <p className="text-xs text-muted-foreground">Select a menu item to see AI add-on suggestions</p>
              </div>
            </div>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full sm:w-72 bg-background border-2 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
            >
              <option value="">🍽️ Tap to select a menu item…</option>
              {menuItems.filter((m) => upsellMap[m.id]).map((m) => (
                <option key={m.id} value={m.id}>{m.icon} {m.name}</option>
              ))}
            </select>

            {suggestions.length > 0 && (
              <>
                <p className="text-xs text-muted-foreground font-medium mt-5 mb-3 uppercase tracking-wide">
                  🤖 Suggested Add-ons
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {suggestions.map((s) => (
                    <div key={s.name} className="kiosk-card p-4 text-center flex flex-col items-center gap-2 group cursor-pointer">
                      <span className="text-4xl block group-hover:animate-float transition-transform">{s.icon}</span>
                      <p className="text-sm font-bold">{s.name}</p>
                      <span className="kiosk-badge bg-accent/15 text-accent-foreground">
                        {s.confidence}% match
                      </span>
                      <button className="w-full bg-accent text-accent-foreground text-xs font-extrabold py-2 px-3 rounded-lg hover:bg-accent/80 transition-all flex items-center justify-center gap-1">
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};
