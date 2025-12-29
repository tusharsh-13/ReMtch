from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from services.resume_parser import ResumeParser
from services.jd_parser import JobDescriptionParser
from services.matcher import MatchEngine
from models.schemas import MatchResponse


router = APIRouter(tags=["Matching"])

parser = ResumeParser()
jd_parser = JobDescriptionParser()
engine = MatchEngine()


@router.post("/match", response_model=MatchResponse)
async def match_resume_to_jd(
    file: UploadFile = File(...),
    job_description: str = Form(..., description="Raw Job Description text"),
):
    """
    Compute an intelligent match score between a resume and a job description.
    """
    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty")

    try:
        resume_text = await parser.extract_text(file)
        candidate_profile = parser.parse_profile(resume_text)
        jd_skills = jd_parser.extract_required_skills(job_description)

        result = engine.compute_match(
            resume_text=resume_text,
            job_description=job_description,
            candidate_skills=candidate_profile.skills,
            jd_skills=jd_skills,
        )

        return MatchResponse(
            candidate_profile=candidate_profile,
            match_score=result.match_score,
            matched_skills=result.matched_skills,
            missing_skills=result.missing_skills,
            semantic_similarity=result.semantic_similarity,
            skill_match_percentage=result.skill_match_percentage,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(
            status_code=500, detail="Failed to compute resume-job description match"
        )



