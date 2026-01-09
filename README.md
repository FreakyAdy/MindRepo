# MindRepo

MindRepo is a personal version control system for your thoughts, decisions, and daily "commits" to self-improvement. It applies the git philosophy to personal growth.

## Features

-   **Repositories**: Create separate workspaces for different aspects of life (e.g., "Coding", "Health", "Learning").
-   **Human Commits**: Log your progress with a message, category, description, and "intensity" level.
-   **Visual Timeline**: View your history in a clean, chronological feed.
-   **Insights & Profile**: Track your consistency with a GitHub-style contribution heatmap and stats.
-   **Local First**: All data is stored locally in an SQLite database (`mindrepo.db`).

## Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS, Lucide Icons.
-   **Backend**: Python, FastAPI, SQLite, SQLAlchemy.
-   **Tools**: Vercel (Deployment support).

## Running Locally

### Prerequisites
-   Node.js & npm
-   Python 3.8+

### 1. Backend Setup
Navigate to the `backend` folder and start the API server:

```bash
cd backend
# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r ../requirements.txt

# Start the server
python -m uvicorn main:app --reload
```
The backend will run on `http://localhost:8000`.

### 2. Frontend Setup
Open a new terminal, navigate to the `mindrepo-vite` folder, and start the frontend:

```bash
cd mindrepo-vite
npm install
npm run dev
```
The app will run on `http://localhost:5173`.

## Deployment (Vercel)

This project is configured for Vercel deployment.

1.  **Frontend**: Static build from `mindrepo-vite`.
2.  **Backend**: Serverless Python functions via `/api`.

> **⚠️ IMPORTANT NOTE ON DATABASE**: Any SQLite database (`mindrepo.db`) deployed to Vercel will be **ephemeral**. It will reset whenever the serverless function cold-starts or redeploys. For persistent data in production, you must switch the database URL in `backend/database.py` to a cloud-hosted PostgreSQL database (e.g., Supabase, Neon, or Vercel Postgres).

## License

MIT
