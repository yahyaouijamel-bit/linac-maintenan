import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useSpareParts, SparePart } from "@/hooks/useSpareParts";
import { toast } from "@/hooks/use-toast";

const SpareParts = () => {
  const { parts, isLoading, addPart, updatePart, deletePart } = useSpareParts();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPart, setCurrentPart] = useState<SparePart | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    partNumber: "",
    location: "",
    acquisitionDate: "",
    installationDate: "",
    quantity: 1,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      partNumber: "",
      location: "",
      acquisitionDate: "",
      installationDate: "",
      quantity: 1,
    });
  };

  const handleAdd = () => {
    addPart(formData);
    setIsAddOpen(false);
    resetForm();
    toast({
      title: "Pièce ajoutée",
      description: `${formData.name} a été ajoutée à l'inventaire.`,
    });
  };

  const handleEdit = () => {
    if (!currentPart) return;
    updatePart(currentPart.id, formData);
    setIsEditOpen(false);
    setCurrentPart(null);
    resetForm();
    toast({
      title: "Pièce modifiée",
      description: "Les informations ont été mises à jour.",
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deletePart(deleteId);
    setDeleteId(null);
    toast({
      title: "Pièce supprimée",
      description: "La pièce a été retirée de l'inventaire.",
    });
  };

  const openEdit = (part: SparePart) => {
    setCurrentPart(part);
    setFormData({
      name: part.name,
      partNumber: part.partNumber || "",
      location: part.location,
      acquisitionDate: part.acquisitionDate,
      installationDate: part.installationDate || "",
      quantity: part.quantity,
    });
    setIsEditOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const PartForm = ({ onSubmit }: { onSubmit: () => void }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom de la pièce</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Modulateur haute tension"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="partNumber">Référence</Label>
          <Input
            id="partNumber"
            value={formData.partNumber}
            onChange={(e) =>
              setFormData({ ...formData, partNumber: e.target.value })
            }
            placeholder="Ex: MOD-HV-001"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Emplacement</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            placeholder="Ex: Magasin A - Étagère 3"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantité</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="acquisitionDate">Acquisition</Label>
          <Input
            id="acquisitionDate"
            type="date"
            value={formData.acquisitionDate}
            onChange={(e) =>
              setFormData({ ...formData, acquisitionDate: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="installationDate">Installation</Label>
          <Input
            id="installationDate"
            type="date"
            value={formData.installationDate}
            onChange={(e) =>
              setFormData({ ...formData, installationDate: e.target.value })
            }
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onSubmit}>Enregistrer</Button>
      </DialogFooter>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Pièces Détachées"
        description="Inventaire des pièces de rechange"
      >
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={resetForm}>
              <Plus className="w-4 h-4" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une pièce</DialogTitle>
              <DialogDescription>
                Ajoutez une nouvelle pièce à l'inventaire.
              </DialogDescription>
            </DialogHeader>
            <PartForm onSubmit={handleAdd} />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead>Emplacement</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Acquisition</TableHead>
                <TableHead>Installation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parts.map((part) => (
                <TableRow key={part.id}>
                  <TableCell className="font-medium">{part.name}</TableCell>
                  <TableCell className="font-mono text-sm">{part.partNumber}</TableCell>
                  <TableCell>{part.location}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                      {part.quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    {part.acquisitionDate
                      ? new Date(part.acquisitionDate).toLocaleDateString("fr-FR")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {part.installationDate
                      ? new Date(part.installationDate).toLocaleDateString("fr-FR")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(part)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(part.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {parts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground"
                  >
                    Aucune pièce dans l'inventaire
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la pièce</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la pièce.
            </DialogDescription>
          </DialogHeader>
          <PartForm onSubmit={handleEdit} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette pièce de l'inventaire ?
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

export default SpareParts;
