import { networkNodes, networkEdges } from "@/data/dashboard-data";
import { Share2 } from "lucide-react";

export const ItemNetwork = () => (
  <section className="mb-10">
    <div className="flex items-center gap-2 mb-4">
      <Share2 className="w-5 h-5 text-primary" />
      <h2 className="text-xl font-bold">Item Relationship Network</h2>
    </div>
    {networkNodes.length === 0 ? (
      <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">
        <Share2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No relationship data yet. Upload transaction data to visualize item connections.</p>
      </div>
    ) : (
      <div className="bg-card border rounded-xl p-4 shadow-sm overflow-x-auto">
        <svg viewBox="0 0 620 420" className="w-full h-auto min-w-[500px]">
          {networkEdges.map((e, i) => {
            const s = networkNodes.find((n) => n.id === e.source)!;
            const t = networkNodes.find((n) => n.id === e.target)!;
            return (
              <line
                key={i}
                x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                stroke="hsl(351 79% 49%)"
                strokeWidth={e.weight * 1.2}
                strokeOpacity={0.25 + e.weight * 0.1}
              />
            );
          })}
          {networkNodes.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={26} fill="hsl(0 0% 100%)" stroke="hsl(351 79% 49%)" strokeWidth={2} />
              <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="16">{n.label.split(" ")[0]}</text>
              <text x={n.x} y={n.y + 40} textAnchor="middle" fontSize="10" fill="hsl(0 0% 45%)" fontWeight="600">
                {n.label.split(" ").slice(1).join(" ")}
              </text>
            </g>
          ))}
        </svg>
      </div>
    )}
  </section>
);
