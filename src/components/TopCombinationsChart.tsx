import { topCombinations } from "@/data/dashboard-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart3 } from "lucide-react";

export const TopCombinationsChart = () => (
  <section className="mb-10">
    <div className="kiosk-section-title">
      <div className="bg-accent/20 p-2 rounded-xl">
        <BarChart3 className="w-5 h-5 text-accent-foreground" />
      </div>
      <h2>📊 Top Item Combinations</h2>
    </div>
    {topCombinations.length === 0 ? (
      <div className="kiosk-empty">
        <span className="text-5xl block mb-3">📈</span>
        <p className="text-sm font-medium">No chart data yet</p>
        <p className="text-xs mt-1">Upload transaction data to see top combinations ranked by support</p>
      </div>
    ) : (
      <div className="kiosk-card p-6">
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={topCombinations} layout="vertical" margin={{ left: 130, right: 24, top: 5, bottom: 5 }}>
            <XAxis type="number" domain={[0, 50]} tick={{ fontSize: 12, fill: 'hsl(0 0% 45%)' }} unit="%" />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fontWeight: 600 }} width={130} />
            <Tooltip
              formatter={(v: number) => [`${v}%`, 'Support']}
              contentStyle={{ borderRadius: 12, fontSize: 13, border: '1px solid hsl(0 0% 88%)', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="support" radius={[0, 8, 8, 0]} barSize={28}>
              {topCombinations.map((_, i) => (
                <Cell key={i} fill={i === 0 ? "hsl(351 79% 49%)" : i < 3 ? "hsl(351 79% 65%)" : "hsl(43 100% 58%)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}
  </section>
);
