import { NavLink as RouterNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MonitorCog,
  Ticket,
  AlertTriangle,
  Wrench,
  ClipboardList,
  Package,
  Users,
  Radiation,
} from "lucide-react";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => (
  <RouterNavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
          : "text-sidebar-foreground"
      )
    }
  >
    {icon}
    <span>{label}</span>
  </RouterNavLink>
);

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sidebar-primary">
          <Radiation className="w-6 h-6 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-accent-foreground">
            Linac CMMS
          </h1>
          <p className="text-xs text-sidebar-foreground/60">
            Gestion de Maintenance
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4">
        <NavItem
          to="/"
          icon={<LayoutDashboard className="w-5 h-5" />}
          label="Tableau de Bord"
        />
        <NavItem
          to="/equipments"
          icon={<MonitorCog className="w-5 h-5" />}
          label="Équipements"
        />
        <NavItem
          to="/tickets"
          icon={<Ticket className="w-5 h-5" />}
          label="Tickets / Incidents"
        />
        <NavItem
          to="/downtimes"
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Arrêts Machine"
        />
        <NavItem
          to="/maintenance"
          icon={<Wrench className="w-5 h-5" />}
          label="Maintenance Préventive"
        />
        <NavItem
          to="/work-orders"
          icon={<ClipboardList className="w-5 h-5" />}
          label="Bons de Travail"
        />
        <NavItem
          to="/spare-parts"
          icon={<Package className="w-5 h-5" />}
          label="Pièces Détachées"
        />
        <NavItem
          to="/technicians"
          icon={<Users className="w-5 h-5" />}
          label="Techniciens"
        />
      </nav>
    </aside>
  );
};
