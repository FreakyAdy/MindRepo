export interface Commit {
  id: number;
  title: string;
  description?: string;
  category: string;
  effort: number;
  timestamp: string;
  repository_id: number;
}

export interface NewCommit {
  title: string;
  description?: string;
  category: string;
  effort: number;
  repository_id: number;
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
  generated_at: string;
}

export interface HeatmapPoint {
  date: string;
  count: number;
  level: number;
}

export interface RepoSummary {
  id: number;
  name: string;
  total_commits: number;
  last_activity: string | null;
  primary_category: string;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface ProfileStats {
  total_repos: number;
  total_commits: number;
  active_days: number;
  most_active_category: string | null;
  heatmap_data: HeatmapPoint[];
  repo_summaries: RepoSummary[];
  category_breakdown: CategoryStat[];
}
