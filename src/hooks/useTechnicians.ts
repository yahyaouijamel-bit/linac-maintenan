import { useState, useEffect, useCallback } from 'react';
import { runQuery, runCommand } from '@/lib/database';
import { useDb } from '@/contexts/DatabaseContext';

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
}

interface TechnicianRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
}

function rowToTechnician(row: TechnicianRow): Technician {
  return { ...row };
}

export function useTechnicians() {
  const { db, isLoading: dbLoading } = useDb();
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTechnicians = useCallback(() => {
    if (!db) return;
    const rows = runQuery<TechnicianRow>('SELECT * FROM technicians ORDER BY name');
    setTechnicians(rows.map(rowToTechnician));
    setIsLoading(false);
  }, [db]);

  useEffect(() => {
    if (db) fetchTechnicians();
  }, [db, fetchTechnicians]);

  const addTechnician = useCallback((t: Omit<Technician, 'id'>) => {
    const id = `tech-${Date.now()}`;
    runCommand(
      'INSERT INTO technicians (id, name, email, phone, specialization) VALUES (?, ?, ?, ?, ?)',
      [id, t.name, t.email, t.phone, t.specialization]
    );
    fetchTechnicians();
    return id;
  }, [fetchTechnicians]);

  const updateTechnician = useCallback((id: string, t: Partial<Technician>) => {
    const updates: string[] = [];
    const values: any[] = [];
    if (t.name) { updates.push('name = ?'); values.push(t.name); }
    if (t.email) { updates.push('email = ?'); values.push(t.email); }
    if (t.phone) { updates.push('phone = ?'); values.push(t.phone); }
    if (t.specialization) { updates.push('specialization = ?'); values.push(t.specialization); }
    if (updates.length > 0) {
      values.push(id);
      runCommand(`UPDATE technicians SET ${updates.join(', ')} WHERE id = ?`, values);
      fetchTechnicians();
    }
  }, [fetchTechnicians]);

  const deleteTechnician = useCallback((id: string) => {
    runCommand('DELETE FROM technicians WHERE id = ?', [id]);
    fetchTechnicians();
  }, [fetchTechnicians]);

  return { technicians, isLoading: dbLoading || isLoading, addTechnician, updateTechnician, deleteTechnician, refresh: fetchTechnicians };
}
