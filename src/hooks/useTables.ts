import { useState, useEffect } from 'react';
import type { Table } from '../types';
import {
  subscribeToAllTables,
  subscribeToTable,
} from '../services/table.service';

/**
 * Hook to subscribe to all tables with real-time updates
 */
export function useTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToAllTables((updatedTables) => {
      setTables(updatedTables);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { tables, loading, error };
}

/**
 * Hook to subscribe to a single table with real-time updates
 */
export function useTable(tableNumber: number | null) {
  const [table, setTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (tableNumber === null) {
      setTable(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToTable(tableNumber, (updatedTable) => {
      setTable(updatedTable);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [tableNumber]);

  return { table, loading, error };
}
