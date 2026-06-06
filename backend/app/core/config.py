"""
Application settings loaded from the .env file.
Switch AI providers by changing AI_PROVIDER to "claude", "openai", "openrouter", or "groq".
"""
from pydantic_settings import BaseSettings
from typing import Literal


class Settings(BaseSettings):
    # AI Provider: "claude", "openai", "openrouter", or "groq"
    AI_PROVIDER: Literal["claude", "openai", "openrouter", "groq"] = "groq"

    # Claude (Anthropic)
    ANTHROPIC_API_KEY: str = ""
    CLAUDE_MODEL: str = "claude-sonnet-4-6"

    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"

    # OpenRouter
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "openai/gpt-oss-120b:free"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"

    # Groq — fast free inference
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GROQ_BASE_URL: str = "https://api.groq.com/openai/v1"

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
