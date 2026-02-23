import {
  doc,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import type { Table } from '../types';

/**
 * Initialize all tables (1-20) in the database
 * Should be run once during setup
 */
export async function initializeTables(count: number = 12): Promise<void> {
  try {
    const batch = [];
    for (let i = 1; i <= count; i++) {
      const tableRef = doc(db, 'tables', i.toString());
      const tableData: Omit<Table, 'tableNumber'> & { tableNumber: number } = {
        tableNumber: i,
        status: 'available',
        lastUpdated: Timestamp.now(),
      };
      batch.push(setDoc(tableRef, tableData));
    }
    await Promise.all(batch);
  } catch (error) {
    console.error('Error initializing tables:', error);
    throw error;
  }
}

initializeTables()
  .then(() => console.log('Tables initialized successfully'))
  .catch((error) => console.error('Error initializing tables:', error));