import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import {
  mockWorkOrders,
  mockEquipments,
  mockTechnicians,
} from "@/data/mockData";
import { WorkOrder, WorkOrderStatus, TicketPriority } from "@/types/cmms";
import { toast } from "@/hooks/use-toast";

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    equipmentId: "",
    description: "",
    technicianId: "",
    priority: "Moyenne" as TicketPriority,
  });

  const resetForm = () => {
    setFormData({
      equipmentId: "",
      description: "",
      technicianId: "",
      priority: "Moyenne",
    });
  };

  const handleAdd = () => {
    const newWorkOrder: WorkOrder = {
      id: `wo-${Date.now()}`,
      ...formData,
      status: "Ouvert",
      createdDate: new Date().toISOString().split("T")[0],
    };
    setWorkOrders([newWorkOrder, ...workOrders]);
    setIsAddOpen(false);
    resetForm();
    toast({
      title: "Bon de travail créé",
      description: "Le bon de travail a été créé avec succès.",
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setWorkOrders(workOrders.filter((wo) => wo.id !== deleteId));
    setDeleteId(null);
    toast({
      title: "Bon de travail supprimé",
      description: "Le bon de travail a été supprimé.",
    });
  };

  const updateStatus = (id: string, newStatus: WorkOrderStatus) => {
    setWorkOrders(
      workOrders.map((wo) =>
        wo.id === id ? { ...wo, status: newStatus } : wo
      )
    );
    toast({
      title: "Statut mis à jour",
      description: `Le bon de travail a été marqué comme "${newStatus}".`,
    });
  };

  const getEquipmentName = (id: string) => {
    return mockEquipments.find((e) => e.id === id)?.name || "Inconnu";
  };

  const getTechnicianName = (id: string) => {
    return mockTechnicians.find((t) => t.id === id)?.name || "Non assigné";
  };

  return (
    <>
      <PageHeader
        title="Bons de Travail"
        description="Gestion des interventions à réaliser"
      >
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={resetForm}>
              <Plus className="w-4 h-4" />
              Nouveau Bon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un bon de travail</DialogTitle>
              <DialogDescription>
                Créez un nouveau bon de travail pour une intervention.
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
                    {mockEquipments.map((eq) => (
                      <SelectItem key={eq.id} value={eq.id}>
                        {eq.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description des travaux</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Décrivez les travaux à effectuer..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="technician">Technicien</Label>
                  <Select
                    value={formData.technicianId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, technicianId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assigner" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTechnicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priorité</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: TicketPriority) =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Haute">Haute</SelectItem>
                      <SelectItem value="Moyenne">Moyenne</SelectItem>
                      <SelectItem value="Basse">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAdd}>Créer</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Équipement</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Technicien</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders.map((wo) => (
                <TableRow key={wo.id}>
                  <TableCell className="font-medium">
                    {getEquipmentName(wo.equipmentId)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {wo.description}
                  </TableCell>
                  <TableCell>{getTechnicianName(wo.technicianId)}</TableCell>
                  <TableCell>
                    <StatusBadge status={wo.priority} />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={wo.status}
                      onValueChange={(value: WorkOrderStatus) =>
                        updateStatus(wo.id, value)
                      }
                    >
                      <SelectTrigger className="w-28 h-8">
                        <StatusBadge status={wo.status} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ouvert">Ouvert</SelectItem>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Fermé">Fermé</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(wo.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {workOrders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    Aucun bon de travail
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce bon de travail ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WorkOrders;
