import { useState, useEffect, useCallback } from 'react';
import { runQuery, runCommand } from '@/lib/database';
import { useDb } from '@/contexts/DatabaseContext';

export interface MaintenanceTask {
  id: string;
  task: string;
  equipmentId: string;
  dueDate: string;
  status: 'Planifié' | 'Terminé' | 'En retard';
  completedDate?: string;
}

interface TaskRow {
  id: string;
  task: string;
  equipment_id: string;
  due_date: string;
  status: string;
  completed_date: string | null;
}

const statusMap: Record<string, MaintenanceTask['status']> = { planned: 'Planifié', completed: 'Terminé', overdue: 'En retard' };
const statusMapReverse: Record<string, string> = { 'Planifié': 'planned', 'Terminé': 'completed', 'En retard': 'overdue' };

function rowToTask(row: TaskRow): MaintenanceTask {
  return {
    id: row.id,
    task: row.task,
    equipmentId: row.equipment_id,
    dueDate: row.due_date,
    status: statusMap[row.status] || 'Planifié',
    completedDate: row.completed_date || undefined,
  };
}

export function useMaintenanceTasks() {
  const { db, isLoading: dbLoading } = useDb();
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(() => {
    if (!db) return;
    const rows = runQuery<TaskRow>('SELECT * FROM maintenance_tasks ORDER BY due_date');
    setTasks(rows.map(rowToTask));
    setIsLoading(false);
  }, [db]);

  useEffect(() => {
    if (db) fetchTasks();
  }, [db, fetchTasks]);

  const addTask = useCallback((t: Omit<MaintenanceTask, 'id'>) => {
    const id = `mt-${Date.now()}`;
    runCommand(
      'INSERT INTO maintenance_tasks (id, task, equipment_id, due_date, status, completed_date) VALUES (?, ?, ?, ?, ?, ?)',
      [id, t.task, t.equipmentId, t.dueDate, statusMapReverse[t.status], t.completedDate || null]
    );
    fetchTasks();
    return id;
  }, [fetchTasks]);

  const updateTask = useCallback((id: string, t: Partial<MaintenanceTask>) => {
    const updates: string[] = [];
    const values: any[] = [];
    if (t.task) { updates.push('task = ?'); values.push(t.task); }
    if (t.equipmentId) { updates.push('equipment_id = ?'); values.push(t.equipmentId); }
    if (t.dueDate) { updates.push('due_date = ?'); values.push(t.dueDate); }
    if (t.status) { updates.push('status = ?'); values.push(statusMapReverse[t.status]); }
    if (t.completedDate !== undefined) { updates.push('completed_date = ?'); values.push(t.completedDate || null); }
    if (updates.length > 0) {
      values.push(id);
      runCommand(`UPDATE maintenance_tasks SET ${updates.join(', ')} WHERE id = ?`, values);
      fetchTasks();
    }
  }, [fetchTasks]);

  const deleteTask = useCallback((id: string) => {
    runCommand('DELETE FROM maintenance_tasks WHERE id = ?', [id]);
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, isLoading: dbLoading || isLoading, addTask, updateTask, deleteTask, refresh: fetchTasks };
}
