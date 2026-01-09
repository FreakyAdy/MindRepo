export interface Commit {
  id: number;
  title: string;
  description?: string;
  category: string;
  effort: number;
  timestamp: string;
  repository_id?: number;
}

export interface NewCommit {
  title: string;
  description?: string;
  category: string;
  effort: number;
  repository_id?: number;
}

export interface Repository {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface Insight {
  summary: string;
  severity: 'low' | 'medium' | 'high';
  reasoning: string[];
}
