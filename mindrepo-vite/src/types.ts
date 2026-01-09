export interface Commit {
  id: string;
  title: string;
  description: string;
  category: string;
  timestamp: string; // ISO string
}

export type NewCommit = Omit<Commit, 'id'>;
