import { useState } from "react";
import { useAnalysis } from "@/context/AnalysisContext";
import { Sparkles } from "lucide-react";
import { apiEnabled, createCombo } from "@/lib/api";
import { toast } from "sonner";

export const AIComboCreator = () => {
  const { aiRecommendedCombo: combo } = useAnalysis();
  const [isCreating, setIsCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const handleLaunch = async () => {
    if (!combo || isCreating || created) return;
    setIsCreating(true);
    try {
      if (apiEnabled()) {
        await createCombo({
          items: combo.items,
          support: combo.support,
          confidence: combo.confidence,
          source: "ai",
        });
      }
      setCreated(true);
      toast.success(`Combo launched: ${combo.items.join(" + ")}`);
    } catch (err) {
      toast.error("Failed to launch combo. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section className="mb-10">
      <div className="kiosk-section-title">
        <h2>✨ AI Combo Meal Creator</h2>
      </div>
      {!combo ? (
        <div className="kiosk-empty">
          <span className="text-5xl block mb-3 animate-float">🤖</span>
          <p className="text-sm font-medium">AI engine is waiting for data</p>
          <p className="text-xs mt-1">Upload transaction data to generate smart combo recommendations</p>
        </div>
      ) : (
        <div
          onClick={handleLaunch}
          className={`promo-banner text-primary-foreground ${
            created || isCreating ? "cursor-default" : "cursor-pointer"
          }`}
        >
          <div className="absolute top-3 right-4 text-5xl opacity-15 animate-float z-0">🍗</div>
          <div className="absolute bottom-3 right-20 text-4xl opacity-10 animate-float z-0" style={{ animationDelay: "1s" }}>🍝</div>
          <div className="absolute top-6 right-24 text-3xl opacity-10 animate-float z-0" style={{ animationDelay: "2s" }}>🥤</div>

          <div className="relative z-10">
            <div className="kiosk-badge bg-accent text-accent-foreground mb-3">
              <Sparkles className="w-3 h-3" /> AI RECOMMENDED
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-1">
              {combo.items.join(" + ")}
            </h3>
            <p className="text-sm opacity-80 mb-6">Strongest association pattern in customer order data</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Support", value: `${combo.support}%`, emoji: "📊" },
                { label: "Confidence", value: `${combo.confidence}%`, emoji: "🎯" },
                { label: "Lift", value: `${combo.lift}`, emoji: "📈" },
                { label: "Est. Sales ↑", value: `+${combo.estimatedSalesIncrease}%`, emoji: "💰" },
              ].map((m) => (
                <div key={m.label} className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-3 border border-primary-foreground/10">
                  <span className="text-lg block mb-1">{m.emoji}</span>
                  <p className="text-xs opacity-70 font-medium">{m.label}</p>
                  <p className="text-xl font-black">{m.value}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleLaunch();
              }}
              disabled={isCreating || created}
              className={`bg-accent text-accent-foreground font-extrabold py-3 px-8 rounded-xl transition-all hover:shadow-lg text-sm inline-flex items-center gap-2 ${
                created
                  ? "opacity-80 cursor-default"
                  : "hover:bg-accent/90"
              }`}
            >
              {created ? "Combo Launched" : isCreating ? "Launching..." : "🚀 Launch This Combo"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
