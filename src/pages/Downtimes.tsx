import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Clock, Loader2 } from "lucide-react";
import { useDowntimes, Downtime } from "@/hooks/useDowntimes";
import { useEquipments } from "@/hooks/useEquipments";
import { toast } from "@/hooks/use-toast";

const Downtimes = () => {
  const { downtimes, isLoading: dtLoading, addDowntime, resolveDowntime } = useDowntimes();
  const { equipments, isLoading: eqLoading } = useEquipments();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    equipmentId: "",
    reason: "",
    startDate: "",
  });

  const isLoading = dtLoading || eqLoading;

  const resetForm = () => {
    setFormData({
      equipmentId: "",
      reason: "",
      startDate: "",
    });
  };

  const handleAdd = () => {
    addDowntime(formData);
    setIsAddOpen(false);
    resetForm();
    toast({
      title: "Arrêt enregistré",
      description: "L'arrêt machine a été enregistré avec succès.",
    });
  };

  const handleResolve = (id: string) => {
    resolveDowntime(id);
    toast({
      title: "Arrêt résolu",
      description: "L'arrêt machine a été marqué comme résolu.",
    });
  };

  const getEquipmentName = (id: string) => {
    return equipments.find((e) => e.id === id)?.name || "Inconnu";
  };

  const calculateDuration = (start: string, end?: string) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const diffMs = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeDowntimes = downtimes.filter((dt) => dt.status === "En cours");
  const resolvedDowntimes = downtimes.filter((dt) => dt.status === "Résolu");

  const currentYear = new Date().getFullYear();
  const yearlyTotal = downtimes
    .filter((dt) => new Date(dt.startDate).getFullYear() === currentYear)
    .reduce((acc, dt) => {
      const start = new Date(dt.startDate);
      const end = dt.endDate ? new Date(dt.endDate) : new Date();
      return acc + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);

  const totalHours = Math.floor(yearlyTotal / 60);
  const totalMinutes = Math.round(yearlyTotal % 60);

  const DowntimeTable = ({ items }: { items: Downtime[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Équipement</TableHead>
          <TableHead>Raison</TableHead>
          <TableHead>Début</TableHead>
          <TableHead>Fin</TableHead>
          <TableHead>Durée</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((downtime) => (
          <TableRow key={downtime.id}>
            <TableCell className="font-medium">
              {getEquipmentName(downtime.equipmentId)}
            </TableCell>
            <TableCell>{downtime.reason}</TableCell>
            <TableCell>
              {new Date(downtime.startDate).toLocaleString("fr-FR")}
            </TableCell>
            <TableCell>
              {downtime.endDate
                ? new Date(downtime.endDate).toLocaleString("fr-FR")
                : "-"}
            </TableCell>
            <TableCell className="font-mono">
              {calculateDuration(downtime.startDate, downtime.endDate)}
            </TableCell>
            <TableCell>
              <StatusBadge status={downtime.status} />
            </TableCell>
            <TableCell className="text-right">
              {downtime.status === "En cours" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResolve(downtime.id)}
                >
                  Résoudre
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
        {items.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground">
              Aucun arrêt à afficher
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <>
      <PageHeader
        title="Arrêts Machine"
        description="Suivi des périodes d'indisponibilité"
      >
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={resetForm}>
              <Plus className="w-4 h-4" />
              Nouvel Arrêt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enregistrer un arrêt</DialogTitle>
              <DialogDescription>
                Enregistrez une nouvelle période d'indisponibilité.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="equipment">Équipement</Label>
                <Select
                  value={formData.equipmentId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, equipmentId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'équipement" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipments.map((eq) => (
                      <SelectItem key={eq.id} value={eq.id}>
                        {eq.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Raison de l'arrêt</Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="Décrivez la raison de l'arrêt"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Date et heure de début</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleAdd}>Enregistrer</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Récapitulatif {currentYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {totalHours}h {totalMinutes}m
            </span>
            <span className="text-muted-foreground">
              d'arrêt machine total
            </span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active" className="gap-2">
            En cours
            {activeDowntimes.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs">
                {activeDowntimes.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="resolved">Historique</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Card>
            <CardContent className="p-0">
              <DowntimeTable items={activeDowntimes} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resolved">
          <Card>
            <CardContent className="p-0">
              <DowntimeTable items={resolvedDowntimes} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Downtimes;
