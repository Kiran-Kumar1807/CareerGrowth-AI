from app.schemas.resume import ParsedResume
from app.schemas.jobs import JobMatch, JobListing, SkillGap, JobMatchResponse
from app.data.jobs import MOCK_JOBS


def _get_all_skills(resume: ParsedResume) -> set[str]:
    skills = resume.skills
    all_skills = set()
    for skill_list in [
        skills.programming_languages,
        skills.frameworks,
        skills.databases,
        skills.cloud,
        skills.tools,
    ]:
        all_skills.update(s.lower() for s in skill_list)
    return all_skills


def _normalize(skill: str) -> str:
    return skill.lower().strip()


def _match_skill(user_skill: str, required_skill: str) -> bool:
    u = _normalize(user_skill)
    r = _normalize(required_skill)
    return u == r or u in r or r in u


def _calculate_match(user_skills: set[str], required_skills: list[str]) -> tuple[int, list[str], list[str]]:
    matching = []
    missing = []
    for req in required_skills:
        matched = any(_match_skill(us, req) for us in user_skills)
        if matched:
            matching.append(req)
        else:
            missing.append(req)
    pct = int(len(matching) / len(required_skills) * 100) if required_skills else 0
    return pct, matching, missing


def match_jobs(resume: ParsedResume) -> JobMatchResponse:
    user_skills = _get_all_skills(resume)

    matches: list[JobMatch] = []
    for job in MOCK_JOBS:
        pct, matching, missing = _calculate_match(user_skills, job.required_skills)
        matches.append(JobMatch(
            job=job,
            match_percentage=pct,
            matching_skills=matching,
            missing_skills=missing,
        ))

    matches.sort(key=lambda m: m.match_percentage, reverse=True)
    top_matches = matches[:6]

    skill_gaps: list[SkillGap] = []
    for match in top_matches[:3]:
        gap = SkillGap(
            target_role=match.job.title,
            current_skills=match.matching_skills,
            required_skills=match.job.required_skills,
            missing_skills=match.missing_skills,
            priority_missing=match.missing_skills[:5],
        )
        skill_gaps.append(gap)

    top_pct = top_matches[0].match_percentage if top_matches else 0

    return JobMatchResponse(
        recommendations=top_matches,
        skill_gaps=skill_gaps,
        top_match_percentage=top_pct,
    )
