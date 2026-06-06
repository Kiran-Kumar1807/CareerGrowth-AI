from fastapi import APIRouter, HTTPException, Query
from app.schemas.jobs import LearningRoadmap
from app.api.routes.resume import _sessions
from app.services.job_matcher import match_jobs
from app.services.roadmap_generator import generate_roadmap

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])


@router.get("/generate/{session_id}", response_model=LearningRoadmap)
def generate_learning_roadmap(
    session_id: str,
    job_id: str = Query(..., description="Target job ID from job recommendations"),
):
    if session_id not in _sessions:
        raise HTTPException(status_code=404, detail="Session not found. Please upload your resume first.")

    session = _sessions[session_id]
    job_match_result = match_jobs(session.parsed_resume)

    target_match = next(
        (m for m in job_match_result.recommendations if m.job.id == job_id), None
    )
    if not target_match:
        raise HTTPException(status_code=404, detail=f"Job ID '{job_id}' not found.")

    # Find the skill gap for this job from the top 3
    skill_gap = next(
        (g for g in job_match_result.skill_gaps if g.target_role == target_match.job.title),
        None,
    )

    if not skill_gap:
        from app.schemas.jobs import SkillGap
        skill_gap = SkillGap(
            target_role=target_match.job.title,
            current_skills=target_match.matching_skills,
            required_skills=target_match.job.required_skills,
            missing_skills=target_match.missing_skills,
            priority_missing=target_match.missing_skills[:5],
        )

    roadmap = generate_roadmap(skill_gap, target_match.match_percentage)
    return roadmap
