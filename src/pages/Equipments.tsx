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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Download, Pencil, Trash2, Loader2 } from "lucide-react";
import { useEquipments, Equipment } from "@/hooks/useEquipments";
import { toast } from "@/hooks/use-toast";

type EquipmentStatus = Equipment['status'];

const Equipments = () => {
  const { equipments, isLoading, addEquipment, updateEquipment, deleteEquipment } = useEquipments();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    serialNumber: "",
    commissioningDate: "",
    status: "Opérationnel" as EquipmentStatus,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      model: "",
      serialNumber: "",
      commissioningDate: "",
      status: "Opérationnel",
    });
  };

  const handleAdd = () => {
    addEquipment(formData);
    setIsAddOpen(false);
    resetForm();
    toast({
      title: "Équipement ajouté",
      description: `${formData.name} a été ajouté avec succès.`,
    });
  };

  const handleEdit = () => {
    if (!currentEquipment) return;
    updateEquipment(currentEquipment.id, formData);
    setIsEditOpen(false);
    setCurrentEquipment(null);
    resetForm();
    toast({
      title: "Équipement modifié",
      description: `Les informations ont été mises à jour.`,
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteEquipment(deleteId);
    setDeleteId(null);
    toast({
      title: "Équipement supprimé",
      description: "L'équipement a été supprimé avec succès.",
    });
  };

  const openEdit = (equipment: Equipment) => {
    setCurrentEquipment(equipment);
    setFormData({
      name: equipment.name,
      model: equipment.model,
      serialNumber: equipment.serialNumber,
      commissioningDate: equipment.commissioningDate,
      status: equipment.status,
    });
    setIsEditOpen(true);
  };

  const exportToCSV = () => {
    const headers = ["Nom", "Modèle", "N° Série", "Date Mise en Service", "Statut"];
    const rows = equipments.map((eq) => [
      eq.name,
      eq.model,
      eq.serialNumber,
      eq.commissioningDate,
      eq.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "equipements.csv";
    link.click();
    toast({
      title: "Export réussi",
      description: "Le fichier CSV a été téléchargé.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const EquipmentForm = ({ onSubmit }: { onSubmit: () => void }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom de l'équipement</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Linac Elekta Versa HD"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="model">Modèle</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="Versa HD"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serial">Numéro de série</Label>
          <Input
            id="serial"
            value={formData.serialNumber}
            onChange={(e) =>
              setFormData({ ...formData, serialNumber: e.target.value })
            }
            placeholder="VHD-2023-001"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date de mise en service</Label>
          <Input
            id="date"
            type="date"
            value={formData.commissioningDate}
            onChange={(e) =>
              setFormData({ ...formData, commissioningDate: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Statut</Label>
          <Select
            value={formData.status}
            onValueChange={(value: EquipmentStatus) =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Opérationnel">Opérationnel</SelectItem>
              <SelectItem value="En Maintenance">En Maintenance</SelectItem>
              <SelectItem value="En Panne">En Panne</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" onClick={onSubmit}>Enregistrer</Button>
      </DialogFooter>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Gestion des Équipements"
        description="Inventaire complet du parc machine"
      >
        <Button variant="outline" className="gap-2" onClick={exportToCSV}>
          <Download className="w-4 h-4" />
          Exporter CSV
        </Button>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={resetForm}>
              <Plus className="w-4 h-4" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un équipement</DialogTitle>
              <DialogDescription>
                Remplissez les informations du nouvel équipement.
              </DialogDescription>
            </DialogHeader>
            <EquipmentForm onSubmit={handleAdd} />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Modèle</TableHead>
                <TableHead>N° Série</TableHead>
                <TableHead>Mise en Service</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipments.map((equipment) => (
                <TableRow key={equipment.id}>
                  <TableCell className="font-medium">{equipment.name}</TableCell>
                  <TableCell>{equipment.model}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {equipment.serialNumber}
                  </TableCell>
                  <TableCell>
                    {new Date(equipment.commissioningDate).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={equipment.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(equipment)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(equipment.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'équipement</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'équipement.
            </DialogDescription>
          </DialogHeader>
          <EquipmentForm onSubmit={handleEdit} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet équipement ? Cette action est
              irréversible.
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

export default Equipments;
