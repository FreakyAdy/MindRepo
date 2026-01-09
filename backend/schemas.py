from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime

# --- Repository Schemas ---
class RepositoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class RepositoryCreate(RepositoryBase):
    pass

class Repository(RepositoryBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# --- Commit Schemas ---
class CommitBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    effort: Optional[int] = 1
    timestamp: Optional[datetime] = None
    repository_id: Optional[int] = None

class CommitCreate(CommitBase):
    pass

class CommitUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    effort: Optional[int] = None
    repository_id: Optional[int] = None

class Commit(CommitBase):
    id: int
    repository: Optional[Repository] = None

    class Config:
        orm_mode = True

# --- Insight Schemas ---
class InsightBase(BaseModel):
    summary: str
    severity: str
    reasoning: List[str]

class InsightCreate(InsightBase):
    pass

class Insight(InsightBase):
    id: int
    generated_at: datetime

    class Config:
        orm_mode = True

# --- Profile Stats Schemas ---
class HeatmapPoint(BaseModel):
    date: str  # YYYY-MM-DD
    count: int
    level: int # 0-4 intensity

class RepoSummary(BaseModel):
    id: int
    name: str
    total_commits: int
    last_activity: Optional[datetime]
    primary_category: Optional[str]

class CategoryStat(BaseModel):
    category: str
    count: int

class ProfileStats(BaseModel):
    total_repos: int
    total_commits: int
    active_days: int
    most_active_category: Optional[str]
    heatmap_data: List[HeatmapPoint]
    repo_summaries: List[RepoSummary]
    category_breakdown: List[CategoryStat]
