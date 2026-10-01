from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    app_name: str = "TaskFlow API"
    api_v1_prefix: str = "/api/v1"

    database_url: str = (
        "postgresql+psycopg://taskflow:taskflow@db:5432/taskflow"
    )

    secret_key: str = "change-this-local-development-secret-before-deploying"

    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480

    frontend_origins: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        """Return frontend origins as a list."""
        return [
            origin.strip()
            for origin in self.frontend_origins.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings.""" 
    return Settings()


settings = get_settings()