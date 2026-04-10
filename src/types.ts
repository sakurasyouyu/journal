export interface JournalEntry {
  id: string;
  createdAt: string;
  content: string;
  mood: 'amazing' | 'good' | 'meh' | 'bad' | 'awful';
  gratitude1: string;
  gratitude2: string;
  gratitude3: string;
  sleepHours: number | null;
}
