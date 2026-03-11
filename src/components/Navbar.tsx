import { NavLink } from "@/components/NavLink";
import { BarChart3, MonitorSmartphone } from "lucide-react";
import jollibeeLogo from "@/assets/jollibee-logo.png";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-primary backdrop-blur-md border-b border-primary/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center h-14 gap-6">
        <img src={jollibeeLogo} alt="Jollibee" className="h-8 object-contain" />
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
