import { NavLink } from "@/components/NavLink";
import { BarChart3, MonitorSmartphone } from "lucide-react";
import jollibeeImg from "@/assets/jollibee-mascot.png";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50">
      <div className="h-[3px] bg-gradient-to-r from-primary via-accent to-primary" />
      <div className="bg-card/95 backdrop-blur-md border-b border-primary/10 relative overflow-hidden">
        <img src={jollibeeImg} alt="" className="absolute right-2 -bottom-2 h-16 opacity-10 pointer-events-none select-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-end h-14 relative z-10">
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
      </div>
    </nav>
  );
}
