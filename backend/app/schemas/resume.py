from pydantic import BaseModel
from typing import Optional


class PersonalInfo(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""
    github: str = ""


class Experience(BaseModel):
    title: str
    company: str
    duration: str
    description: str


class Education(BaseModel):
    degree: str
    institution: str
    year: str
    gpa: str = ""


class Skills(BaseModel):
    programming_languages: list[str] = []
    frameworks: list[str] = []
    databases: list[str] = []
    cloud: list[str] = []
    tools: list[str] = []
    soft_skills: list[str] = []


class ParsedResume(BaseModel):
    personal_info: PersonalInfo
    experience: list[Experience] = []
    education: list[Education] = []
    skills: Skills
    certifications: list[str] = []
    projects: list[str] = []
    raw_text: str = ""


class ATSImprovement(BaseModel):
    category: str
    issue: str
    suggestion: str


class ATSAnalysis(BaseModel):
    overall_score: int
    structure_score: int
    keyword_score: int
    experience_score: int
    skills_score: int
    formatting_score: int
    strengths: list[str]
    weaknesses: list[str]
    improvements: list[ATSImprovement]


class ResumeAnalysisResponse(BaseModel):
    parsed_resume: ParsedResume
    ats_analysis: ATSAnalysis
    session_id: str
