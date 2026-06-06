from app.schemas.jobs import LearningRoadmap, RoadmapMonth, RoadmapWeek, SkillGap
from app.services.ai_provider import call_ai


SYSTEM_PROMPT = """You are an expert career coach and technical curriculum designer. You create
practical, actionable learning roadmaps that help professionals upskill efficiently.
Always respond with valid JSON only."""


def generate_roadmap(skill_gap: SkillGap, current_match: int) -> LearningRoadmap:
    missing_skills = skill_gap.missing_skills[:8]
    current_skills = skill_gap.current_skills

    if not missing_skills:
        return LearningRoadmap(
            target_role=skill_gap.target_role,
            current_match=current_match,
            projected_match=min(current_match + 5, 100),
            total_duration_weeks=4,
            months=[RoadmapMonth(
                month=1,
                title="Advanced Specialization",
                skills=current_skills[:3],
                weeks=[
                    RoadmapWeek(week=1, topic="Deep dive into core skills", resources=["Official docs", "Advanced tutorials"], deliverable="Portfolio project"),
                    RoadmapWeek(week=2, topic="Best practices & patterns", resources=["System design resources"], deliverable="Code review exercise"),
                    RoadmapWeek(week=3, topic="Real-world projects", resources=["GitHub projects", "Open source contributions"], deliverable="Contribution to OSS"),
                    RoadmapWeek(week=4, topic="Interview preparation", resources=["LeetCode", "System design interviews"], deliverable="Mock interview"),
                ],
            )],
            priority_skills=current_skills[:3],
        )

    prompt = f"""Create a personalized learning roadmap for someone targeting: {skill_gap.target_role}

Current skills they have: {', '.join(current_skills)}
Skills they need to learn: {', '.join(missing_skills)}
Current job match: {current_match}%

Create a structured roadmap with 3-4 months. For each month provide 4 weeks.

Return this exact JSON:
{{
  "projected_match": <estimated match % after completing roadmap, integer>,
  "total_duration_weeks": <total weeks integer>,
  "priority_skills": ["skill1", "skill2", "skill3"],
  "months": [
    {{
      "month": 1,
      "title": "Month title",
      "skills": ["skill1", "skill2"],
      "weeks": [
        {{
          "week": 1,
          "topic": "Specific topic to learn",
          "resources": ["Free Course on YouTube: ...", "Official Docs: ...", "Book: ..."],
          "deliverable": "What to build/complete by end of week"
        }},
        {{"week": 2, "topic": "...", "resources": ["..."], "deliverable": "..."}},
        {{"week": 3, "topic": "...", "resources": ["..."], "deliverable": "..."}},
        {{"week": 4, "topic": "...", "resources": ["..."], "deliverable": "..."}}
      ]
    }}
  ]
}}

Make resources specific and free when possible (YouTube, official docs, freeCodeCamp, etc.).
Make deliverables concrete and portfolio-worthy."""

    data = call_ai(prompt, SYSTEM_PROMPT)

    months = []
    for m in data.get("months", []):
        weeks = [RoadmapWeek(**w) for w in m.get("weeks", [])]
        months.append(RoadmapMonth(
            month=m["month"],
            title=m["title"],
            skills=m.get("skills", []),
            weeks=weeks,
        ))

    projected = min(data.get("projected_match", current_match + 20), 100)

    return LearningRoadmap(
        target_role=skill_gap.target_role,
        current_match=current_match,
        projected_match=projected,
        total_duration_weeks=data.get("total_duration_weeks", len(months) * 4),
        months=months,
        priority_skills=data.get("priority_skills", missing_skills[:3]),
    )
