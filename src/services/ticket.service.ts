import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Ticket, TicketItem, TicketStatus } from '../types';

/**
 * Create a new ticket for a table
 */
export async function createTicket(
  tableNumber: number,
  staffId: string
): Promise<string> {
  try {
    const ticketRef = doc(collection(db, 'tickets'));
    const ticketId = ticketRef.id;

    const newTicket: Omit<Ticket, 'id'> = {
      tableNumber,
      staffId,
      status: 'open',
      items: [],
      total: 0,
      createdAt: serverTimestamp() as Timestamp,
    };

    await setDoc(ticketRef, newTicket);
    return ticketId;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
}

/**
 * Get a ticket by ID
 */
export async function getTicket(ticketId: string): Promise<Ticket | null> {
  try {
    const ticketDoc = await getDoc(doc(db, 'tickets', ticketId));
    if (ticketDoc.exists()) {
      return { id: ticketDoc.id, ...ticketDoc.data() } as Ticket;
    }
    return null;
  } catch (error) {
    console.error('Error getting ticket:', error);
    return null;
  }
}

/**
 * Get all open tickets for a specific table
 */
export async function getTableTickets(tableNumber: number): Promise<Ticket[]> {
  try {
    const q = query(
      collection(db, 'tickets'),
      where('tableNumber', '==', tableNumber),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
  } catch (error) {
    console.error('Error getting table tickets:', error);
    return [];
  }
}

/**
 * Get all tickets for a staff member
 */
export async function getStaffTickets(staffId: string): Promise<Ticket[]> {
  try {
    const q = query(
      collection(db, 'tickets'),
      where('staffId', '==', staffId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
  } catch (error) {
    console.error('Error getting staff tickets:', error);
    return [];
  }
}

/**
 * Add item to a ticket
 */
export async function addItemToTicket(
  ticketId: string,
  item: TicketItem
): Promise<void> {
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    const ticketDoc = await getDoc(ticketRef);

    if (!ticketDoc.exists()) {
      throw new Error('Ticket not found');
    }

    const ticket = ticketDoc.data() as Ticket;
    const updatedItems = [...ticket.items, item];
    const updatedTotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await updateDoc(ticketRef, {
      items: updatedItems,
      total: updatedTotal,
    });
  } catch (error) {
    console.error('Error adding item to ticket:', error);
    throw error;
  }
}

/**
 * Remove item from a ticket
 */
export async function removeItemFromTicket(
  ticketId: string,
  itemIndex: number
): Promise<void> {
  try {
    const ticketRef = doc(db, 'tickets', ticketId);
    const ticketDoc = await getDoc(ticketRef);

    if (!ticketDoc.exists()) {
      throw new Error('Ticket not found');
    }

    const ticket = ticketDoc.data() as Ticket;
    const updatedItems = ticket.items.filter((_, index) => index !== itemIndex);
    const updatedTotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await updateDoc(ticketRef, {
      items: updatedItems,
      total: updatedTotal,
    });
  } catch (error) {
    console.error('Error removing item from ticket:', error);
    throw error;
  }
}

/**
 * Update item quantity in a ticket
 */
export async function updateTicketItemQuantity(
  ticketId: string,
  itemIndex: number,
  quantity: number
): Promise<void> {
  try {
    if (quantity <= 0) {
      await removeItemFromTicket(ticketId, itemIndex);
      return;
    }

    const ticketRef = doc(db, 'tickets', ticketId);
    const ticketDoc = await getDoc(ticketRef);

    if (!ticketDoc.exists()) {
      throw new Error('Ticket not found');
    }

    const ticket = ticketDoc.data() as Ticket;
    const updatedItems = [...ticket.items];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], quantity };
    const updatedTotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await updateDoc(ticketRef, {
      items: updatedItems,
      total: updatedTotal,
    });
  } catch (error) {
    console.error('Error updating ticket item quantity:', error);
    throw error;
  }
}

/**
 * Update ticket status
 */
export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
): Promise<void> {
  try {
    await updateDoc(doc(db, 'tickets', ticketId), {
      status,
    });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    throw error;
  }
}

/**
 * Close a ticket
 */
export async function closeTicket(ticketId: string): Promise<void> {
  try {
    await updateTicketStatus(ticketId, 'closed');
  } catch (error) {
    console.error('Error closing ticket:', error);
    throw error;
  }
}

/**
 * Delete a ticket
 */
export async function deleteTicket(ticketId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'tickets', ticketId));
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
}

/**
 * Subscribe to real-time ticket updates
 */
export function subscribeToTicket(
  ticketId: string,
  callback: (ticket: Ticket | null) => void
): () => void {
  const ticketRef = doc(db, 'tickets', ticketId);

  return onSnapshot(
    ticketRef,
    (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as Ticket);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error subscribing to ticket:', error);
      callback(null);
    }
  );
}

/**
 * Subscribe to all tickets for a table
 */
export function subscribeToTableTickets(
  tableNumber: number,
  callback: (tickets: Ticket[]) => void
): () => void {
  const q = query(
    collection(db, 'tickets'),
    where('tableNumber', '==', tableNumber),
    where('status', '==', 'open'),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
      callback(tickets);
    },
    (error) => {
      console.error('Error subscribing to table tickets:', error);
      callback([]);
    }
  );
}
