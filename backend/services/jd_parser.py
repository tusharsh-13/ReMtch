from typing import List

from ..utils.skills_db import NORMALISED_SKILLS


class JobDescriptionParser:
    """
    Lightweight JD parser that focuses on extracting required skills
    using a shared vocabulary with the resume parser.
    """

    def extract_required_skills(self, jd_text: str) -> List[str]:
        """
        Extract required skills from the raw JD text.

        We keep this STRICT and only match complete words/phrases from the shared
        skill vocabulary so the computed skill‑match percentage reflects real,
        explicit requirements in the JD.
        """
        import re

        text_lower = jd_text.lower()
        detected = set()
        for vocab_skill in NORMALISED_SKILLS:
            # Use word boundaries to avoid partial matches (e.g. "sql" in "mysql")
            pattern = r"\b" + re.escape(vocab_skill) + r"\b"
            if re.search(pattern, text_lower):
                detected.add(vocab_skill)

        return sorted({skill.title() for skill in detected})


