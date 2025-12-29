"""
Centralised skill vocabulary.

This list is intentionally broad but focused on common tech + general skills.
It is used both for resume parsing and JD parsing so that we can do
keyword-based matching in a robust way.
"""

CORE_SKILLS = [
    # Programming languages
    "python",
    "java",
    "javascript",
    "typescript",
    "c++",
    "c#",
    "go",
    "rust",
    "sql",
    "html",
    "css",
    # Frameworks & libraries
    "react",
    "react.js",
    "node.js",
    "node",
    "django",
    "flask",
    "fastapi",
    "spring",
    "spring boot",
    "express",
    "vue",
    "angular",
    # Data & ML
    "pandas",
    "numpy",
    "scikit-learn",
    "tensorflow",
    "pytorch",
    "keras",
    "ml",
    "machine learning",
    "deep learning",
    "nlp",
    "data analysis",
    "data engineering",
    # DevOps & cloud
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "ci/cd",
    "jenkins",
    "gitlab ci",
    "github actions",
    # Databases
    "mysql",
    "postgresql",
    "mongodb",
    "redis",
    "elasticsearch",
    # General / soft skills
    "leadership",
    "communication",
    "teamwork",
    "problem solving",
    "project management",
    "agile",
    "scrum",
]


def normalise_skill(skill: str) -> str:
    return skill.strip().lower()


NORMALISED_SKILLS = {normalise_skill(s) for s in CORE_SKILLS}



