from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import models, schemas, crud, insight_engine
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Repositories ---
@app.post("/repositories", response_model=schemas.Repository)
def create_repository(repo: schemas.RepositoryCreate, db: Session = Depends(get_db)):
    db_repo = db.query(models.Repository).filter(models.Repository.name == repo.name).first()
    if db_repo:
        raise HTTPException(status_code=400, detail="Repository already exists")
    new_repo = models.Repository(**repo.dict())
    db.add(new_repo)
    db.commit()
    db.refresh(new_repo)
    return new_repo

@app.get("/repositories", response_model=List[schemas.Repository])
def read_repositories(db: Session = Depends(get_db)):
    return db.query(models.Repository).all()

# --- Commits ---
@app.post("/commits", response_model=schemas.Commit)
def create_commit(commit: schemas.CommitCreate, db: Session = Depends(get_db)):
    return crud.create_commit(db=db, commit=commit)

@app.get("/commits", response_model=List[schemas.Commit])
def read_commits(
    skip: int = 0, 
    limit: int = 100, 
    category: Optional[str] = None,
    search: Optional[str] = None,
    repository_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    # Custom filter logic here or move to CRUD
    query = db.query(models.Commit)
    
    if category:
        query = query.filter(models.Commit.category == category)
    
    if search:
        query = query.filter(models.Commit.title.contains(search) | models.Commit.description.contains(search))

    if repository_id:
        query = query.filter(models.Commit.repository_id == repository_id)

    return query.order_by(desc(models.Commit.timestamp)).offset(skip).limit(limit).all()

@app.put("/commits/{commit_id}", response_model=schemas.Commit)
def update_commit(commit_id: int, commit: schemas.CommitUpdate, db: Session = Depends(get_db)):
    db_commit = crud.get_commit(db, commit_id=commit_id)
    if db_commit is None:
        raise HTTPException(status_code=404, detail="Commit not found")
    
    # Update fields
    for key, value in commit.dict(exclude_unset=True).items():
        setattr(db_commit, key, value)
    
    db.commit()
    db.refresh(db_commit)
    return db_commit

@app.delete("/commits/{commit_id}")
def delete_commit(commit_id: int, db: Session = Depends(get_db)):
    db_commit = crud.get_commit(db, commit_id=commit_id)
    if db_commit is None:
        raise HTTPException(status_code=404, detail="Commit not found")
    crud.delete_commit(db=db, commit_id=commit_id)
    return {"message": "Commit deleted"}

# --- Insights ---
@app.get("/insights", response_model=schemas.Insight)
def get_latest_insight(db: Session = Depends(get_db)):
    insight = crud.get_latest_insight(db)
    if not insight:
        # Generate initial insight if none exists
        commits = crud.get_commits(db)
        return insight_engine.generate_insight(db, commits)
    return insight

@app.post("/insights/refresh", response_model=schemas.Insight)
def refresh_insight(db: Session = Depends(get_db)):
    commits = crud.get_commits(db)
    return insight_engine.generate_insight(db, commits)
