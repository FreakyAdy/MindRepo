from database import SessionLocal, engine
from models import Base, Commit, Repository
from datetime import datetime, timedelta
import random

# Create tables
Base.metadata.drop_all(bind=engine) # RESET DB
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# 1. Create Repositories
repos_data = [
    {"name": "mindrepo/coding", "description": "Tracking coding practice and projects"},
    {"name": "mindrepo/learning", "description": "Notes from books and courses"},
    {"name": "mindrepo/health", "description": "Workout logs and meditation"},
    {"name": "mindrepo/meeting", "description": "Work meeting notes"},
    {"name": "mindrepo/planning", "description": "Future goals and todo lists"},
]

repos = {}
for r_data in repos_data:
    repo = Repository(**r_data)
    db.add(repo)
    db.commit()
    db.refresh(repo)
    repos[r_data["name"]] = repo

print("✅ Repositories created")

# 2. Create Commits
categories = ["Coding", "Learning", "Health", "Meeting", "Planning"]
titles = [
    "Started DSA practice", "Read 'Atomic Habits'", "Morning meditation", 
    "Team sync", "Weekly planning", "Refactored API", "Learned Rust basics",
    "Gym session", "Client call", "Budget review"
]

for i in range(15):
    cat = random.choice(categories)
    # Match category to repo strictly for demo
    repo_name = f"mindrepo/{cat.lower()}"
    repo = repos.get(repo_name)
    
    commit = Commit(
        title=random.choice(titles),
        description=f"Description for commit {i+1}...",
        category=cat,
        effort=random.randint(1, 5),
        timestamp=datetime.utcnow() - timedelta(hours=random.randint(1, 72)),
        repository_id=repo.id if repo else None
    )
    db.add(commit)

db.commit()
print("✅ Seed data populated successfully!")
db.close()
