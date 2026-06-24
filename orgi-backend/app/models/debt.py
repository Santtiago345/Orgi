from sqlalchemy import Column, Integer, String, Numeric, Date, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Debt(Base):
    __tablename__ = "debts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    creditor_name = Column(String(255))
    type = Column(String(20), nullable=False)
    original_amount = Column(Numeric(15, 2), default=0)
    current_balance = Column(Numeric(15, 2), default=0)
    interest_rate = Column(Numeric(5, 4))
    monthly_payment = Column(Numeric(15, 2))
    start_date = Column(Date)
    end_date = Column(Date)
    next_payment_date = Column(Date)
    status = Column(String(10), default="activa")
    notes = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", backref="debts")
