import { topCombinations } from "@/data/dashboard-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart3 } from "lucide-react";

export const TopCombinationsChart = () => (
  <section className="mb-10">
    <div className="flex items-center gap-2 mb-4">
      <BarChart3 className="w-5 h-5 text-primary" />
      <h2 className="text-xl font-bold">Top Item Combinations</h2>
    </div>
    <div className="bg-card border rounded-xl p-5 shadow-sm">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={topCombinations} layout="vertical" margin={{ left: 120, right: 20, top: 5, bottom: 5 }}>
          <XAxis type="number" domain={[0, 50]} tick={{ fontSize: 12 }} unit="%" />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={120} />
          <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 8, fontSize: 13 }} />
          <Bar dataKey="support" radius={[0, 6, 6, 0]}>
            {topCombinations.map((_, i) => (
              <Cell key={i} fill={i === 0 ? "hsl(351 79% 49%)" : "hsl(43 100% 58%)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </section>
);
