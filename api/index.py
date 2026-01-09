import sys
import os

# Add the parent directory (project root) to sys.path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend.main import app

# This file exposes the FastAPI app to Vercel's serverless runtime
