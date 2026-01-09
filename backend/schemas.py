from pydantic import BaseModel
from typing import List, Optional

class CommitBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    effort: int = 1
    timestamp: Optional[str] = None

class CommitCreate(CommitBase):
    pass

class CommitUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    effort: Optional[int] = None

class Commit(CommitBase):
    id: int

    class Config:
        from_attributes = True

class InsightBase(BaseModel):
    summary: str
    reasoning: List[str]
    severity: str
    related_commits: List[int]
    generated_at: str

class Insight(InsightBase):
    id: int

    class Config:
        from_attributes = True
