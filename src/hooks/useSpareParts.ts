import { useState, useEffect, useCallback } from 'react';
import { runQuery, runCommand } from '@/lib/database';
import { useDb } from '@/contexts/DatabaseContext';

export interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  location: string;
  acquisitionDate: string;
  installationDate?: string;
}

interface SparePartRow {
  id: string;
  name: string;
  part_number: string;
  quantity: number;
  location: string;
  acquisition_date: string;
  installation_date: string | null;
}

function rowToPart(row: SparePartRow): SparePart {
  return {
    id: row.id,
    name: row.name,
    partNumber: row.part_number,
    quantity: row.quantity,
    location: row.location,
    acquisitionDate: row.acquisition_date || '',
    installationDate: row.installation_date || undefined,
  };
}

export function useSpareParts() {
  const { db, isLoading: dbLoading } = useDb();
  const [parts, setParts] = useState<SparePart[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchParts = useCallback(() => {
    if (!db) return;
    const rows = runQuery<SparePartRow>('SELECT * FROM spare_parts ORDER BY name');
    setParts(rows.map(rowToPart));
    setIsLoading(false);
  }, [db]);

  useEffect(() => {
    if (db) fetchParts();
  }, [db, fetchParts]);

  const addPart = useCallback((p: Omit<SparePart, 'id'>) => {
    const id = `sp-${Date.now()}`;
    runCommand(
      'INSERT INTO spare_parts (id, name, part_number, quantity, location, acquisition_date, installation_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, p.name, p.partNumber || '', p.quantity, p.location, p.acquisitionDate, p.installationDate || null]
    );
    fetchParts();
    return id;
  }, [fetchParts]);

  const updatePart = useCallback((id: string, p: Partial<SparePart>) => {
    const updates: string[] = [];
    const values: any[] = [];
    if (p.name) { updates.push('name = ?'); values.push(p.name); }
    if (p.partNumber !== undefined) { updates.push('part_number = ?'); values.push(p.partNumber); }
    if (p.quantity !== undefined) { updates.push('quantity = ?'); values.push(p.quantity); }
    if (p.location) { updates.push('location = ?'); values.push(p.location); }
    if (p.acquisitionDate) { updates.push('acquisition_date = ?'); values.push(p.acquisitionDate); }
    if (p.installationDate !== undefined) { updates.push('installation_date = ?'); values.push(p.installationDate || null); }
    if (updates.length > 0) {
      values.push(id);
      runCommand(`UPDATE spare_parts SET ${updates.join(', ')} WHERE id = ?`, values);
      fetchParts();
    }
  }, [fetchParts]);

  const deletePart = useCallback((id: string) => {
    runCommand('DELETE FROM spare_parts WHERE id = ?', [id]);
    fetchParts();
  }, [fetchParts]);

  return { parts, isLoading: dbLoading || isLoading, addPart, updatePart, deletePart, refresh: fetchParts };
}
