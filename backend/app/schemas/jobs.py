from pydantic import BaseModel
from typing import Optional


class JobListing(BaseModel):
    id: str
    title: str
    company: str
    location: str
    salary_range: str
    job_type: str
    required_skills: list[str]
    description: str
    category: str


class JobMatch(BaseModel):
    job: JobListing
    match_percentage: int
    matching_skills: list[str]
    missing_skills: list[str]


class SkillGap(BaseModel):
    target_role: str
    current_skills: list[str]
    required_skills: list[str]
    missing_skills: list[str]
    priority_missing: list[str]


class JobMatchResponse(BaseModel):
    recommendations: list[JobMatch]
    skill_gaps: list[SkillGap]
    top_match_percentage: int


class RoadmapWeek(BaseModel):
    week: int
    topic: str
    resources: list[str]
    deliverable: str


class RoadmapMonth(BaseModel):
    month: int
    title: str
    skills: list[str]
    weeks: list[RoadmapWeek]


class LearningRoadmap(BaseModel):
    target_role: str
    current_match: int
    projected_match: int
    total_duration_weeks: int
    months: list[RoadmapMonth]
    priority_skills: list[str]
