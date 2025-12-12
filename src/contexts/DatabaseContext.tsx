import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initDatabase } from '@/lib/database';
import type { Database } from 'sql.js';

interface DatabaseContextType {
  db: Database | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
  exportDatabase: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Database | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    initDatabase()
      .then((database) => {
        setDb(database);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Database init error:', err);
        setError(err);
        setIsLoading(false);
      });
  }, []);

  const refresh = () => setRefreshKey((k) => k + 1);

  const exportDatabase = () => {
    if (!db) return;
    const data = db.export();
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cmms-backup-${new Date().toISOString().split('T')[0]}.sqlite`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DatabaseContext.Provider value={{ db, isLoading, error, refresh, exportDatabase }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDb() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDb must be used within a DatabaseProvider');
  }
  return context;
}
