from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Repository(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    commits = relationship("Commit", back_populates="repository")

class Commit(Base):
    __tablename__ = "commits"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    category = Column(String, index=True)
    effort = Column(Integer, default=1)
    timestamp = Column(DateTime, default=datetime.utcnow)
    repository_id = Column(Integer, ForeignKey("repositories.id", ondelete="CASCADE"), nullable=False)

    repository = relationship("Repository", back_populates="commits")

class Insight(Base):
    __tablename__ = "insights"

    id = Column(Integer, primary_key=True, index=True)
    summary = Column(Text)
    severity = Column(String)  # low, medium, high
    generated_at = Column(DateTime, default=datetime.utcnow)
    reasoning = Column(Text) # JSON string of bullet points
