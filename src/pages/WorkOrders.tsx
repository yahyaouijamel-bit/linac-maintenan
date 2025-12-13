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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useWorkOrders, WorkOrder } from "@/hooks/useWorkOrders";
import { useEquipments } from "@/hooks/useEquipments";
import { useTechnicians } from "@/hooks/useTechnicians";
import { toast } from "@/hooks/use-toast";

type WorkOrderStatus = WorkOrder['status'];
type Priority = WorkOrder['priority'];

const WorkOrders = () => {
  const { workOrders, isLoading: woLoading, addWorkOrder, updateStatus, deleteWorkOrder, updateWorkOrder } = useWorkOrders();
  const { equipments, isLoading: eqLoading } = useEquipments();
  const { technicians, isLoading: techLoading } = useTechnicians();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentWorkOrder, setCurrentWorkOrder] = useState<WorkOrder | null>(null);
  const [formData, setFormData] = useState({
    equipmentId: "",
    description: "",
    technicianId: "",
    priority: "Moyenne" as Priority,
  });

  const isLoading = woLoading || eqLoading || techLoading;

  const resetForm = () => {
    setFormData({
      equipmentId: "",
      description: "",
      technicianId: "",
      priority: "Moyenne",
    });
  };

  const handleAdd = () => {
    addWorkOrder(formData);
    setIsAddOpen(false);
    resetForm();
    toast({
      title: "Bon de travail créé",
      description: "Le bon de travail a été créé avec succès.",
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteWorkOrder(deleteId);
    setDeleteId(null);
    toast({
      title: "Bon de travail supprimé",
      description: "Le bon de travail a été supprimé.",
    });
  };

  const handleUpdateStatus = (id: string, newStatus: WorkOrderStatus) => {
    updateStatus(id, newStatus);
    toast({
      title: "Statut mis à jour",
      description: `Le bon de travail a été marqué comme "${newStatus}".`,
    });
  };

  const handleEdit = () => {
    if (!currentWorkOrder) return;
    updateWorkOrder(currentWorkOrder.id, formData);
    setIsEditOpen(false);
    setCurrentWorkOrder(null);
    resetForm();
    toast({
      title: "Bon de travail modifié",
      description: "Les informations ont été mises à jour.",
    });
  };

  const openEdit = (wo: WorkOrder) => {
    setCurrentWorkOrder(wo);
    setFormData({
      equipmentId: wo.equipmentId,
      description: wo.description,
      technicianId: wo.technicianId,
      priority: wo.priority,
    });
    setIsEditOpen(true);
  };

  const getEquipmentName = (id: string) => {
    return equipments.find((e) => e.id === id)?.name || "Inconnu";
  };

  const getTechnicianName = (id: string) => {
    return technicians.find((t) => t.id === id)?.name || "Non assigné";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
                    {equipments.map((eq) => (
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
                      {technicians.map((tech) => (
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
                    onValueChange={(value: Priority) =>
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
                <Button type="button" onClick={handleAdd}>Créer</Button>
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
                        handleUpdateStatus(wo.id, value)
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
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(wo)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(wo.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
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

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le bon de travail</DialogTitle>
            <DialogDescription>
              Modifiez les informations du bon de travail.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-equipment">Équipement</Label>
              <Select
                value={formData.equipmentId}
                onValueChange={(value) =>
                  setFormData({ ...formData, equipmentId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="edit-description">Description des travaux</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-technician">Technicien</Label>
                <Select
                  value={formData.technicianId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, technicianId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priorité</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: Priority) =>
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
              <Button type="button" onClick={handleEdit}>Enregistrer</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkOrders;
