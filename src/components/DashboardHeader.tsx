import { Activity, TrendingUp, Clock, ChevronRight } from "lucide-react";
import jollibeeLogo from "@/assets/jollibee-logo.png";

const metrics = [
  { label: "Total Transactions", value: "—", icon: Activity, emoji: "📊", gradient: "from-primary/10 to-primary/5" },
  { label: "Patterns Discovered", value: "—", icon: TrendingUp, emoji: "🔍", gradient: "from-accent/15 to-accent/5" },
  { label: "Last Updated", value: "No data yet", icon: Clock, emoji: "🕐", gradient: "from-muted to-muted/50" },
];

export const DashboardHeader = () => (
  <header className="mb-10">
    {/* Top banner bar */}
    <div className="promo-banner mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="relative z-10 flex items-center gap-4 flex-1">
        <img src={jollibeeLogo} alt="Jollibee" className="h-12 sm:h-14 object-contain drop-shadow-lg" />
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
        <span className="text-5xl opacity-20 hidden sm:block">🍗🍟🥤</span>
      </div>
    </div>

    {/* Metric cards */}
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
