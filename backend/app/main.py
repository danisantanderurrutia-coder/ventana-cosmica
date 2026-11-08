from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes.documents import router as documents_router
from app.services.seed_data import load_seed_documents

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load canonical initial intelligence documents
    print("[CosmicArchive] Initializing knowledge base and truth-filter...")
    load_seed_documents()
    print("[CosmicArchive] Loaded seed intelligence across all 4 streams.")
    yield
    # Teardown logic if required
    print("[CosmicArchive] Shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligence Aggregator & Truth-Filter for Anomalous Phenomena & Metaphysical Literature",
    lifespan=lifespan
)

# Set CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["system"])
async def health_check():
    return {
        "status": "online",
        "service": "Ventana Cósmica API Gateway",
        "version": settings.VERSION
    }
