from app.schemas.resume import ParsedResume, ATSAnalysis, ATSImprovement
from app.services.ai_provider import call_ai


SYSTEM_PROMPT = """You are an expert ATS (Applicant Tracking System) resume analyst with 15 years of experience
in recruitment and HR technology. Analyze resumes objectively and provide actionable feedback.
Always respond with valid JSON only."""


def analyze_ats(resume_text: str, parsed_resume: ParsedResume) -> ATSAnalysis:
    skills_count = (
        len(parsed_resume.skills.programming_languages)
        + len(parsed_resume.skills.frameworks)
        + len(parsed_resume.skills.databases)
        + len(parsed_resume.skills.cloud)
        + len(parsed_resume.skills.tools)
    )

    prompt = f"""Analyze this resume for ATS compatibility and provide scores and feedback.

Resume Text:
{resume_text[:3000]}

Extracted Info:
- Experience entries: {len(parsed_resume.experience)}
- Education entries: {len(parsed_resume.education)}
- Total skills: {skills_count}
- Certifications: {len(parsed_resume.certifications)}

Return this exact JSON structure:
{{
  "overall_score": <0-100 integer>,
  "structure_score": <0-100 integer>,
  "keyword_score": <0-100 integer>,
  "experience_score": <0-100 integer>,
  "skills_score": <0-100 integer>,
  "formatting_score": <0-100 integer>,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "improvements": [
    {{"category": "Keywords", "issue": "issue description", "suggestion": "actionable suggestion"}},
    {{"category": "Structure", "issue": "issue description", "suggestion": "actionable suggestion"}},
    {{"category": "Experience", "issue": "issue description", "suggestion": "actionable suggestion"}}
  ]
}}

Score methodology:
- structure_score: sections present, logical order, proper headers
- keyword_score: industry keywords, action verbs, quantified achievements
- experience_score: relevance, impact statements, career progression
- skills_score: technical depth, breadth, trending technologies
- formatting_score: length, bullet points, contact info, consistency
- overall_score: weighted average (structure:20, keywords:25, experience:25, skills:20, formatting:10)"""

    data = call_ai(prompt, SYSTEM_PROMPT)

    improvements = [ATSImprovement(**imp) for imp in data.get("improvements", [])]

    return ATSAnalysis(
        overall_score=data.get("overall_score", 60),
        structure_score=data.get("structure_score", 60),
        keyword_score=data.get("keyword_score", 60),
        experience_score=data.get("experience_score", 60),
        skills_score=data.get("skills_score", 60),
        formatting_score=data.get("formatting_score", 60),
        strengths=data.get("strengths", []),
        weaknesses=data.get("weaknesses", []),
        improvements=improvements,
    )
