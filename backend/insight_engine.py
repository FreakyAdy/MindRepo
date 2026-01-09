from sqlalchemy.orm import Session
from . import models, schemas
import datetime
from datetime import datetime as dt, timedelta

# Rule 1: Repeated Category
def check_repeated_category(commits):
    if len(commits) < 3:
        return None
    
    last_3 = commits[-3:] # Assuming chrono order passed in
    categories = [c.category for c in last_3]
    
    if len(set(categories)) == 1:
        return {
            "summary": f"Locked In: {categories[0]}",
            "reasoning": [f"Your last 3 commits were all '{categories[0]}'.", "This indicates a strong focus session or possibly getting stuck."],
            "severity": "medium",
            "related_commits": [c.id for c in last_3]
        }
    return None

# Rule 2: Activity Gap
def check_activity_gap(commits):
    if len(commits) < 2:
        return None
    
    last_commit_time = dt.fromisoformat(commits[-1].timestamp.replace('Z', '+00:00'))
    now = dt.now(last_commit_time.tzinfo)
    
    delta = now - last_commit_time
    if delta.days > 7:
        return {
            "summary": "Rust Detected",
            "reasoning": [f"It's been over {delta.days} days since your last commit.", "Consider smaller tasks to regain momentum."],
            "severity": "high",
            "related_commits": [commits[-1].id]
        }
    return None

# Rule 3: Wellbeing Keywords
def check_wellbeing(commits):
    keywords = ["sleep", "tired", "anxious", "burnout", "exhausted"]
    flagged_commits = []
    
    for commit in commits[-10:]: # Look at last 10
        desc = (commit.description or "").lower()
        title = commit.title.lower()
        if any(w in desc or w in title for w in keywords):
            flagged_commits.append(commit)
            
    if flagged_commits:
        return {
            "summary": "Wellbeing check",
            "reasoning": ["Detected keywords related to fatigue or anxiety in recent logs.", "Prioritize rest."],
            "severity": "high",
            "related_commits": [c.id for c in flagged_commits]
        }
    return None

def generate_insights(db: Session):
    # Fetch all commits in chronological order for analysis
    commits = db.query(models.Commit).order_by(models.Commit.timestamp).all()
    
    if not commits:
        return None

    insights_list = []
    
    # Run Rules
    res_repeated = check_repeated_category(commits)
    if res_repeated: insights_list.append(res_repeated)
    
    res_gap = check_activity_gap(commits)
    if res_gap: insights_list.append(res_gap)
    
    res_wellbeing = check_wellbeing(commits)
    if res_wellbeing: insights_list.append(res_wellbeing)
    
    # Select most severe or latest
    if not insights_list:
        return schemas.InsightBase(
            summary="All systems nominal",
            reasoning=["Steady progress detected.", "No immediate anomalies."],
            severity="low",
            related_commits=[],
            generated_at=datetime.datetime.now().isoformat()
        )
        
    # Pick "High" severity first, else first available
    selected = next((i for i in insights_list if i['severity'] == 'high'), insights_list[0])
    
    return schemas.InsightBase(
        summary=selected['summary'],
        reasoning=selected['reasoning'],
        severity=selected['severity'],
        related_commits=selected['related_commits'],
        generated_at=datetime.datetime.now().isoformat()
    )
