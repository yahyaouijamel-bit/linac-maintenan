import { useState, useEffect, useCallback } from 'react';
import { runQuery, runCommand } from '@/lib/database';
import { useDb } from '@/contexts/DatabaseContext';

export interface WorkOrder {
  id: string;
  equipmentId: string;
  description: string;
  technicianId: string;
  priority: 'Haute' | 'Moyenne' | 'Basse';
  status: 'Ouvert' | 'En cours' | 'Fermé';
  createdDate: string;
  completedDate?: string;
}

interface WorkOrderRow {
  id: string;
  equipment_id: string;
  description: string;
  assigned_to: string;
  priority: string;
  status: string;
  created_at: string;
  completed_at: string | null;
}

const priorityMap: Record<string, WorkOrder['priority']> = { high: 'Haute', medium: 'Moyenne', low: 'Basse' };
const priorityMapReverse: Record<string, string> = { 'Haute': 'high', 'Moyenne': 'medium', 'Basse': 'low' };
const statusMap: Record<string, WorkOrder['status']> = { open: 'Ouvert', 'in-progress': 'En cours', closed: 'Fermé' };
const statusMapReverse: Record<string, string> = { 'Ouvert': 'open', 'En cours': 'in-progress', 'Fermé': 'closed' };

function rowToWorkOrder(row: WorkOrderRow): WorkOrder {
  return {
    id: row.id,
    equipmentId: row.equipment_id,
    description: row.description,
    technicianId: row.assigned_to || '',
    priority: priorityMap[row.priority] || 'Moyenne',
    status: statusMap[row.status] || 'Ouvert',
    createdDate: row.created_at.split('T')[0],
    completedDate: row.completed_at?.split('T')[0],
  };
}

export function useWorkOrders() {
  const { db, isLoading: dbLoading } = useDb();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkOrders = useCallback(() => {
    if (!db) return;
    const rows = runQuery<WorkOrderRow>('SELECT * FROM work_orders ORDER BY created_at DESC');
    setWorkOrders(rows.map(rowToWorkOrder));
    setIsLoading(false);
  }, [db]);

  useEffect(() => {
    if (db) fetchWorkOrders();
  }, [db, fetchWorkOrders]);

  const addWorkOrder = useCallback((wo: Omit<WorkOrder, 'id' | 'createdDate' | 'status'>) => {
    const id = `wo-${Date.now()}`;
    runCommand(
      'INSERT INTO work_orders (id, equipment_id, description, assigned_to, priority, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, wo.equipmentId, wo.description, wo.technicianId || null, priorityMapReverse[wo.priority], 'open', new Date().toISOString()]
    );
    fetchWorkOrders();
    return id;
  }, [fetchWorkOrders]);

  const updateStatus = useCallback((id: string, status: WorkOrder['status']) => {
    const completedAt = status === 'Fermé' ? new Date().toISOString() : null;
    runCommand('UPDATE work_orders SET status = ?, completed_at = ? WHERE id = ?', [statusMapReverse[status], completedAt, id]);
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  const deleteWorkOrder = useCallback((id: string) => {
    runCommand('DELETE FROM work_orders WHERE id = ?', [id]);
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  const updateWorkOrder = useCallback((id: string, wo: Partial<Omit<WorkOrder, 'id' | 'createdDate' | 'completedDate'>>) => {
    const updates: string[] = [];
    const values: (string | null)[] = [];
    if (wo.equipmentId !== undefined) { updates.push('equipment_id = ?'); values.push(wo.equipmentId); }
    if (wo.description !== undefined) { updates.push('description = ?'); values.push(wo.description); }
    if (wo.technicianId !== undefined) { updates.push('assigned_to = ?'); values.push(wo.technicianId || null); }
    if (wo.priority !== undefined) { updates.push('priority = ?'); values.push(priorityMapReverse[wo.priority]); }
    if (updates.length > 0) {
      values.push(id);
      runCommand(`UPDATE work_orders SET ${updates.join(', ')} WHERE id = ?`, values);
      fetchWorkOrders();
    }
  }, [fetchWorkOrders]);

  return { workOrders, isLoading: dbLoading || isLoading, addWorkOrder, updateStatus, deleteWorkOrder, updateWorkOrder, refresh: fetchWorkOrders };
}
