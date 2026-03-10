import { networkNodes, networkEdges } from "@/data/dashboard-data";
import { Share2 } from "lucide-react";

export const ItemNetwork = () => (
  <section className="mb-10">
    <div className="kiosk-section-title">
      <div className="bg-primary/10 p-2 rounded-xl">
        <Share2 className="w-5 h-5 text-primary" />
      </div>
      <h2>🔗 Item Relationship Network</h2>
    </div>
    {networkNodes.length === 0 ? (
      <div className="kiosk-empty">
        <span className="text-5xl block mb-3">🕸️</span>
        <p className="text-sm font-medium">No relationship data yet</p>
        <p className="text-xs mt-1">Upload transaction data to visualize item connections</p>
      </div>
    ) : (
      <div className="kiosk-card p-5 overflow-x-auto">
        <svg viewBox="0 0 620 420" className="w-full h-auto min-w-[500px]">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* edges */}
          {networkEdges.map((e, i) => {
            const s = networkNodes.find((n) => n.id === e.source)!;
            const t = networkNodes.find((n) => n.id === e.target)!;
            return (
              <line
                key={i}
                x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                stroke="hsl(351 79% 49%)"
                strokeWidth={e.weight * 1.5}
                strokeOpacity={0.15 + e.weight * 0.1}
                strokeLinecap="round"
              />
            );
          })}
          {/* nodes */}
          {networkNodes.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={30} fill="hsl(0 0% 100%)" stroke="hsl(351 79% 49%)" strokeWidth={2.5} filter="url(#glow)" />
              <text x={n.x} y={n.y + 6} textAnchor="middle" fontSize="20">{n.label.split(" ")[0]}</text>
              <text x={n.x} y={n.y + 48} textAnchor="middle" fontSize="11" fill="hsl(0 0% 35%)" fontWeight="700">
                {n.label.split(" ").slice(1).join(" ")}
              </text>
            </g>
          ))}
        </svg>
      </div>
    )}
  </section>
);
