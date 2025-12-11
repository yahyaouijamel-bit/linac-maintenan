import { useState, useEffect, useCallback } from 'react';
import { runQuery, runCommand } from '@/lib/database';
import { useDb } from '@/contexts/DatabaseContext';

export interface Downtime {
  id: string;
  equipmentId: string;
  reason: string;
  startDate: string;
  endDate?: string;
  status: 'En cours' | 'Résolu';
}

interface DowntimeRow {
  id: string;
  equipment_id: string;
  reason: string;
  start_time: string;
  end_time: string | null;
  status: string;
}

const statusMap: Record<string, Downtime['status']> = { ongoing: 'En cours', resolved: 'Résolu' };
const statusMapReverse: Record<string, string> = { 'En cours': 'ongoing', 'Résolu': 'resolved' };

function rowToDowntime(row: DowntimeRow): Downtime {
  return {
    id: row.id,
    equipmentId: row.equipment_id,
    reason: row.reason,
    startDate: row.start_time,
    endDate: row.end_time || undefined,
    status: statusMap[row.status] || 'En cours',
  };
}

export function useDowntimes() {
  const { db, isLoading: dbLoading } = useDb();
  const [downtimes, setDowntimes] = useState<Downtime[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDowntimes = useCallback(() => {
    if (!db) return;
    const rows = runQuery<DowntimeRow>('SELECT * FROM downtimes ORDER BY start_time DESC');
    setDowntimes(rows.map(rowToDowntime));
    setIsLoading(false);
  }, [db]);

  useEffect(() => {
    if (db) fetchDowntimes();
  }, [db, fetchDowntimes]);

  const addDowntime = useCallback((dt: Omit<Downtime, 'id' | 'status'>) => {
    const id = `dt-${Date.now()}`;
    runCommand(
      'INSERT INTO downtimes (id, equipment_id, reason, start_time, status) VALUES (?, ?, ?, ?, ?)',
      [id, dt.equipmentId, dt.reason, dt.startDate, 'ongoing']
    );
    fetchDowntimes();
    return id;
  }, [fetchDowntimes]);

  const resolveDowntime = useCallback((id: string) => {
    runCommand('UPDATE downtimes SET status = ?, end_time = ? WHERE id = ?', ['resolved', new Date().toISOString(), id]);
    fetchDowntimes();
  }, [fetchDowntimes]);

  return { downtimes, isLoading: dbLoading || isLoading, addDowntime, resolveDowntime, refresh: fetchDowntimes };
}
