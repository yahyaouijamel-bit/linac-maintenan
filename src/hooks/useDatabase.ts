import { useState, useEffect } from 'react';
import { initDatabase, getDatabase } from '@/lib/database';
import type { Database } from 'sql.js';

export function useDatabase() {
  const [db, setDb] = useState<Database | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initDatabase()
      .then((database) => {
        setDb(database);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  return { db, isLoading, error, getDatabase };
}
