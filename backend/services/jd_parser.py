from typing import List

from ..utils.skills_db import NORMALISED_SKILLS


class JobDescriptionParser:
    """
    Lightweight JD parser that focuses on extracting required skills
    using a shared vocabulary with the resume parser.
    """

    def extract_required_skills(self, jd_text: str) -> List[str]:
        text_lower = jd_text.lower()
        detected = set()
        for vocab_skill in NORMALISED_SKILLS:
            if vocab_skill in text_lower:
                detected.add(vocab_skill)
        return sorted({skill.title() for skill in detected})


