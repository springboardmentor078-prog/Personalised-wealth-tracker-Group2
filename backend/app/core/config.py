"""Application configuration using environment variables."""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment."""

    SECRET_KEY: str = "dev-secret-key-change-in-production"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/wealth_db"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore",
    }


@lru_cache()
def get_settings() -> Settings:
    """Cached settings instance."""
    return Settings()
