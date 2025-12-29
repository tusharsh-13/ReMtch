from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import parse, match


def create_app() -> FastAPI:
    """
    Application factory so this can be imported by uvicorn easily:
    uvicorn backend.main:app --reload
    """
    app = FastAPI(
        title="Smart Resume Parser + Role Match API",
        description="Hackathon-grade API for parsing resumes and matching them to job descriptions.",
        version="1.0.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(parse.router, prefix="/api")
    app.include_router(match.router, prefix="/api")

    @app.get("/health")
    async def health_check():
        return {"status": "ok"}

    return app


app = create_app()



