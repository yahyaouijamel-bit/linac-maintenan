import { cn } from "@/lib/utils";
import { EquipmentStatus, TicketPriority, TicketStatus, MaintenanceStatus } from "@/types/cmms";

type StatusType = EquipmentStatus | TicketPriority | TicketStatus | MaintenanceStatus | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const getStatusClass = (status: StatusType): string => {
  switch (status) {
    // Equipment Status
    case "Opérationnel":
    case "Résolu":
    case "Terminé":
    case "Fermé":
      return "status-operational";
    case "En Maintenance":
    case "En cours":
    case "Planifié":
      return "status-maintenance";
    case "En Panne":
    case "Ouvert":
    case "En retard":
      return "status-down";
    // Priority
    case "Haute":
      return "priority-high";
    case "Moyenne":
      return "priority-medium";
    case "Basse":
      return "priority-low";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span className={cn("status-badge", getStatusClass(status), className)}>
      {status}
    </span>
  );
};
