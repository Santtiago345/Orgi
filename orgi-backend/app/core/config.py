from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./data/orgi_dev.db"
    SECRET_KEY: str = "dev-secret-key-change-in-production-min-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    FRONTEND_URL: str = "http://localhost:3000"
    ENVIRONMENT: str = "development"
    MAX_PDF_SIZE_MB: int = 10
    EXISTING_DB_PATH: str = "../Database app/MyFinance.db"

    class Config:
        env_file = ".env"

settings = Settings()
