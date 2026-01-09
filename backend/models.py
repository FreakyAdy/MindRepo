from sqlalchemy import Column, Integer, String, Text, Float
import json
from .database import Base

class Commit(Base):
    __tablename__ = "commits"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    category = Column(String, index=True)
    effort = Column(Integer, default=1) # 1-5 scale
    timestamp = Column(String) # ISO format

class Insight(Base):
    __tablename__ = "insights"

    id = Column(Integer, primary_key=True, index=True)
    summary = Column(String)
    reasoning_json = Column(Text) # JSON list of strings
    severity = Column(String) # low, medium, high
    related_commits_json = Column(Text) # JSON list of commit IDs
    generated_at = Column(String)

    @property
    def reasoning(self):
        return json.loads(self.reasoning_json) if self.reasoning_json else []
    
    @reasoning.setter
    def reasoning(self, value):
        self.reasoning_json = json.dumps(value)

    @property
    def related_commits(self):
        return json.loads(self.related_commits_json) if self.related_commits_json else []

    @related_commits.setter
    def related_commits(self, value):
        self.related_commits_json = json.dumps(value)
