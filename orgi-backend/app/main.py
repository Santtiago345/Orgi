from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.core.exception_handlers import (
    http_exception_handler,
    validation_exception_handler,
    integrity_error_handler,
    general_exception_handler,
)
from fastapi.exceptions import HTTPException
from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError
from app.api.v1 import router as api_v1_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="orgi API",
    version="1.0.0",
    description="API de gestión financiera personal",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router, prefix="/api/v1")

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(ValidationError, validation_exception_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)
app.add_exception_handler(Exception, general_exception_handler)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}
