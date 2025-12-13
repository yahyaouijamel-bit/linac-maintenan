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
import { Plus, Pencil, Trash2, Mail, Phone, Loader2 } from "lucide-react";
import { useTechnicians, Technician } from "@/hooks/useTechnicians";
import { toast } from "@/hooks/use-toast";

const Technicians = () => {
  const { technicians, isLoading, addTechnician, updateTechnician, deleteTechnician } = useTechnicians();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentTech, setCurrentTech] = useState<Technician | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      specialization: "",
    });
  };

  const handleAdd = () => {
    addTechnician(formData);
    setIsAddOpen(false);
    resetForm();
    toast({
      title: "Technicien ajouté",
      description: `${formData.name} a été ajouté à l'équipe.`,
    });
  };

  const handleEdit = () => {
    if (!currentTech) return;
    updateTechnician(currentTech.id, formData);
    setIsEditOpen(false);
    setCurrentTech(null);
    resetForm();
    toast({
      title: "Technicien modifié",
      description: "Les informations ont été mises à jour.",
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteTechnician(deleteId);
    setDeleteId(null);
    toast({
      title: "Technicien supprimé",
      description: "Le technicien a été retiré de l'équipe.",
    });
  };

  const openEdit = (tech: Technician) => {
    setCurrentTech(tech);
    setFormData({
      name: tech.name,
      email: tech.email,
      phone: tech.phone,
      specialization: tech.specialization,
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

  const TechForm = ({ onSubmit }: { onSubmit: () => void }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom complet</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Prénom Nom"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@hopital.fr"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+33 1 23 45 67 89"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="specialization">Spécialisation</Label>
        <Input
          id="specialization"
          value={formData.specialization}
          onChange={(e) =>
            setFormData({ ...formData, specialization: e.target.value })
          }
          placeholder="Ex: Électronique haute tension"
        />
      </div>
      <DialogFooter>
        <Button type="button" onClick={onSubmit}>Enregistrer</Button>
      </DialogFooter>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Techniciens"
        description="Gestion de l'équipe de maintenance"
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
              <DialogTitle>Ajouter un technicien</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau membre à l'équipe de maintenance.
              </DialogDescription>
            </DialogHeader>
            <TechForm onSubmit={handleAdd} />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Spécialisation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicians.map((tech) => (
                <TableRow key={tech.id}>
                  <TableCell className="font-medium">{tech.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        <a
                          href={`mailto:${tech.email}`}
                          className="text-primary hover:underline"
                        >
                          {tech.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        {tech.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-accent text-accent-foreground text-sm">
                      {tech.specialization}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(tech)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(tech.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {technicians.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    Aucun technicien enregistré
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
            <DialogTitle>Modifier le technicien</DialogTitle>
            <DialogDescription>
              Modifiez les informations du technicien.
            </DialogDescription>
          </DialogHeader>
          <TechForm onSubmit={handleEdit} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce technicien ?
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

export default Technicians;
