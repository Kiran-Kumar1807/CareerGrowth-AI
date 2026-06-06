from fastapi import APIRouter, HTTPException
from app.schemas.jobs import JobMatchResponse
from app.api.routes.resume import _sessions
from app.services.job_matcher import match_jobs

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("/match/{session_id}", response_model=JobMatchResponse)
def get_job_matches(session_id: str):
    if session_id not in _sessions:
        raise HTTPException(status_code=404, detail="Session not found. Please upload your resume first.")

    session = _sessions[session_id]
    result = match_jobs(session.parsed_resume)
    return result
