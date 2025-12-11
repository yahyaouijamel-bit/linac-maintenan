import {
  Equipment,
  Ticket,
  Downtime,
  MaintenanceTask,
  WorkOrder,
  SparePart,
  Technician,
} from "@/types/cmms";

export const mockEquipments: Equipment[] = [
  {
    id: "eq-001",
    name: "Linac Elekta Versa HD",
    model: "Versa HD",
    serialNumber: "VHD-2023-001",
    commissioningDate: "2023-03-15",
    status: "Opérationnel",
  },
  {
    id: "eq-002",
    name: "Linac Elekta Infinity",
    model: "Infinity",
    serialNumber: "INF-2022-045",
    commissioningDate: "2022-08-20",
    status: "Opérationnel",
  },
  {
    id: "eq-003",
    name: "Linac Elekta Synergy",
    model: "Synergy",
    serialNumber: "SYN-2021-012",
    commissioningDate: "2021-01-10",
    status: "En Maintenance",
  },
  {
    id: "eq-004",
    name: "Linac Elekta Axesse",
    model: "Axesse",
    serialNumber: "AXS-2020-008",
    commissioningDate: "2020-06-25",
    status: "En Panne",
  },
];

export const mockTickets: Ticket[] = [
  {
    id: "tk-001",
    number: "TK-2024-001",
    subject: "Erreur de calibration MLC",
    description: "Le système MLC affiche une erreur de calibration lors du démarrage.",
    equipmentId: "eq-001",
    openedDate: "2024-12-08",
    priority: "Haute",
    status: "Ouvert",
  },
  {
    id: "tk-002",
    number: "TK-2024-002",
    subject: "Bruit anormal du gantry",
    description: "Un bruit inhabituel est détecté lors de la rotation du gantry.",
    equipmentId: "eq-002",
    openedDate: "2024-12-07",
    priority: "Moyenne",
    status: "En cours",
  },
  {
    id: "tk-003",
    number: "TK-2024-003",
    subject: "Mise à jour logicielle requise",
    description: "Installation de la mise à jour de sécurité v4.2.1 requise.",
    equipmentId: "eq-003",
    openedDate: "2024-12-05",
    priority: "Basse",
    status: "Résolu",
  },
];

export const mockDowntimes: Downtime[] = [
  {
    id: "dt-001",
    equipmentId: "eq-004",
    reason: "Panne du modulateur haute tension",
    startDate: "2024-12-06T08:30:00",
    status: "En cours",
  },
  {
    id: "dt-002",
    equipmentId: "eq-003",
    reason: "Maintenance préventive planifiée",
    startDate: "2024-12-09T07:00:00",
    endDate: "2024-12-09T12:00:00",
    status: "Résolu",
  },
];

export const mockMaintenanceTasks: MaintenanceTask[] = [
  {
    id: "mt-001",
    task: "Calibration mensuelle du faisceau",
    equipmentId: "eq-001",
    dueDate: "2024-12-15",
    status: "Planifié",
  },
  {
    id: "mt-002",
    task: "Vérification des interlocks de sécurité",
    equipmentId: "eq-002",
    dueDate: "2024-12-10",
    status: "Planifié",
  },
  {
    id: "mt-003",
    task: "Nettoyage des filtres de refroidissement",
    equipmentId: "eq-001",
    dueDate: "2024-12-05",
    status: "En retard",
  },
  {
    id: "mt-004",
    task: "Test de dosimétrie hebdomadaire",
    equipmentId: "eq-002",
    dueDate: "2024-12-01",
    status: "Terminé",
  },
];

export const mockWorkOrders: WorkOrder[] = [
  {
    id: "wo-001",
    equipmentId: "eq-004",
    description: "Remplacement du modulateur haute tension",
    technicianId: "tech-001",
    priority: "Haute",
    status: "En cours",
    createdDate: "2024-12-06",
  },
  {
    id: "wo-002",
    equipmentId: "eq-003",
    description: "Maintenance préventive trimestrielle",
    technicianId: "tech-002",
    priority: "Moyenne",
    status: "Ouvert",
    createdDate: "2024-12-08",
  },
];

export const mockSpareParts: SparePart[] = [
  {
    id: "sp-001",
    name: "Modulateur haute tension",
    location: "Magasin A - Étagère 3",
    acquisitionDate: "2024-01-15",
    quantity: 2,
  },
  {
    id: "sp-002",
    name: "Lame MLC",
    location: "Magasin A - Étagère 5",
    acquisitionDate: "2023-11-20",
    quantity: 10,
  },
  {
    id: "sp-003",
    name: "Filtre de refroidissement",
    location: "Magasin B - Étagère 1",
    acquisitionDate: "2024-06-10",
    quantity: 15,
  },
];

export const mockTechnicians: Technician[] = [
  {
    id: "tech-001",
    name: "Jean-Pierre Martin",
    email: "jp.martin@hopital.fr",
    phone: "+33 1 23 45 67 89",
    specialization: "Électronique haute tension",
  },
  {
    id: "tech-002",
    name: "Sophie Dubois",
    email: "s.dubois@hopital.fr",
    phone: "+33 1 23 45 67 90",
    specialization: "Mécanique de précision",
  },
  {
    id: "tech-003",
    name: "Marc Lefebvre",
    email: "m.lefebvre@hopital.fr",
    phone: "+33 1 23 45 67 91",
    specialization: "Logiciel et calibration",
  },
];
