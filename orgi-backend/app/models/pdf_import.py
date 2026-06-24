from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class PDFImport(Base):
    __tablename__ = "pdf_imports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    filename = Column(String(255))
    file_size = Column(Integer)
    bank_name = Column(String(100))
    account_hint = Column(String(255))
    import_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(20), default="procesando")
    transactions_found = Column(Integer, default=0)
    transactions_imported = Column(Integer, default=0)
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", backref="pdf_imports")
