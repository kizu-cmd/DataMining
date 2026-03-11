import { Activity, TrendingUp, Clock, ChevronRight, Download } from "lucide-react";
import { useAnalysis } from "@/context/AnalysisContext";
import { exportFullReport } from "@/lib/export-utils";
import jollibeeLogo from "@/assets/jollibee-logo.png";

export const DashboardHeader = () => {
  const { totalTransactions, patternsDiscovered, lastUpdated, associationRules, trendingCombos } = useAnalysis();
  const hasData = totalTransactions > 0;

  const metrics = [
    { label: "Total Transactions", value: hasData ? totalTransactions.toLocaleString() : "—", emoji: "📊", gradient: "from-primary/10 to-primary/5" },
    { label: "Patterns Discovered", value: hasData ? patternsDiscovered.toString() : "—", emoji: "🔍", gradient: "from-accent/15 to-accent/5" },
    { label: "Last Updated", value: lastUpdated || "No data yet", emoji: "🕐", gradient: "from-muted to-muted/50" },
  ];

  return (
    <header className="mb-10">
      <div className="promo-banner mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative z-10 flex items-center gap-4 flex-1">
          <div className="bg-white rounded-xl p-2 shadow-md">
            <img src={jollibeeLogo} alt="Jollibee" className="h-8 sm:h-10 object-contain" />
          </div>
          <div className="text-primary-foreground">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
              Market Basket Intelligence
            </h1>
            <p className="text-primary-foreground/80 text-sm font-medium mt-0.5 flex items-center gap-1">
              Smart Insights from Customer Orders <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2">
          {hasData && (
            <button
              onClick={() => exportFullReport(associationRules, trendingCombos, totalTransactions, patternsDiscovered)}
              className="bg-primary-foreground/15 backdrop-blur-sm text-primary-foreground text-xs font-bold py-2 px-4 rounded-xl hover:bg-primary-foreground/25 transition-all flex items-center gap-2 border border-primary-foreground/20"
            >
              <Download className="w-3.5 h-3.5" /> Export Report
            </button>
          )}
          <span className="text-5xl opacity-20 hidden sm:block">🍗🍟🥤</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className={`kiosk-card p-5 flex items-center gap-4 bg-gradient-to-br ${m.gradient}`}>
            <div className="food-icon shrink-0">
              <span>{m.emoji}</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{m.label}</p>
              <p className="text-xl font-extrabold mt-0.5">{m.value}</p>
            </div>
          </div>
        ))}
      </div>
    </header>
  );
};
