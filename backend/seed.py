from database import SessionLocal, engine
from models import Base, Commit, Repository
from datetime import datetime, timedelta

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Check if database is already populated
existing_repos = db.query(Repository).count()
if existing_repos > 0:
    print("⏭️  Database already contains data. Skipping seed.")
    db.close()
    exit(0)

print("🌱 Seeding database with demo data...")

# Create the demo repository
demo_repo = Repository(
    name="learning-dsa",
    description="Tracking my data structures and algorithms journey"
)
db.add(demo_repo)
db.commit()
db.refresh(demo_repo)

print(f"✅ Created repository: {demo_repo.name}")

# Create the 3 demo commits
demo_commits = [
    {
        "title": "Watched arrays lecture",
        "description": "Covered basics and time complexity",
        "category": "Study",
        "effort": 3,
        "timestamp": datetime.utcnow() - timedelta(hours=48)
    },
    {
        "title": "Solved 5 LeetCode problems",
        "description": "3 easy, 2 medium",
        "category": "Study",
        "effort": 4,
        "timestamp": datetime.utcnow() - timedelta(hours=24)
    },
    {
        "title": "Skipped practice",
        "description": "Felt tired after exams",
        "category": "Wellbeing",
        "effort": 1,
        "timestamp": datetime.utcnow() - timedelta(hours=6)
    }
]

for commit_data in demo_commits:
    commit = Commit(
        **commit_data,
        repository_id=demo_repo.id
    )
    db.add(commit)
    print(f"✅ Created commit: {commit.title}")

db.commit()
print("✅ Seed data populated successfully!")
db.close()
