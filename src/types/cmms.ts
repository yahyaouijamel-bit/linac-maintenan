// Equipment types
export type EquipmentStatus = "Opérationnel" | "En Maintenance" | "En Panne";

export interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  commissioningDate: string;
  status: EquipmentStatus;
}

// Ticket types
export type TicketPriority = "Haute" | "Moyenne" | "Basse";
export type TicketStatus = "Ouvert" | "En cours" | "Résolu";

export interface Ticket {
  id: string;
  number: string;
  subject: string;
  description: string;
  equipmentId: string;
  openedDate: string;
  priority: TicketPriority;
  status: TicketStatus;
}

// Downtime types
export type DowntimeStatus = "En cours" | "Résolu";

export interface Downtime {
  id: string;
  equipmentId: string;
  reason: string;
  startDate: string;
  endDate?: string;
  status: DowntimeStatus;
}

// Maintenance types
export type MaintenanceStatus = "Planifié" | "Terminé" | "En retard";

export interface MaintenanceTask {
  id: string;
  task: string;
  equipmentId: string;
  dueDate: string;
  status: MaintenanceStatus;
}

// Work Order types
export type WorkOrderStatus = "Ouvert" | "En cours" | "Fermé";

export interface WorkOrder {
  id: string;
  equipmentId: string;
  description: string;
  technicianId: string;
  priority: TicketPriority;
  status: WorkOrderStatus;
  createdDate: string;
}

// Spare Parts types
export interface SparePart {
  id: string;
  name: string;
  location: string;
  acquisitionDate: string;
  installationDate?: string;
  quantity: number;
}

// Technician types
export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
}
