from sqlalchemy.orm import Session
from sqlalchemy import desc
import models, schemas
import datetime

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

def get_latest_insight(db: Session):
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

# --- Profile Stats Logic ---
from sqlalchemy import func

def get_profile_stats(db: Session):
    # 1. Total Repos
    total_repos = db.query(models.Repository).count()

    # 2. Total Commits
    total_commits = db.query(models.Commit).count()

    # 3. Active Days (count distinct dates)
    # SQLite func.date(timestamp) -> YYYY-MM-DD
    active_days = db.query(func.date(models.Commit.timestamp)).distinct().count()

    # 4. Most Active Category
    # Group by category, order by count desc, limit 1
    most_active_cat_row = db.query(
        models.Commit.category, 
        func.count(models.Commit.id).label('count')
    ).group_by(models.Commit.category).order_by(desc('count')).first()
    
    most_active_category = most_active_cat_row[0] if most_active_cat_row else "None"

    # 5. Activity Contribution Graph (last 365 days)
    # We want a list of date + count. Frontend can map to intensity.
    # Group by date
    daily_commits = db.query(
        func.date(models.Commit.timestamp).label('date'),
        func.count(models.Commit.id).label('count')
    ).group_by('date').all()

    heatmap_data = []
    for row in daily_commits:
        cnt = row.count
        # Simple logic for level: 0=0, 1-2=1, 3-5=2, 6+=3 (mapped to 0-4 scale or similar)
        if cnt == 0: level = 0
        elif cnt <= 2: level = 1
        elif cnt <= 5: level = 2
        else: level = 3
        
        heatmap_data.append(schemas.HeatmapPoint(
            date=row.date,
            count=cnt,
            level=level
        ))

    # 6. Repository Summaries
    # For each repo: name, commit count, last activity, primary category
    repos = db.query(models.Repository).all()
    repo_summaries = []
    
    for repo in repos:
        c_count = db.query(models.Commit).filter(models.Commit.repository_id == repo.id).count()
        last_c = db.query(models.Commit).filter(models.Commit.repository_id == repo.id).order_by(desc(models.Commit.timestamp)).first()
        
        # Primary category for this repo
        cat_row = db.query(
            models.Commit.category, 
            func.count(models.Commit.id).label('count')
        ).filter(models.Commit.repository_id == repo.id).group_by(models.Commit.category).order_by(desc('count')).first()
        
        primary_cat = cat_row[0] if cat_row else "N/A"

        repo_summaries.append(schemas.RepoSummary(
            id=repo.id,
            name=repo.name,
            total_commits=c_count,
            last_activity=last_c.timestamp if last_c else None,
            primary_category=primary_cat
        ))

    # 7. Category Breakdown
    cat_counts = db.query(
        models.Commit.category,
        func.count(models.Commit.id).label('count')
    ).group_by(models.Commit.category).all()
    
    category_breakdown = [
        schemas.CategoryStat(category=r.category, count=r.count) for r in cat_counts
    ]

    return schemas.ProfileStats(
        total_repos=total_repos,
        total_commits=total_commits,
        active_days=active_days,
        most_active_category=most_active_category,
        heatmap_data=heatmap_data,
        repo_summaries=repo_summaries,
        category_breakdown=category_breakdown
    )
