import { PageHeader } from "@/components/ui/PageHeader";
import { KPICard } from "@/components/ui/KPICard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MonitorCog,
  AlertOctagon,
  ClipboardList,
  Clock,
  Wrench,
  Calendar,
  Download,
  ChevronRight,
} from "lucide-react";
import {
  mockEquipments,
  mockTickets,
  mockMaintenanceTasks,
  mockDowntimes,
} from "@/data/mockData";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const totalEquipments = mockEquipments.length;
  const downEquipments = mockEquipments.filter(
    (e) => e.status === "En Panne"
  ).length;
  const openTickets = mockTickets.filter((t) => t.status !== "Résolu").length;
  const highPriorityTickets = mockTickets.filter(
    (t) => t.priority === "Haute" && t.status !== "Résolu"
  ).length;
  const plannedMaintenance = mockMaintenanceTasks.filter(
    (m) => m.status === "Planifié"
  ).length;
  const overdueMaintenance = mockMaintenanceTasks.filter(
    (m) => m.status === "En retard"
  ).length;

  // Calculate total downtime for the year
  const calculateTotalDowntime = () => {
    let totalMinutes = 0;
    mockDowntimes.forEach((dt) => {
      const start = new Date(dt.startDate);
      const end = dt.endDate ? new Date(dt.endDate) : new Date();
      totalMinutes += (end.getTime() - start.getTime()) / (1000 * 60);
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    return `${hours}h ${minutes}m`;
  };

  const upcomingMaintenance = mockMaintenanceTasks
    .filter((m) => m.status !== "Terminé")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const recentTickets = mockTickets
    .filter((t) => t.status !== "Résolu")
    .sort(
      (a, b) =>
        new Date(b.openedDate).getTime() - new Date(a.openedDate).getTime()
    )
    .slice(0, 5);

  const getEquipmentName = (id: string) => {
    return mockEquipments.find((e) => e.id === id)?.name || "Inconnu";
  };

  return (
    <>
      <PageHeader
        title="Tableau de Bord"
        description="Vue d'ensemble de l'état du parc machine"
      >
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Exporter Archive
        </Button>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <KPICard
          title="Équipements Totaux"
          value={totalEquipments}
          subtitle={`${downEquipments} en panne`}
          icon={MonitorCog}
          variant={downEquipments > 0 ? "danger" : "success"}
        />
        <KPICard
          title="Tickets Ouverts"
          value={openTickets}
          subtitle={`${highPriorityTickets} haute priorité`}
          icon={AlertOctagon}
          variant={highPriorityTickets > 0 ? "danger" : "default"}
        />
        <KPICard
          title="Maintenance Planifiée"
          value={plannedMaintenance}
          subtitle={`${overdueMaintenance} en retard`}
          icon={Wrench}
          variant={overdueMaintenance > 0 ? "warning" : "success"}
        />
        <KPICard
          title="Arrêts Machine (Année)"
          value={calculateTotalDowntime()}
          subtitle="Durée totale d'indisponibilité"
          icon={Clock}
        />
      </div>

      {/* Quick Views */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Maintenance */}
        <Card className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Prochaines Maintenances
            </CardTitle>
            <Link to="/maintenance">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Voir tout
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {upcomingMaintenance.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{task.task}</p>
                    <p className="text-xs text-muted-foreground">
                      {getEquipmentName(task.equipmentId)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                    </span>
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              ))}
              {upcomingMaintenance.length === 0 && (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  Aucune maintenance planifiée
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        <Card className="animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Derniers Tickets Ouverts
            </CardTitle>
            <Link to="/tickets">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Voir tout
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        {ticket.number}
                      </span>
                      <StatusBadge status={ticket.priority} />
                    </div>
                    <p className="text-sm font-medium">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {getEquipmentName(ticket.equipmentId)}
                    </p>
                  </div>
                  <StatusBadge status={ticket.status} />
                </div>
              ))}
              {recentTickets.length === 0 && (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  Aucun ticket ouvert
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
