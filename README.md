## Smart Resume Parser + Role Match

AI-powered resume screening & role matching in seconds.

### Problem

Recruiters and hiring teams waste time manually scanning resumes and comparing them to job descriptions. Formatting is inconsistent, skills are buried in prose, and it is hard to quickly see how well a candidate fits a role.

### Solution

**Smart Resume Parser + Role Match** is a hackathon-grade, production-ready prototype that:

- **Parses resumes (PDF/TXT)** into a **structured candidate profile**
- **Extracts skills** from both resume and job description
- Computes an **intelligent match score** using:
  - Skill overlap
  - **spaCy NLP** for enhanced entity extraction and text understanding
  - **TF-IDF + cosine similarity** for semantic matching
  - Cosine similarity between resume and JD
- Returns:
  - **Match %**
  - **Matched skills**
  - **Missing skills**
  - Detailed structured profile for demo & review

The UI is dark, glassmorphic, and designed to look premium in a live demo.

### Tech Stack

- **Backend**
  - Python, FastAPI, uvicorn
  - pdfplumber (PDF text extraction)
  - **spaCy** (NLP for named entity recognition, POS tagging, and enhanced parsing)
  - scikit-learn (TF‑IDF + cosine similarity)
  - pydantic (schemas)
- **Frontend**
  - React + Vite
  - Tailwind CSS
  - Framer Motion (animations)
  - Lucide Icons
  - Axios for API calls

### Project Structure

- `backend/`
  - `main.py` – FastAPI app + CORS + routing
  - `routes/parse.py` – `POST /api/parse-resume`
  - `routes/match.py` – `POST /api/match`
  - `services/resume_parser.py` – text extraction + profile parsing
  - `services/jd_parser.py` – JD skill extraction
  - `services/matcher.py` – skill + semantic matching engine
  - `models/schemas.py` – pydantic models
  - `utils/skills_db.py` – centralised skill vocabulary
  - `requirements.txt`
- `frontend/`
  - Vite + React app with Tailwind, Framer Motion, Lucide icons
  - `src/services/api.js` – Axios client & API helpers
  - `src/components/*` – layout, hero, analyzer, results, toasts, match circle

### Backend – Running Locally

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate  # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Install spaCy English model (optional but recommended for better text processing)
python -m spacy download en_core_web_sm

uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

#### Key Endpoints

- **Health**
  - `GET /health`
- **Parse Resume**
  - `POST /api/parse-resume`
  - Form-data: `file` (PDF/TXT)
- **Match Resume to JD**
  - `POST /api/match`
  - Form-data:
    - `file` – resume (PDF/TXT)
    - `job_description` – plain text JD

Response (simplified):

```json
{
  "candidate_profile": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1 555 123 4567",
    "skills": ["Python", "React", "Fastapi"],
    "education": ["B.Tech in Computer Science, XYZ University"],
    "experience": ["3+ years experience as Software Engineer at ABC Corp"],
    "certifications": ["AWS Certified Solutions Architect"]
  },
  "match_score": 82.4,
  "matched_skills": ["Python", "React"],
  "missing_skills": ["Docker"],
  "semantic_similarity": 78.1,
  "skill_match_percentage": 85.0
}
```

### Frontend – Running Locally

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

By default it points to the backend at `http://localhost:8000/api`. You can override this with:

```bash
VITE_API_BASE_URL="http://localhost:8000/api" npm run dev
```

### How It Works

- **Resume Parsing**
  - Detects file type (PDF vs TXT)
  - Uses **pdfplumber** for high-quality PDF text extraction
  - Uses regex to extract **email** and **phone**
  - Heuristics to guess **name** from nearby lines
  - Matches against a curated **skills vocabulary**
  - Uses keyword heuristics to extract **education**, **experience**, **certifications**
- **JD Parsing**
  - Scans job description, normalises text
  - Extracts required skills by intersecting with the shared skill vocabulary
- **Matching Engine**
  - Builds TF‑IDF vectors for resume + JD and computes **cosine similarity**
  - Computes skill overlap (matched vs missing)
  - Combines:
    - Skill Match % (over JD skill list)
    - Semantic Similarity % (TF‑IDF cosine)
  - **Final Score**:
    \[
    \text{Final Score} = 0.7 \times \text{Skill Match \%} + 0.3 \times \text{Semantic Similarity \%}
    \]

### UI Highlights

- Dark, gradient-backed layout inspired by modern Web3 dashboards
- Glassmorphic panels with subtle shadows
- Hero section with CTA: **“Analyze Resume”**
- Analyzer panel:
  - Resume upload (PDF/TXT)
  - JD textarea
  - Primary **“Analyze Match”** button
- Result section:
  - Structured candidate profile
  - Circular **Match Score** visualization
  - Matched skills (green chips)
  - Missing skills (red chips)
  - Semantic vs skill match metrics
- Toast notifications for:
  - Missing input
  - API errors
  - Successful analysis

### Demo Flow

1. Start backend (`uvicorn`) and frontend (`npm run dev`).
2. Open the app in your browser.
3. Click **“Analyze Resume”** to scroll to the analyzer.
4. Upload a candidate resume (PDF or TXT).
5. Paste a job description.
6. Click **“Analyze Match”**.
7. Show:
   - Parsed candidate profile
   - Match score + skills breakdown
   - Talk through how the engine combines skills + semantics.

This project is designed to be a strong hackathon demo: visually premium, technically grounded, and easy to extend with more advanced NLP (embeddings, LLMs) later.


