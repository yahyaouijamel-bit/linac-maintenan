import { useState, useEffect, useCallback } from 'react';
import { runQuery, runCommand } from '@/lib/database';
import { useDb } from '@/contexts/DatabaseContext';

export interface EquipmentRow {
  id: string;
  name: string;
  model: string;
  serial_number: string;
  installation_date: string;
  status: 'operational' | 'maintenance' | 'down';
}

export interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  commissioningDate: string;
  status: 'Opérationnel' | 'En Maintenance' | 'En Panne';
}

const statusMap: Record<string, Equipment['status']> = {
  operational: 'Opérationnel',
  maintenance: 'En Maintenance',
  down: 'En Panne',
};

const statusMapReverse: Record<string, string> = {
  'Opérationnel': 'operational',
  'En Maintenance': 'maintenance',
  'En Panne': 'down',
};

function rowToEquipment(row: EquipmentRow): Equipment {
  return {
    id: row.id,
    name: row.name,
    model: row.model,
    serialNumber: row.serial_number,
    commissioningDate: row.installation_date,
    status: statusMap[row.status] || 'Opérationnel',
  };
}

export function useEquipments() {
  const { db, isLoading: dbLoading } = useDb();
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEquipments = useCallback(() => {
    if (!db) return;
    const rows = runQuery<EquipmentRow>('SELECT * FROM equipments ORDER BY name');
    setEquipments(rows.map(rowToEquipment));
    setIsLoading(false);
  }, [db]);

  useEffect(() => {
    if (db) fetchEquipments();
  }, [db, fetchEquipments]);

  const addEquipment = useCallback((eq: Omit<Equipment, 'id'>) => {
    const id = `eq-${Date.now()}`;
    runCommand(
      'INSERT INTO equipments (id, name, model, serial_number, installation_date, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id, eq.name, eq.model, eq.serialNumber, eq.commissioningDate, statusMapReverse[eq.status]]
    );
    fetchEquipments();
    return id;
  }, [fetchEquipments]);

  const updateEquipment = useCallback((id: string, eq: Partial<Equipment>) => {
    const updates: string[] = [];
    const values: any[] = [];
    if (eq.name) { updates.push('name = ?'); values.push(eq.name); }
    if (eq.model) { updates.push('model = ?'); values.push(eq.model); }
    if (eq.serialNumber) { updates.push('serial_number = ?'); values.push(eq.serialNumber); }
    if (eq.commissioningDate) { updates.push('installation_date = ?'); values.push(eq.commissioningDate); }
    if (eq.status) { updates.push('status = ?'); values.push(statusMapReverse[eq.status]); }
    if (updates.length > 0) {
      values.push(id);
      runCommand(`UPDATE equipments SET ${updates.join(', ')} WHERE id = ?`, values);
      fetchEquipments();
    }
  }, [fetchEquipments]);

  const deleteEquipment = useCallback((id: string) => {
    runCommand('DELETE FROM equipments WHERE id = ?', [id]);
    fetchEquipments();
  }, [fetchEquipments]);

  return {
    equipments,
    isLoading: dbLoading || isLoading,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    refresh: fetchEquipments,
  };
}
