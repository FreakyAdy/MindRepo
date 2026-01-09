from backend import database, models, schemas, crud
from datetime import datetime, timedelta
import random

def seed_data():
    # Ensure tables exist
    models.Base.metadata.create_all(bind=database.engine)

    db = database.SessionLocal()
    
    # Check if empty
    if db.query(models.Commit).first():
        print("Database already has data. Skipping seed.")
        db.close()
        return

    print("Seeding database...")
    
    now = datetime.now()
    
    commits = [
        {"title": "Initial Project Research", "category": "Learning", "effort": 3, "delta": -10, "desc": "Researched architecture patterns for MindRepo."},
        {"title": "Setup Backend Environment", "category": "Coding", "effort": 2, "delta": -9, "desc": "Installed FastAPI and configured virtualenv."},
        {"title": "Database Schema Design", "category": "Coding", "effort": 4, "delta": -8, "desc": "Designed SQLite schema and relationships."},
        {"title": "Felt tired, stopped early", "category": "Health", "effort": 1, "delta": -7, "desc": "Burnout detected, needed sleep."},
        {"title": "Frontend Layout", "category": "Coding", "effort": 3, "delta": -2, "desc": "Created React layout with Tailwind."},
        {"title": "Refactoring Components", "category": "Coding", "effort": 2, "delta": -1, "desc": "Cleaned up messy code in Timeline."},
        {"title": "Implement Insights", "category": "Coding", "effort": 5, "delta": 0, "desc": "Added complex logic for insights engine."}
    ]

    for c in commits:
        ts = (now + timedelta(days=c['delta'])).isoformat()
        commit_in = schemas.CommitCreate(
            title=c['title'],
            description=c['desc'],
            category=c['category'],
            effort=c['effort'],
            timestamp=ts
        )
        crud.create_commit(db, commit_in)

    print("Seeding complete.")
    db.close()

if __name__ == "__main__":
    seed_data()
