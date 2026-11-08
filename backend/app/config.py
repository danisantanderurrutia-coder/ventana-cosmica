from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Ventana Cósmica API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # LLM Settings
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    
    # Storage Settings
    CHROMA_PERSIST_DIRECTORY: str = "./data/chroma"
    DB_PATH: str = "./data/cosmic_archive.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "*"]

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()
