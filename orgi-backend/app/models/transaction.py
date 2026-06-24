from sqlalchemy import Column, Integer, String, Numeric, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False, index=True)
    fecha = Column(DateTime(timezone=True), nullable=False, index=True)
    tipo = Column(String(15), nullable=False)
    cantidad = Column(Numeric(15, 2), nullable=False)
    descripcion = Column(Text)
    referencia = Column(String(100))
    pdf_import_id = Column(Integer, ForeignKey("pdf_imports.id"), nullable=True)
    is_reconciled = Column(Boolean, default=False)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", backref="transactions")
    account = relationship("Account", back_populates="transactions")
    category = relationship("Category")
    pdf_import = relationship("PDFImport", backref="transactions")
