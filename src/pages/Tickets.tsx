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
import { Plus, Eye, Pencil, Loader2 } from "lucide-react";
import { useTickets, Ticket } from "@/hooks/useTickets";
import { useEquipments } from "@/hooks/useEquipments";
import { toast } from "@/hooks/use-toast";

type TicketPriority = Ticket['priority'];
type TicketStatus = Ticket['status'];

const Tickets = () => {
  const { tickets, isLoading: tkLoading, addTicket, updateTicketStatus, updateTicket } = useTickets();
  const { equipments, isLoading: eqLoading } = useEquipments();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [viewTicket, setViewTicket] = useState<Ticket | null>(null);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    equipmentId: "",
    priority: "Moyenne" as TicketPriority,
  });

  const isLoading = tkLoading || eqLoading;

  const resetForm = () => {
    setFormData({
      subject: "",
      description: "",
      equipmentId: "",
      priority: "Moyenne",
    });
  };

  const handleAdd = () => {
    addTicket(formData);
    setIsAddOpen(false);
    resetForm();
    toast({
      title: "Ticket créé",
      description: "Le ticket a été créé avec succès.",
    });
  };

  const handleEdit = () => {
    if (!currentTicket) return;
    updateTicket(currentTicket.id, formData);
    setIsEditOpen(false);
    setCurrentTicket(null);
    resetForm();
    toast({
      title: "Ticket modifié",
      description: "Les informations ont été mises à jour.",
    });
  };

  const openEdit = (ticket: Ticket) => {
    setCurrentTicket(ticket);
    setFormData({
      subject: ticket.subject,
      description: ticket.description,
      equipmentId: ticket.equipmentId,
      priority: ticket.priority,
    });
    setIsEditOpen(true);
  };

  const updateStatus = (ticketId: string, newStatus: TicketStatus) => {
    updateTicketStatus(ticketId, newStatus);
    toast({
      title: "Statut mis à jour",
      description: `Le ticket a été marqué comme "${newStatus}".`,
    });
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

  return (
    <>
      <PageHeader
        title="Tickets / Incidents"
        description="Gestion des demandes d'intervention et incidents"
      >
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={resetForm}>
              <Plus className="w-4 h-4" />
              Nouveau Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Créer un ticket</DialogTitle>
              <DialogDescription>
                Signalez un incident ou une demande d'intervention.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Sujet</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Décrivez brièvement le problème"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Détaillez le problème rencontré..."
                  rows={4}
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
                <Button type="button" onClick={handleAdd}>Créer le ticket</Button>
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
                <TableHead>Numéro</TableHead>
                <TableHead>Sujet</TableHead>
                <TableHead>Équipement</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono text-sm">
                    {ticket.number}
                  </TableCell>
                  <TableCell className="font-medium max-w-xs truncate">
                    {ticket.subject}
                  </TableCell>
                  <TableCell>{getEquipmentName(ticket.equipmentId)}</TableCell>
                  <TableCell>
                    {new Date(ticket.openedDate).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={ticket.priority} />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={ticket.status}
                      onValueChange={(value: TicketStatus) =>
                        updateStatus(ticket.id, value)
                      }
                    >
                      <SelectTrigger className="w-28 h-8">
                        <StatusBadge status={ticket.status} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ouvert">Ouvert</SelectItem>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Résolu">Résolu</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(ticket)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewTicket(ticket)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!viewTicket} onOpenChange={() => setViewTicket(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="font-mono text-muted-foreground">
                {viewTicket?.number}
              </span>
              {viewTicket && <StatusBadge status={viewTicket.priority} />}
            </DialogTitle>
          </DialogHeader>
          {viewTicket && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">{viewTicket.subject}</h4>
                <p className="text-sm text-muted-foreground">
                  {viewTicket.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Équipement:</span>
                  <p className="font-medium">
                    {getEquipmentName(viewTicket.equipmentId)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date d'ouverture:</span>
                  <p className="font-medium">
                    {new Date(viewTicket.openedDate).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Statut:</span>
                  <div className="mt-1">
                    <StatusBadge status={viewTicket.status} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier le ticket</DialogTitle>
            <DialogDescription>
              Modifiez les informations du ticket.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-subject">Sujet</Label>
              <Input
                id="edit-subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="edit-priority">Priorité</Label>
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
              <Button type="button" onClick={handleEdit}>Enregistrer</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Tickets;
