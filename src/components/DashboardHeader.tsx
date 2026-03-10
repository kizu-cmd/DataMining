import { Activity, TrendingUp, Clock } from "lucide-react";

const metrics = [
  { label: "Total Transactions", value: "—", icon: Activity, color: "text-primary" },
  { label: "Patterns Discovered", value: "—", icon: TrendingUp, color: "text-accent" },
  { label: "Last Updated", value: "No data yet", icon: Clock, color: "text-muted-foreground" },
];

export const DashboardHeader = () => (
  <header className="mb-8">
    <div className="flex items-center gap-3 mb-1">
      <span className="text-4xl">🐝</span>
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-primary">
          Jollibee Market Basket Intelligence Dashboard
        </h1>
        <p className="text-muted-foreground text-sm font-medium">Smart Insights from Customer Orders</p>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
      {metrics.map((m) => (
        <div key={m.label} className="bg-card rounded-lg border p-4 flex items-center gap-3 shadow-sm">
          <m.icon className={`w-5 h-5 ${m.color}`} />
          <div>
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className="text-lg font-bold">{m.value}</p>
          </div>
        </div>
      ))}
    </div>
  </header>
);
