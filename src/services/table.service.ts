import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Table, TableStatus } from '../types';

/**
 * Initialize all tables (1-20) in the database
 * Should be run once during setup
 */
export async function initializeTables(count: number = 20): Promise<void> {
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

/**
 * Get a single table by number
 */
export async function getTable(tableNumber: number): Promise<Table | null> {
  try {
    const tableDoc = await getDoc(doc(db, 'tables', tableNumber.toString()));
    if (tableDoc.exists()) {
      return tableDoc.data() as Table;
    }
    return null;
  } catch (error) {
    console.error('Error getting table:', error);
    return null;
  }
}

/**
 * Get all tables
 */
export async function getAllTables(): Promise<Table[]> {
  try {
    const snapshot = await getDocs(collection(db, 'tables'));
    return snapshot.docs
      .map(doc => doc.data() as Table)
      .sort((a, b) => a.tableNumber - b.tableNumber);
  } catch (error) {
    console.error('Error getting all tables:', error);
    return [];
  }
}

/**
 * Update table status
 */
export async function updateTableStatus(
  tableNumber: number,
  status: TableStatus,
  currentTicketId?: string,
  assignedStaffId?: string
): Promise<void> {
  try {
    const tableRef = doc(db, 'tables', tableNumber.toString());
    const updateData: Partial<Table> = { status };

    if (currentTicketId !== undefined) {
      updateData.currentTicketId = currentTicketId;
    }

    if (assignedStaffId !== undefined) {
      updateData.assignedStaffId = assignedStaffId;
    }

    await updateDoc(tableRef, updateData);
  } catch (error) {
    console.error('Error updating table status:', error);
    throw error;
  }
}

/**
 * Assign a ticket to a table
 */
export async function assignTicketToTable(
  tableNumber: number,
  ticketId: string,
  staffId: string
): Promise<void> {
  try {
    await updateTableStatus(tableNumber, 'occupied', ticketId, staffId);
  } catch (error) {
    console.error('Error assigning ticket to table:', error);
    throw error;
  }
}

/**
 * Clear a table (mark as available, remove ticket)
 */
export async function clearTable(tableNumber: number): Promise<void> {
  try {
    const tableRef = doc(db, 'tables', tableNumber.toString());
    await updateDoc(tableRef, {
      status: 'available',
      currentTicketId: null,
      assignedStaffId: null,
    });
  } catch (error) {
    console.error('Error clearing table:', error);
    throw error;
  }
}

/**
 * Get tables assigned to a staff member
 */
export async function getStaffTables(staffId: string): Promise<Table[]> {
  try {
    const allTables = await getAllTables();
    return allTables.filter(table => table.assignedStaffId === staffId);
  } catch (error) {
    console.error('Error getting staff tables:', error);
    return [];
  }
}

/**
 * Subscribe to real-time updates for all tables
 */
export function subscribeToAllTables(
  callback: (tables: Table[]) => void
): () => void {
  const q = query(collection(db, 'tables'));

  return onSnapshot(
    q,
    (snapshot) => {
      const tables = snapshot.docs
        .map(doc => doc.data() as Table)
        .sort((a, b) => a.tableNumber - b.tableNumber);
      callback(tables);
    },
    (error) => {
      console.error('Error subscribing to tables:', error);
      callback([]);
    }
  );
}

/**
 * Subscribe to a single table
 */
export function subscribeToTable(
  tableNumber: number,
  callback: (table: Table | null) => void
): () => void {
  const tableRef = doc(db, 'tables', tableNumber.toString());

  return onSnapshot(
    tableRef,
    (doc) => {
      if (doc.exists()) {
        callback(doc.data() as Table);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error subscribing to table:', error);
      callback(null);
    }
  );
}
