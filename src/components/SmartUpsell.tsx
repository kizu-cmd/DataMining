import { useState } from "react";
import { menuItems, upsellMap } from "@/data/dashboard-data";
import { ShoppingCart } from "lucide-react";

export const SmartUpsell = () => {
  const [selected, setSelected] = useState("");
  const suggestions = selected ? upsellMap[selected] || [] : [];
  const hasItems = menuItems.length > 0;

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">Smart Upsell Predictor</h2>
      </div>
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        {!hasItems ? (
          <div className="text-center text-muted-foreground py-4">
            <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Upload transaction data to enable the upsell predictor.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-3">Simulate a POS order — select a menu item to see AI-powered add-on suggestions:</p>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full sm:w-64 bg-background border rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a menu item…</option>
              {menuItems.filter((m) => upsellMap[m.id]).map((m) => (
                <option key={m.id} value={m.id}>{m.icon} {m.name}</option>
              ))}
            </select>

            {suggestions.length > 0 && (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {suggestions.map((s) => (
                  <div key={s.name} className="bg-background border rounded-lg p-4 text-center flex flex-col items-center gap-2">
                    <span className="text-3xl">{s.icon}</span>
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.confidence}% match</p>
                    <button className="bg-accent text-accent-foreground text-xs font-bold py-1.5 px-3 rounded-md hover:bg-accent/80 transition-colors">
                      Add Suggestion
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
