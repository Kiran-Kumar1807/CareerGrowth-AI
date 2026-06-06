"""
Application settings loaded from the .env file.
Switch AI providers by changing AI_PROVIDER to "claude", "openai", or "openrouter".
"""
from pydantic_settings import BaseSettings
from typing import Literal


class Settings(BaseSettings):
    # AI Provider: "claude", "openai", or "openrouter"
    AI_PROVIDER: Literal["claude", "openai", "openrouter"] = "openrouter"

    # Claude (Anthropic)
    ANTHROPIC_API_KEY: str = ""
    CLAUDE_MODEL: str = "claude-sonnet-4-6"

    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"

    # OpenRouter — OpenAI-compatible API that proxies many models
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "openai/gpt-oss-120b:free"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"

    # App
    APP_NAME: str = "CareerGrowth AI"
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5174",
        "https://careergrowth-ai-1.onrender.com",
    ]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
