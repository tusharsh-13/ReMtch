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
    "php",
    "ruby",
    "swift",
    "kotlin",
    "scala",
    "r",
    "matlab",
    "bash",
    "shell",
    "powershell",
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
    "jquery",
    "bootstrap",
    "tailwind",
    "sass",
    "less",
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
    "natural language processing",
    "computer vision",
    "opencv",
    "data analysis",
    "data engineering",
    "big data",
    "hadoop",
    "spark",
    "kafka",
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
    "terraform",
    "ansible",
    "puppet",
    "chef",
    # Databases
    "mysql",
    "postgresql",
    "mongodb",
    "redis",
    "elasticsearch",
    "oracle",
    "sqlite",
    "cassandra",
    "dynamodb",
    # Tools & platforms
    "git",
    "github",
    "gitlab",
    "bitbucket",
    "jira",
    "confluence",
    "slack",
    "trello",
    "figma",
    "adobe xd",
    "postman",
    "swagger",
    "linux",
    "windows",
    "macos",
    # Other technical
    "api",
    "rest",
    "graphql",
    "json",
    "xml",
    "yaml",
    "microservices",
    "serverless",
    "blockchain",
    "iot",
]


def normalise_skill(skill: str) -> str:
    return skill.strip().lower()


NORMALISED_SKILLS = {normalise_skill(s) for s in CORE_SKILLS}



