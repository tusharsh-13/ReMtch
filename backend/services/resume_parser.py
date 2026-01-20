import io
import re
from typing import List

import pdfplumber
from fastapi import UploadFile

from ..models.schemas import CandidateProfile
from ..utils.skills_db import NORMALISED_SKILLS, normalise_skill
from .spacy_assistant import get_spacy_assistant


EMAIL_REGEX = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE_REGEX = re.compile(
    r"(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})"
)


class ResumeParser:
    """
    Service responsible for:
    - Extracting text from PDF or TXT resumes
    - Parsing structured fields like name, email, phone, skills, education, experience
    """

    async def extract_text(self, file: UploadFile) -> str:
        if not file.filename:
            raise ValueError("File must have a name")

        filename = file.filename.lower()
        content = await file.read()

        if filename.endswith(".pdf"):
            return self._extract_pdf_text(content)
        if filename.endswith(".txt"):
            return content.decode("utf-8", errors="ignore")

        raise ValueError("Unsupported file type. Please upload a PDF or TXT file.")

    def _extract_pdf_text(self, raw_bytes: bytes) -> str:
        with pdfplumber.open(io.BytesIO(raw_bytes)) as pdf:
            pages_text = [page.extract_text() or "" for page in pdf.pages]
        return "\n".join(pages_text)

    def parse_profile(self, text: str) -> CandidateProfile:
        email = self._extract_email(text)
        phone = self._extract_phone(text)
        
        # Try spaCy NER first for name extraction, fallback to heuristic
        spacy_assistant = get_spacy_assistant()
        name = None
        if spacy_assistant.is_available():
            name = spacy_assistant.extract_name_with_ner(text)
        if not name:
            name = self._guess_name(text, email)
        
        # Skill extraction
        # NOTE: We intentionally keep this STRICT and keyword‑based so that
        # we only return skills that are explicitly mentioned in the resume text.
        # spaCy‑based suggestions are avoided here because they can introduce
        # skills that are not actually present in the document.
        skills = self._extract_skills(text)
        
        education = self._extract_education(text)
        experience = self._extract_experience(text)
        certifications = self._extract_certifications(text)

        return CandidateProfile(
            name=name,
            email=email,
            phone=phone,
            skills=skills,
            education=education,
            experience=experience,
            certifications=certifications,
        )

    def _extract_email(self, text: str):
        match = EMAIL_REGEX.search(text)
        return match.group(0) if match else None

    def _extract_phone(self, text: str):
        match = PHONE_REGEX.search(text)
        if not match:
            return None
        return match.group(0)

    def _guess_name(self, text: str, email: str | None) -> str | None:
        """
        Heuristic: take the first non-empty line that isn't obviously a heading
        and doesn't contain contact keywords. If we have an email, prefer a line
        that appears close to it.
        """
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        if not lines:
            return None

        # Try to find a line above the email
        if email:
            email_idx = next(
                (i for i, l in enumerate(lines) if email in l), None  # type: ignore[arg-type]
            )
        else:
            email_idx = None

        candidate_lines: List[str] = []
        if email_idx is not None:
            start = max(0, email_idx - 3)
            candidate_lines.extend(lines[start : email_idx + 1])
        else:
            candidate_lines.extend(lines[:5])

        for line in candidate_lines:
            # Skip if line contains email or phone-like digits
            if EMAIL_REGEX.search(line) or re.search(r"\d", line):
                continue
            # Basic heuristic: 2–4 words, title case
            words = line.split()
            if 1 <= len(words) <= 5 and sum(w[0].isupper() for w in words) >= 1:
                return line

        return None

    def _extract_skills(self, text: str) -> List[str]:
        text_lower = text.lower()
        detected = set()
        for vocab_skill in NORMALISED_SKILLS:
            # Use word boundaries to avoid partial matches
            if re.search(r'\b' + re.escape(vocab_skill) + r'\b', text_lower):
                detected.add(vocab_skill)
        # Return nicely cased skills
        return sorted({skill.title() for skill in detected})

    def _extract_education(self, text: str) -> List[str]:
        education_keywords = [
            "b.tech",
            "b.e",
            "bachelor",
            "master",
            "msc",
            "bsc",
            "mba",
            "phd",
            "university",
            "college",
            "institute",
            "bachelors",
            "masters",
        ]
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        edu_lines: List[str] = []
        for line in lines:
            lower = line.lower()
            if any(k in lower for k in education_keywords):
                edu_lines.append(line)
        return edu_lines

    def _extract_experience(self, text: str) -> List[str]:
        """
        Extract only concrete work / internship experience entries.

        We try to avoid:
        - Generic summary sentences about being a student
        - Education lines that mention degrees/CGPA
        - Section headers like "Experience"
        """
        job_keywords = [
            "intern",
            "internship",
            "developer",
            "engineer",
            "manager",
            "lead",
            "architect",
            "analyst",
        ]
        helper_keywords = [
            "duration",  # e.g. "Duration: Nov 2025 – Dec 2025"
            "worked as",
            "work experience",
        ]
        # Things we explicitly do NOT want in experience items
        exclude_keywords = [
            "b.tech",
            "bachelor",
            "b.e",
            "cgpa",
            "student",
            "education",
            "university",
            "college",
            "institute",
        ]

        lines = [l.strip() for l in text.splitlines() if l.strip()]
        exp_lines: List[str] = []
        for line in lines:
            lower = line.lower()

            # Skip obvious section headers
            if lower in {"experience", "work experience", "professional experience"}:
                continue

            # Skip lines that clearly belong to education or summary
            if any(bad in lower for bad in exclude_keywords):
                continue

            # Keep lines that mention job / role keywords or duration markers
            if any(k in lower for k in job_keywords) or any(
                k in lower for k in helper_keywords
            ):
                exp_lines.append(line)

        return exp_lines

    def _extract_certifications(self, text: str) -> List[str]:
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        cert_lines: List[str] = []
        for line in lines:
            lower = line.lower()
            if "certification" in lower or "certified" in lower:
                cert_lines.append(line)
        return cert_lines


