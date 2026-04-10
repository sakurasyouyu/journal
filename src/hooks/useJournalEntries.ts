import { useState, useEffect } from 'react';
import type { JournalEntry } from '../types';

export const useJournalEntries = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('journal_entries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse entries', err);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('journal_entries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter(e => e.id !== id));
  };

  return { entries, addEntry, deleteEntry };
};
