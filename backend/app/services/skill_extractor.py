from app.schemas.resume import ParsedResume, Skills, PersonalInfo, Experience, Education
from app.services.ai_provider import call_ai


SYSTEM_PROMPT = """You are a senior technical recruiter and career coach with deep expertise in
technology stacks, software engineering, and talent assessment. Always respond with valid JSON only."""


def _to_str_list(items: list) -> list[str]:
    """Normalize a list that may contain strings or dicts into plain strings."""
    result = []
    for item in items:
        if isinstance(item, str):
            result.append(item)
        elif isinstance(item, dict):
            # e.g. {"name": "ProjectX", "description": "..."}
            parts = [str(v) for v in item.values() if v]
            result.append(" — ".join(parts))
    return result


def extract_resume_data(resume_text: str) -> ParsedResume:
    prompt = f"""Extract all information from this resume text and return structured JSON.

Resume Text:
{resume_text[:4000]}

Return this exact JSON structure:
{{
  "personal_info": {{
    "name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": ""
  }},
  "experience": [
    {{
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Jan 2022 - Present",
      "description": "Key responsibilities and achievements"
    }}
  ],
  "education": [
    {{
      "degree": "B.S. Computer Science",
      "institution": "University Name",
      "year": "2020",
      "gpa": "3.8"
    }}
  ],
  "skills": {{
    "programming_languages": ["Python", "JavaScript"],
    "frameworks": ["React", "FastAPI"],
    "databases": ["PostgreSQL", "MongoDB"],
    "cloud": ["AWS", "Docker"],
    "tools": ["Git", "Jira"],
    "soft_skills": ["Leadership", "Communication"]
  }},
  "certifications": ["AWS Certified Developer", "Google Cloud Professional"],
  "projects": ["Project name and brief description"]
}}

Extract ALL skills mentioned anywhere in the resume — in experience descriptions, projects, certifications, and dedicated skills sections.
Be thorough with skill extraction. Categorize correctly."""

    data = call_ai(prompt, SYSTEM_PROMPT)

    personal = PersonalInfo(**data.get("personal_info", {}))

    experience = [Experience(**e) for e in data.get("experience", [])]
    education = [Education(**e) for e in data.get("education", [])]

    skills_data = data.get("skills", {})
    skills = Skills(
        programming_languages=skills_data.get("programming_languages", []),
        frameworks=skills_data.get("frameworks", []),
        databases=skills_data.get("databases", []),
        cloud=skills_data.get("cloud", []),
        tools=skills_data.get("tools", []),
        soft_skills=skills_data.get("soft_skills", []),
    )

    return ParsedResume(
        personal_info=personal,
        experience=experience,
        education=education,
        skills=skills,
        certifications=_to_str_list(data.get("certifications", [])),
        projects=_to_str_list(data.get("projects", [])),
        raw_text=resume_text,
    )
