from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from ..services.resume_parser import ResumeParser
from ..models.schemas import ParseResumeResponse


router = APIRouter(tags=["Parsing"])

parser = ResumeParser()


@router.post("/parse-resume", response_model=ParseResumeResponse)
async def parse_resume(file: UploadFile = File(...)):
    """
    Parse a resume (PDF or TXT) and return a structured candidate profile.
    """
    try:
        text = await parser.extract_text(file)
        profile = parser.parse_profile(text)
        return ParseResumeResponse(candidate_profile=profile)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        # Don't leak internals but let the client know something went wrong
        raise HTTPException(status_code=500, detail="Failed to parse resume")



