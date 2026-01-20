"""
spaCy NLP Assistant for enhanced resume and JD parsing.

Uses spaCy for:
- Named Entity Recognition (NER) for better name extraction
- Part-of-speech tagging for skill extraction
- Dependency parsing for structured data extraction
"""

try:
    import spacy
    from spacy import displacy
    SPACY_AVAILABLE = True
except ImportError:
    SPACY_AVAILABLE = False

from typing import List, Optional, Dict


class SpacyAssistant:
    """
    spaCy-powered NLP assistant for resume and job description analysis.
    Falls back gracefully if spaCy is not installed.
    """

    def __init__(self):
        self.nlp = None
        if SPACY_AVAILABLE:
            try:
                # Try to load English model, fallback to small if not available
                try:
                    self.nlp = spacy.load("en_core_web_sm")
                except OSError:
                    # Model not installed, will use basic tokenization
                    self.nlp = None
            except Exception:
                self.nlp = None

    def is_available(self) -> bool:
        """Check if spaCy is available and loaded."""
        return self.nlp is not None

    def extract_entities(self, text: str) -> Dict[str, List[str]]:
        """
        Extract named entities using spaCy NER.
        Returns a dict with entity types as keys and lists of entities as values.
        """
        if not self.is_available():
            return {}

        doc = self.nlp(text[:1000000])  # Limit to 1M chars for performance
        entities = {
            "PERSON": [],
            "ORG": [],
            "GPE": [],  # Geopolitical entities (countries, cities)
            "DATE": [],
            "MONEY": [],
        }

        for ent in doc.ents:
            if ent.label_ in entities:
                entities[ent.label_].append(ent.text.strip())

        # Deduplicate
        for key in entities:
            entities[key] = list(set(entities[key]))

        return entities

    def extract_name_with_ner(self, text: str) -> Optional[str]:
        """
        Extract candidate name using spaCy NER (PERSON entities).
        Returns the most likely candidate name, preferring entities that:
        - Appear near the TOP of the document
        - Look like real person names (no digits, not generic words or titles)
        """
        if not self.is_available():
            return None

        # Work directly with the doc so we can use entity positions
        doc = self.nlp(text[:50000])

        # Common non‑name phrases that sometimes get tagged as PERSON
        banned_phrases = {
            "resume",
            "cv",
            "curriculum",
            "vitae",
            "software engineer",
            "software developer",
            "full stack developer",
            "data scientist",
            "data analyst",
            "machine learning engineer",
        }

        candidates = []
        for ent in doc.ents:
            if ent.label_ != "PERSON":
                continue

            person = ent.text.strip()
            lower_person = person.lower()

            # Filter out unlikely names: too short, contain digits, or are common words/titles
            words = person.split()
            if (
                len(words) < 2  # At least first + last name
                or len(person) < 5  # Minimum length
                or any(char.isdigit() for char in person)  # No digits
                or lower_person in banned_phrases  # Not generic titles
            ):
                continue

            # Prefer entities that appear near the top of the document
            start_pos = ent.start_char
            candidates.append((start_pos, -len(person), person))

        if not candidates:
            return None

        # Sort by: (position in text, then longer names first)
        candidates.sort()
        return candidates[0][2]

    def extract_skills_with_pos(self, text: str, skill_keywords: List[str]) -> List[str]:
        """
        Extract skills using POS tagging to identify noun phrases and technical terms.
        Combines with keyword matching for better accuracy.
        """
        if not self.is_available():
            return []

        doc = self.nlp(text[:50000])  # Limit for performance
        detected_skills = set()

        # Extract noun phrases that might be skills
        for chunk in doc.noun_chunks:
            chunk_text = chunk.text.lower().strip()
            # Check if noun phrase matches any skill keyword
            for skill in skill_keywords:
                if skill.lower() in chunk_text or chunk_text in skill.lower():
                    detected_skills.add(skill)

        # Also check individual tokens that are proper nouns or nouns
        for token in doc:
            if token.pos_ in ["NOUN", "PROPN"] and not token.is_stop:
                token_text = token.text.lower().strip()
                for skill in skill_keywords:
                    if skill.lower() == token_text or skill.lower() in token_text:
                        detected_skills.add(skill)

        return sorted(list(detected_skills))

    def extract_organizations(self, text: str) -> List[str]:
        """Extract organization names using NER."""
        if not self.is_available():
            return []

        entities = self.extract_entities(text)
        return entities.get("ORG", [])

    def analyze_job_description(self, jd_text: str) -> Dict:
        """
        Comprehensive analysis of job description using spaCy.
        Returns structured insights about requirements, skills, and entities.
        """
        if not self.is_available():
            return {
                "entities": {},
                "key_phrases": [],
                "requirements": [],
            }

        doc = self.nlp(jd_text[:100000])
        entities = self.extract_entities(jd_text)

        # Extract key phrases (noun phrases that might indicate requirements)
        key_phrases = []
        for chunk in doc.noun_chunks[:50]:  # Limit to top 50
            if len(chunk.text.split()) >= 2:  # Multi-word phrases
                key_phrases.append(chunk.text.strip())

        # Extract requirement-like sentences
        requirements = []
        for sent in doc.sents[:20]:  # Limit to first 20 sentences
            sent_text = sent.text.strip()
            # Look for sentences with requirement indicators
            if any(
                word in sent_text.lower()
                for word in ["required", "must", "should", "need", "experience", "skills"]
            ):
                requirements.append(sent_text)

        return {
            "entities": entities,
            "key_phrases": key_phrases[:10],
            "requirements": requirements[:5],
        }

    def get_insights(self, resume_text: str, jd_text: str) -> Dict:
        """
        Generate AI insights comparing resume and job description.
        Uses spaCy for semantic understanding.
        """
        if not self.is_available():
            return {
                "summary": "spaCy NLP assistant is not available. Using basic matching.",
                "recommendations": [],
            }

        resume_doc = self.nlp(resume_text[:50000])
        jd_doc = self.nlp(jd_text[:50000])

        # Extract key terms from both
        resume_nouns = [
            token.lemma_.lower()
            for token in resume_doc
            if token.pos_ == "NOUN" and not token.is_stop
        ]
        jd_nouns = [
            token.lemma_.lower()
            for token in jd_doc
            if token.pos_ == "NOUN" and not token.is_stop
        ]

        # Find common terms
        common_terms = set(resume_nouns) & set(jd_nouns)

        recommendations = []
        if len(common_terms) < 5:
            recommendations.append(
                "Consider highlighting more relevant technical terms in your resume."
            )

        summary = f"Analyzed {len(resume_doc)} resume tokens and {len(jd_doc)} JD tokens. Found {len(common_terms)} common terms."

        return {
            "summary": summary,
            "recommendations": recommendations,
            "common_terms": list(common_terms)[:10],
        }


# Global instance
_assistant = None


def get_spacy_assistant() -> SpacyAssistant:
    """Get or create the global spaCy assistant instance."""
    global _assistant
    if _assistant is None:
        _assistant = SpacyAssistant()
    return _assistant








