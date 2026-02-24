import { useState, useEffect } from 'react';
import type { Ticket } from '../types';
import {
  subscribeToTicket,
  subscribeToTableTickets,
  subscribeToExpoTickets,
  subscribeToTogoTickets,
} from '../services/ticket.service';

/**
 * Hook to subscribe to a single ticket with real-time updates
 */
export function useTicket(ticketId: string | null) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ticketId) {
      setTicket(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToTicket(ticketId, (updatedTicket) => {
      setTicket(updatedTicket);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [ticketId]);

  return { ticket, loading, error };
}

/**
 * Hook to subscribe to all tickets for a table with real-time updates
 */
export function useTableTickets(tableNumber: number | null) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (tableNumber === null) {
      setTickets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToTableTickets(tableNumber, (updatedTickets) => {
      setTickets(updatedTickets);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [tableNumber]);

  return { tickets, loading, error };
}

/**
 * Hook to subscribe to all open to-go tickets with real-time updates
 */
export function useTogoTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToTogoTickets((updatedTickets) => {
      setTickets(updatedTickets);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { tickets, loading };
}

/**
 * Hook to subscribe to all expo tickets (sent to expo, open) with real-time updates
 */
export function useExpoTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToExpoTickets((updatedTickets) => {
      setTickets(updatedTickets);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { tickets, loading };
}
