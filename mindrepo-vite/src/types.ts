export interface Commit {
  id: number;
  title: string;
  description: string;
  category: string;
  effort: number;
  timestamp: string;
}

export type NewCommit = Omit<Commit, 'id'>;

export interface Insight {
  id: number;
  summary: string;
  reasoning: string[];
  severity: 'low' | 'medium' | 'high';
  related_commits: number[];
  generated_at: string;
}
