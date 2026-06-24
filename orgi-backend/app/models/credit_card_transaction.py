from sqlalchemy import Column, Integer, String, Numeric, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class CreditCardTransaction(Base):
    __tablename__ = "credit_card_transactions"

    id = Column(Integer, primary_key=True, index=True)
    credit_card_id = Column(Integer, ForeignKey("credit_cards.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    fecha = Column(DateTime(timezone=True), nullable=False)
    descripcion = Column(Text)
    cantidad = Column(Numeric(15, 2), nullable=False)
    tipo = Column(String(10), nullable=False)
    referencia = Column(String(100))
    pdf_import_id = Column(Integer, ForeignKey("pdf_imports.id"), nullable=True)
    billing_period_start = Column(DateTime(timezone=True))
    billing_period_end = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    credit_card = relationship("CreditCard", backref="transactions")
    category = relationship("Category")
    pdf_import = relationship("PDFImport")
