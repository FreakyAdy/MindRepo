from sqlalchemy.orm import Session
from sqlalchemy import desc
from . import models, schemas
import datetime

# Commits
def get_commits(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    category: str = None, 
    search: str = None, 
    from_date: str = None, 
    to_date: str = None
):
    query = db.query(models.Commit)

    if category:
        query = query.filter(models.Commit.category == category)
    
    if search:
        query = query.filter(models.Commit.title.contains(search))
    
    # Simple ISO string comparison works for YYYY-MM-DD format, but robust apps should parse dates.
    # MVP assumption: dates are valid ISO strings.
    if from_date:
        query = query.filter(models.Commit.timestamp >= from_date)
    
    if to_date:
        query = query.filter(models.Commit.timestamp <= to_date)

    return query.order_by(desc(models.Commit.timestamp)).offset(skip).limit(limit).all()

def get_commit(db: Session, commit_id: int):
    return db.query(models.Commit).filter(models.Commit.id == commit_id).first()

def create_commit(db: Session, commit: schemas.CommitCreate):
    db_commit = models.Commit(**commit.dict())
    db.add(db_commit)
    db.commit()
    db.refresh(db_commit)
    return db_commit

def update_commit(db: Session, commit_id: int, commit_update: schemas.CommitUpdate):
    db_commit = get_commit(db, commit_id)
    if not db_commit:
        return None
    
    update_data = commit_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_commit, key, value)
    
    db.add(db_commit)
    db.commit()
    db.refresh(db_commit)
    return db_commit

def delete_commit(db: Session, commit_id: int):
    db_commit = get_commit(db, commit_id)
    if db_commit:
        db.delete(db_commit)
        db.commit()
    return db_commit

# Insights
def get_latest_insights(db: Session):
    return db.query(models.Insight).order_by(desc(models.Insight.generated_at)).first()

def create_insight(db: Session, insight: schemas.InsightBase):
    db_insight = models.Insight(
        summary=insight.summary,
        reasoning=insight.reasoning,
        severity=insight.severity,
        related_commits=insight.related_commits,
        generated_at=insight.generated_at
    )
    db.add(db_insight)
    db.commit()
    db.refresh(db_insight)
    return db_insight
