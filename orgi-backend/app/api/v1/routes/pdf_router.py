import os
import tempfile
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.core.config import settings
from app.models.pdf_import import PDFImport
from app.services.pdf_service import PDFProcessor
from app.schemas.pdf_import import PDFUploadResponse, PDFImportResponse, PDFConfirmRequest, PDFConfirmResponse

router = APIRouter()

@router.post("/upload", response_model=PDFUploadResponse, status_code=202)
async def upload_pdf(
    file: UploadFile = File(...),
    account_id: Optional[int] = Form(None),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    file_size = 0
    contents = await file.read()
    file_size = len(contents)
    if file_size > settings.MAX_PDF_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds maximum size of {settings.MAX_PDF_SIZE_MB}MB")

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    try:
        tmp.write(contents)
        tmp.close()

        user_id = int(current_user["sub"])
        processor = PDFProcessor(tmp.name, user_id, db, account_id)
        result = processor.process()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF processing error: {str(e)}")
    finally:
        os.unlink(tmp.name)

    return PDFUploadResponse(import_id=result.import_id, status=result.status)

@router.get("/import/{import_id}", response_model=PDFImportResponse)
def get_import_status(import_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    pdf_import = db.query(PDFImport).filter(PDFImport.id == import_id, PDFImport.user_id == user_id).first()
    if not pdf_import:
        raise HTTPException(status_code=404, detail="Import not found")
    return pdf_import

@router.get("/imports")
def list_imports(
    status: Optional[str] = Query(None, pattern="^(procesando|completado|error|revision)$"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = int(current_user["sub"])
    query = db.query(PDFImport).filter(PDFImport.user_id == user_id)
    if status:
        query = query.filter(PDFImport.status == status)
    total = query.count()
    items = query.order_by(PDFImport.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    return {"data": items, "total": total, "page": page, "per_page": per_page}

@router.post("/import/{import_id}/confirm", response_model=PDFConfirmResponse)
def confirm_import(import_id: int, data: PDFConfirmRequest, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user_id = int(current_user["sub"])
    pdf_import = db.query(PDFImport).filter(PDFImport.id == import_id, PDFImport.user_id == user_id).first()
    if not pdf_import:
        raise HTTPException(status_code=404, detail="Import not found")
    if pdf_import.status != "revision":
        raise HTTPException(status_code=400, detail="Import is not in revision status")

    pdf_import.status = "completado"
    db.commit()
    return PDFConfirmResponse(import_id=import_id, status="completado", imported_count=pdf_import.transactions_imported)
