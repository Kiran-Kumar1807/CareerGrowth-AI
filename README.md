# CareerGrowth AI

An AI-powered career assistant that analyzes resumes, scores ATS compatibility, matches jobs, identifies skill gaps, and generates personalized learning roadmaps.

## Project Structure

```
CareerGrowth_AI/
├── backend/        FastAPI (Python)
└── frontend/       React + Tailwind CSS (Vite)
```

---

## Quick Start

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.10+ | https://python.org |
| Node.js | 18+ | https://nodejs.org |
| API Key | Anthropic or OpenAI | https://console.anthropic.com |

---

### 1. Backend Setup

```bash
cd backend

# Copy and fill in your API key
copy .env.example .env
# Edit .env → set ANTHROPIC_API_KEY=sk-ant-...

# Install dependencies (already done if you ran setup)
pip install -r requirements.txt

# Start the server
python -m uvicorn app.main:app --reload --port 8000
```

Backend runs at: http://localhost:8000  
API docs at:     http://localhost:8000/docs

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: http://localhost:5173

---

### 3. Configure AI Provider

**Option A — Claude (default)**

In `backend/.env`:
```
AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**Option B — OpenAI**

In `backend/.env`:
```
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Resume Upload** | PDF and DOCX support |
| **ATS Scoring** | 5-category score with strengths/weaknesses |
| **Skill Extraction** | AI categorizes skills into 6 types |
| **Job Matching** | 12 curated roles with match % |
| **Skill Gap Analysis** | Priority-ranked missing skills per role |
| **Learning Roadmap** | Month-by-month plan with weekly tasks |

## API Endpoints

```
POST /api/v1/resume/upload          Upload & analyze resume
GET  /api/v1/resume/session/{id}    Retrieve session data
GET  /api/v1/jobs/match/{id}        Get job recommendations
GET  /api/v1/roadmap/generate/{id}  Generate learning roadmap
GET  /health                        Health check
```
