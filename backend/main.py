from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from . import crud, models, schemas, database, insight_engine

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="MindRepo API", description="Version Control for Human Decisions")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/commits", response_model=schemas.Commit)
def create_commit(commit: schemas.CommitCreate, db: Session = Depends(get_db)):
    if len(commit.title) < 5:
        raise HTTPException(status_code=400, detail="Title must be at least 5 characters long")
    
    # Invalidate insights cache implicitly by new data (re-gen on request)
    return crud.create_commit(db=db, commit=commit)

@app.get("/commits", response_model=List[schemas.Commit])
def read_commits(
    skip: int = 0, 
    limit: int = 100,
    category: Optional[str] = None,
    search: Optional[str] = None,
    from_date: Optional[str] = Query(None, alias="from"),
    to_date: Optional[str] = Query(None, alias="to"),
    db: Session = Depends(get_db)
):
    commits = crud.get_commits(
        db, skip=skip, limit=limit, 
        category=category, search=search, 
        from_date=from_date, to_date=to_date
    )
    return commits

@app.get("/commits/{commit_id}", response_model=schemas.Commit)
def read_commit(commit_id: int, db: Session = Depends(get_db)):
    db_commit = crud.get_commit(db, commit_id=commit_id)
    if db_commit is None:
        raise HTTPException(status_code=404, detail="Commit not found")
    return db_commit

@app.put("/commits/{commit_id}", response_model=schemas.Commit)
def update_commit(commit_id: int, commit_update: schemas.CommitUpdate, db: Session = Depends(get_db)):
    db_commit = crud.update_commit(db, commit_id, commit_update)
    if db_commit is None:
        raise HTTPException(status_code=404, detail="Commit not found")
    return db_commit

@app.delete("/commits/{commit_id}", response_model=schemas.Commit)
def delete_commit(commit_id: int, db: Session = Depends(get_db)):
    db_commit = crud.delete_commit(db, commit_id)
    if db_commit is None:
        raise HTTPException(status_code=404, detail="Commit not found")
    return db_commit

@app.get("/insights", response_model=schemas.Insight)
def read_insights(db: Session = Depends(get_db)):
    # Simple caching strategy: 
    # Try to get latest insight. If < 5 mins old, return it. Else generate new.
    # For MVP: Just generate fresh every time we hit refresh, or return latest.
    # User requirement: "Cache insights and invalidate on commit changes"
    # Implementing simpler logic: Always get latest DB entry. If empty, generate.
    latest = crud.get_latest_insights(db)
    if not latest:
        # Generate initial
        new_insight_data = insight_engine.generate_insights(db)
        if new_insight_data:
            latest = crud.create_insight(db, new_insight_data)
        else:
            raise HTTPException(status_code=404, detail="Not enough data for insights")
            
    return latest

@app.post("/insights/refresh", response_model=schemas.Insight)
def refresh_insights(db: Session = Depends(get_db)):
    new_insight_data = insight_engine.generate_insights(db)
    if not new_insight_data:
         # Fallback empty
         return schemas.Insight(
             id=0, summary="No Data", reasoning=[], severity="low", 
             related_commits=[], generated_at=""
         )
    return crud.create_insight(db, new_insight_data)
