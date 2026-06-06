import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.schemas.resume import ResumeAnalysisResponse
from app.services.resume_parser import parse_resume_file
from app.services.skill_extractor import extract_resume_data
from app.services.ats_analyzer import analyze_ats

router = APIRouter(prefix="/resume", tags=["Resume"])

# In-memory session store: session_id -> ResumeAnalysisResponse
_sessions: dict[str, ResumeAnalysisResponse] = {}


@router.post("/upload", response_model=ResumeAnalysisResponse)
async def upload_resume(file: UploadFile = File(...)):
    allowed = {".pdf", ".docx", ".doc"}
    suffix = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if suffix not in allowed:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")

    try:
        resume_text = await parse_resume_file(file)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to parse file: {str(e)}")

    if not resume_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from the uploaded file.")

    try:
        parsed_resume = extract_resume_data(resume_text)
        ats_analysis = analyze_ats(resume_text, parsed_resume)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    session_id = str(uuid.uuid4())
    response = ResumeAnalysisResponse(
        parsed_resume=parsed_resume,
        ats_analysis=ats_analysis,
        session_id=session_id,
    )
    _sessions[session_id] = response
    return response


@router.get("/session/{session_id}", response_model=ResumeAnalysisResponse)
def get_session(session_id: str):
    if session_id not in _sessions:
        raise HTTPException(status_code=404, detail="Session not found.")
    return _sessions[session_id]
