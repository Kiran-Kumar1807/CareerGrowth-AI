"""
CareerGrowth AI — FastAPI Backend
Entry point: registers all routers and configures CORS.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import resume, jobs, roadmap

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered career assistant: resume analysis, ATS scoring, job matching, and personalized learning roadmaps.",
    version="1.0.0",
)

# Allow requests from the React dev server and production frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/api/v1")
app.include_router(jobs.router, prefix="/api/v1")
app.include_router(roadmap.router, prefix="/api/v1")


@app.get("/health")
def health_check():
    """Quick health check — confirms the server is up and shows which AI provider is active."""
    return {"status": "ok", "app": settings.APP_NAME, "ai_provider": settings.AI_PROVIDER}
