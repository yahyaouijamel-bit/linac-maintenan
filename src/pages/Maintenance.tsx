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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useMaintenanceTasks, MaintenanceTask } from "@/hooks/useMaintenanceTasks";
import { useEquipments } from "@/hooks/useEquipments";
import { toast } from "@/hooks/use-toast";

type MaintenanceStatus = MaintenanceTask['status'];

const Maintenance = () => {
  const { tasks, isLoading: mtLoading, addTask, updateTask, deleteTask } = useMaintenanceTasks();
  const { equipments, isLoading: eqLoading } = useEquipments();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentTask, setCurrentTask] = useState<MaintenanceTask | null>(null);
  const [formData, setFormData] = useState({
    task: "",
    equipmentId: "",
    dueDate: "",
    status: "Planifié" as MaintenanceStatus,
  });

  const isLoading = mtLoading || eqLoading;

  const resetForm = () => {
    setFormData({
      task: "",
      equipmentId: "",
      dueDate: "",
      status: "Planifié",
    });
  };

  const handleAdd = () => {
    addTask(formData);
    setIsAddOpen(false);
    resetForm();
    toast({
      title: "Tâche planifiée",
      description: "La maintenance a été planifiée avec succès.",
    });
  };

  const handleEdit = () => {
    if (!currentTask) return;
    updateTask(currentTask.id, formData);
    setIsEditOpen(false);
    setCurrentTask(null);
    resetForm();
    toast({
      title: "Tâche modifiée",
      description: "Les informations ont été mises à jour.",
    });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteTask(deleteId);
    setDeleteId(null);
    toast({
      title: "Tâche supprimée",
      description: "La tâche de maintenance a été supprimée.",
    });
  };

  const openEdit = (task: MaintenanceTask) => {
    setCurrentTask(task);
    setFormData({
      task: task.task,
      equipmentId: task.equipmentId,
      dueDate: task.dueDate,
      status: task.status,
    });
    setIsEditOpen(true);
  };

  const getEquipmentName = (id: string) => {
    return equipments.find((e) => e.id === id)?.name || "Inconnu";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const plannedTasks = tasks.filter((t) => t.status === "Planifié");
  const overdueTasks = tasks.filter((t) => t.status === "En retard");
  const completedTasks = tasks.filter((t) => t.status === "Terminé");

  const TaskForm = ({ onSubmit }: { onSubmit: () => void }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="task">Description de la tâche</Label>
        <Input
          id="task"
          value={formData.task}
          onChange={(e) => setFormData({ ...formData, task: e.target.value })}
          placeholder="Ex: Calibration mensuelle du faisceau"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="equipment">Équipement</Label>
          <Select
            value={formData.equipmentId}
            onValueChange={(value) =>
              setFormData({ ...formData, equipmentId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
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
          <Label htmlFor="dueDate">Date d'échéance</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select
          value={formData.status}
          onValueChange={(value: MaintenanceStatus) =>
            setFormData({ ...formData, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Planifié">Planifié</SelectItem>
            <SelectItem value="Terminé">Terminé</SelectItem>
            <SelectItem value="En retard">En retard</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button onClick={onSubmit}>Enregistrer</Button>
      </DialogFooter>
    </div>
  );

  const TaskTable = ({ items }: { items: MaintenanceTask[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tâche</TableHead>
          <TableHead>Équipement</TableHead>
          <TableHead>Échéance</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.task}</TableCell>
            <TableCell>{getEquipmentName(task.equipmentId)}</TableCell>
            <TableCell>
              {new Date(task.dueDate).toLocaleDateString("fr-FR")}
            </TableCell>
            <TableCell>
              <StatusBadge status={task.status} />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(task)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteId(task.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {items.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              Aucune tâche à afficher
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <>
      <PageHeader
        title="Maintenance Préventive"
        description="Planification et suivi des tâches de maintenance"
      >
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={resetForm}>
              <Plus className="w-4 h-4" />
              Nouvelle Tâche
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Planifier une maintenance</DialogTitle>
              <DialogDescription>
                Créez une nouvelle tâche de maintenance préventive.
              </DialogDescription>
            </DialogHeader>
            <TaskForm onSubmit={handleAdd} />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Tabs defaultValue="planned">
        <TabsList className="mb-4">
          <TabsTrigger value="planned" className="gap-2">
            Planifiées
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
              {plannedTasks.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="overdue" className="gap-2">
            En retard
            {overdueTasks.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs">
                {overdueTasks.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
        </TabsList>
        <TabsContent value="planned">
          <Card>
            <CardContent className="p-0">
              <TaskTable items={plannedTasks} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="overdue">
          <Card>
            <CardContent className="p-0">
              <TaskTable items={overdueTasks} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardContent className="p-0">
              <TaskTable items={completedTasks} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la tâche</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la tâche de maintenance.
            </DialogDescription>
          </DialogHeader>
          <TaskForm onSubmit={handleEdit} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette tâche ?
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

export default Maintenance;
