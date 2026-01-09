from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import sqlite3
import os

app = FastAPI()

# Database Setup
DB_FILE = "mindrepo.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS commits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# Models
class Commit(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    timestamp: Optional[str] = None

class CommitResponse(Commit):
    id: int

# Routes
@app.post("/commits", response_model=CommitResponse)
def create_commit(commit: Commit):
    if not commit.timestamp:
        commit.timestamp = datetime.now().isoformat()
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO commits (title, description, category, timestamp)
        VALUES (?, ?, ?, ?)
    ''', (commit.title, commit.description, commit.category, commit.timestamp))
    commit_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return {**commit.dict(), "id": commit_id}

@app.get("/commits", response_model=List[CommitResponse])
def get_commits():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM commits ORDER BY timestamp DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.delete("/commits/{commit_id}")
def delete_commit(commit_id: int):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM commits WHERE id = ?", (commit_id,))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Commit not found")
    conn.commit()
    conn.close()
    return {"message": "Commit deleted successfully"}

@app.get("/insights")
def get_insights():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM commits ORDER BY timestamp ASC")
    rows = cursor.fetchall()
    conn.close()
    
    commits = [dict(row) for row in rows]
    
    if len(commits) < 3:
        return {"insights": ["Not enough data to generate insights. Add at least 3 commits."]}
    
    insights = []
    
    # 1. Detect repeated categories (simplistic)
    recent_commits = commits[-3:]
    categories = [c['category'] for c in recent_commits]
    if len(set(categories)) == 1:
        insights.append(f"You're focused! Your last 3 commits were all {categories[0]}.")
    
    # 2. Check for balance
    all_categories = [c['category'] for c in commits]
    if "Wellbeing" not in all_categories[-5:]:
        insights.append("Take care of yourself! No Wellbeing commits in the last 5 entries.")
        
    # 3. Gaps (mock logic as parsing dates strictly might be complex for MVP without extra libs, keeping it simple)
    # real logic would parse ISO strings.
    
    if not insights:
        insights.append("Keep going! Your commit history is growing.")
        
    return {"insights": insights}

# Serve static files (simple approach for MVP without mounting)
# In production we'd mount StaticFiles, but here we'll just focus on API.
# We will enable CORS so frontend can be opened as file or separate server.
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
