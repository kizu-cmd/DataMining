import { NavLink } from "@/components/NavLink";
import { BarChart3, MonitorSmartphone } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center h-14 gap-6">
        {/* Jollibee-themed text mark */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xl">🍗</span>
          <span className="text-base font-extrabold tracking-tight">
            <span className="text-primary">Market</span>
            <span className="text-accent-foreground">Basket</span>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <NavLink
            to="/"
            end
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            activeClassName="bg-primary/10 text-primary"
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </NavLink>
          <NavLink
            to="/kiosk"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            activeClassName="bg-primary/10 text-primary"
          >
            <MonitorSmartphone className="w-4 h-4" />
            Self-Order Kiosk
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
