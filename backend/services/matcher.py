from dataclasses import dataclass
from typing import List

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from models.schemas import MatchEngineResult
from utils.skills_db import normalise_skill


@dataclass
class _InternalMatchResult:
    match_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    semantic_similarity: float
    skill_match_percentage: float


class MatchEngine:
    """
    Combines:
    - skill overlap between candidate and JD
    - semantic similarity using TF-IDF + cosine similarity

    Final Score (strict):
    - Strongly prioritises hard skill overlap over loose textual similarity.
    - Penalises missing required skills aggressively so scores are conservative.
    """

    def __init__(self) -> None:
        self.vectorizer = TfidfVectorizer(stop_words="english")

    def compute_match(
        self,
        resume_text: str,
        job_description: str,
        candidate_skills: List[str],
        jd_skills: List[str],
    ) -> MatchEngineResult:
        semantic_similarity = self._semantic_similarity(resume_text, job_description)
        (
            matched_skills,
            missing_skills,
            skill_match_percentage,
        ) = self._skill_overlap(candidate_skills, jd_skills)

        # Make skill matching stricter:
        # - non‑linear curve (squaring the ratio) so partial matches score much lower
        # - cap semantic contribution when many JD skills are missing
        strict_skill_score = self._strict_skill_score(skill_match_percentage)
        strict_semantic = self._strict_semantic_score(
            semantic_similarity, skill_match_percentage
        )

        # Heavier weight on skills vs semantics for stricter behaviour
        final_score = 0.8 * strict_skill_score + 0.2 * strict_semantic

        internal = _InternalMatchResult(
            match_score=round(final_score, 2),
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            semantic_similarity=round(semantic_similarity, 2),
            skill_match_percentage=round(skill_match_percentage, 2),
        )

        return MatchEngineResult(**internal.__dict__)

    def _semantic_similarity(self, resume_text: str, job_description: str) -> float:
        corpus = [resume_text, job_description]
        tfidf_matrix = self.vectorizer.fit_transform(corpus)
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        # Scale to percentage
        return float(similarity * 100)

    def _strict_skill_score(self, raw_skill_percentage: float) -> float:
        """
        Convert a raw skill match percentage to a stricter score.

        Example:
        - 30% raw overlap -> ~9% strict
        - 50% raw overlap -> 25% strict
        - 80% raw overlap -> 64% strict
        - 100% raw overlap -> 100% strict
        """
        ratio = max(0.0, min(1.0, raw_skill_percentage / 100.0))
        strict = ratio**2 * 100.0
        return strict

    def _strict_semantic_score(
        self, raw_semantic_percentage: float, raw_skill_percentage: float
    ) -> float:
        """
        Make semantic similarity less generous when skills do not overlap much.

        - If skill match < 40%, heavily dampen semantic similarity.
        - If skill match >= 80%, allow semantic similarity to contribute more.
        """
        semantic = max(0.0, min(100.0, raw_semantic_percentage))
        skills = max(0.0, min(100.0, raw_skill_percentage))

        if skills < 20:
            # Very low skill overlap → semantic similarity almost ignored
            return semantic * 0.15
        if skills < 40:
            return semantic * 0.35
        if skills < 60:
            return semantic * 0.6
        if skills < 80:
            return semantic * 0.8
        # High overlap – trust semantic signal more
        return semantic

    def _skill_overlap(
        self, candidate_skills: List[str], jd_skills: List[str]
    ) -> tuple[List[str], List[str], float]:
        cand_norm = {normalise_skill(s) for s in candidate_skills}
        jd_norm = {normalise_skill(s) for s in jd_skills}

        if not jd_norm:
            # Edge case: JD had no recognised skills
            return sorted(candidate_skills), [], 100.0

        matched_norm = cand_norm & jd_norm
        missing_norm = jd_norm - cand_norm

        skill_match_percentage = (len(matched_norm) / len(jd_norm)) * 100 if jd_norm else 0

        matched_skills = sorted({s.title() for s in matched_norm})
        missing_skills = sorted({s.title() for s in missing_norm})

        return matched_skills, missing_skills, float(skill_match_percentage)


