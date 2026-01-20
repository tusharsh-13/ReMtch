from typing import List, Optional

from pydantic import BaseModel, Field, EmailStr


class CandidateProfile(BaseModel):
    name: Optional[str] = Field(None, description="Full name if detected")
    email: Optional[EmailStr] = Field(None, description="Primary email address")
    phone: Optional[str] = Field(None, description="Primary phone number")
    skills: List[str] = Field(default_factory=list, description="Detected skills")
    education: List[str] = Field(
        default_factory=list, description="Education entries as free text"
    )
    experience: List[str] = Field(
        default_factory=list, description="Experience entries as free text"
    )
    certifications: List[str] = Field(
        default_factory=list, description="Detected certifications"
    )


class ParseResumeResponse(BaseModel):
    candidate_profile: CandidateProfile


class MatchEngineResult(BaseModel):
    match_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    semantic_similarity: float
    skill_match_percentage: float


class MatchResponse(BaseModel):
    candidate_profile: CandidateProfile
    match_score: float
    matched_skills: List[str]
    semantic_similarity: float
    skill_match_percentage: float



