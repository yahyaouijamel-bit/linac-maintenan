import { useState, useEffect, useCallback } from 'react';
import { runQuery, runCommand } from '@/lib/database';
import { useDb } from '@/contexts/DatabaseContext';

export interface Ticket {
  id: string;
  number: string;
  subject: string;
  description: string;
  equipmentId: string;
  priority: 'Haute' | 'Moyenne' | 'Basse';
  status: 'Ouvert' | 'En cours' | 'Résolu';
  openedDate: string;
  resolvedDate?: string;
}

interface TicketRow {
  id: string;
  number: string;
  subject: string;
  description: string;
  equipment_id: string;
  priority: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
}

const priorityMap: Record<string, Ticket['priority']> = { high: 'Haute', medium: 'Moyenne', low: 'Basse' };
const priorityMapReverse: Record<string, string> = { 'Haute': 'high', 'Moyenne': 'medium', 'Basse': 'low' };
const statusMap: Record<string, Ticket['status']> = { open: 'Ouvert', 'in-progress': 'En cours', resolved: 'Résolu' };
const statusMapReverse: Record<string, string> = { 'Ouvert': 'open', 'En cours': 'in-progress', 'Résolu': 'resolved' };

function rowToTicket(row: TicketRow): Ticket {
  return {
    id: row.id,
    number: row.number,
    subject: row.subject,
    description: row.description,
    equipmentId: row.equipment_id,
    priority: priorityMap[row.priority] || 'Moyenne',
    status: statusMap[row.status] || 'Ouvert',
    openedDate: row.created_at.split('T')[0],
    resolvedDate: row.resolved_at?.split('T')[0],
  };
}

export function useTickets() {
  const { db, isLoading: dbLoading } = useDb();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = useCallback(() => {
    if (!db) return;
    const rows = runQuery<TicketRow>('SELECT * FROM tickets ORDER BY created_at DESC');
    setTickets(rows.map(rowToTicket));
    setIsLoading(false);
  }, [db]);

  useEffect(() => {
    if (db) fetchTickets();
  }, [db, fetchTickets]);

  const addTicket = useCallback((ticket: Omit<Ticket, 'id' | 'number' | 'openedDate' | 'status'>) => {
    const id = `tkt-${Date.now()}`;
    const count = runQuery<{ cnt: number }>('SELECT COUNT(*) as cnt FROM tickets')[0]?.cnt || 0;
    const number = `TKT-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    runCommand(
      'INSERT INTO tickets (id, number, subject, description, equipment_id, priority, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, number, ticket.subject, ticket.description, ticket.equipmentId, priorityMapReverse[ticket.priority], 'open', new Date().toISOString()]
    );
    fetchTickets();
    return id;
  }, [fetchTickets]);

  const updateTicketStatus = useCallback((id: string, status: Ticket['status']) => {
    const resolvedAt = status === 'Résolu' ? new Date().toISOString() : null;
    runCommand('UPDATE tickets SET status = ?, resolved_at = ? WHERE id = ?', [statusMapReverse[status], resolvedAt, id]);
    fetchTickets();
  }, [fetchTickets]);

  return { tickets, isLoading: dbLoading || isLoading, addTicket, updateTicketStatus, refresh: fetchTickets };
}
