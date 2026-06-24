"""Initial schema with all tables

Revision ID: 001
Revises:
Create Date: 2026-06-24
"""
from alembic import op
import sqlalchemy as sa

revision = "001"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("email", sa.String(255), unique=True, nullable=False, index=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("currency", sa.String(3), server_default="COP"),
        sa.Column("timezone", sa.String(50), server_default="America/Bogota"),
        sa.Column("is_active", sa.Boolean(), server_default="1"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    op.create_table(
        "accounts",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("type", sa.String(20), nullable=False),
        sa.Column("bank_name", sa.String(255)),
        sa.Column("balance", sa.Numeric(15, 2), server_default="0"),
        sa.Column("currency", sa.String(3), server_default="COP"),
        sa.Column("color", sa.String(7), server_default="#1A56DB"),
        sa.Column("icon", sa.String(50)),
        sa.Column("is_active", sa.Boolean(), server_default="1"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("type", sa.String(10), nullable=False),
        sa.Column("color", sa.String(7), server_default="#6B7280"),
        sa.Column("icon", sa.String(50)),
        sa.Column("parent_id", sa.Integer(), sa.ForeignKey("categories.id"), nullable=True),
        sa.Column("is_system", sa.Boolean(), server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    op.create_table(
        "credit_cards",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("bank_name", sa.String(255)),
        sa.Column("last_four_digits", sa.String(4)),
        sa.Column("credit_limit", sa.Numeric(15, 2), server_default="0"),
        sa.Column("current_balance", sa.Numeric(15, 2), server_default="0"),
        sa.Column("billing_cycle_day", sa.Integer()),
        sa.Column("payment_due_day", sa.Integer()),
        sa.Column("interest_rate", sa.Numeric(5, 4)),
        sa.Column("color", sa.String(7), server_default="#1A56DB"),
        sa.Column("is_active", sa.Boolean(), server_default="1"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    op.create_table(
        "debts",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("creditor_name", sa.String(255)),
        sa.Column("type", sa.String(20), nullable=False),
        sa.Column("original_amount", sa.Numeric(15, 2), server_default="0"),
        sa.Column("current_balance", sa.Numeric(15, 2), server_default="0"),
        sa.Column("interest_rate", sa.Numeric(5, 4)),
        sa.Column("monthly_payment", sa.Numeric(15, 2)),
        sa.Column("start_date", sa.Date()),
        sa.Column("end_date", sa.Date()),
        sa.Column("next_payment_date", sa.Date()),
        sa.Column("status", sa.String(10), server_default="activa"),
        sa.Column("notes", sa.Text()),
        sa.Column("is_active", sa.Boolean(), server_default="1"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    op.create_table(
        "pdf_imports",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("filename", sa.String(255)),
        sa.Column("file_size", sa.Integer()),
        sa.Column("bank_name", sa.String(100)),
        sa.Column("account_hint", sa.String(255)),
        sa.Column("import_date", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("status", sa.String(20), server_default="procesando"),
        sa.Column("transactions_found", sa.Integer(), server_default="0"),
        sa.Column("transactions_imported", sa.Integer(), server_default="0"),
        sa.Column("error_message", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    op.create_table(
        "transactions",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("account_id", sa.Integer(), sa.ForeignKey("accounts.id"), nullable=False, index=True),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id"), nullable=False, index=True),
        sa.Column("fecha", sa.DateTime(timezone=True), nullable=False, index=True),
        sa.Column("tipo", sa.String(15), nullable=False),
        sa.Column("cantidad", sa.Numeric(15, 2), nullable=False),
        sa.Column("descripcion", sa.Text()),
        sa.Column("referencia", sa.String(100)),
        sa.Column("pdf_import_id", sa.Integer(), sa.ForeignKey("pdf_imports.id"), nullable=True),
        sa.Column("is_reconciled", sa.Boolean(), server_default="0"),
        sa.Column("notes", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    op.create_table(
        "credit_card_transactions",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("credit_card_id", sa.Integer(), sa.ForeignKey("credit_cards.id"), nullable=False, index=True),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id"), nullable=True),
        sa.Column("fecha", sa.DateTime(timezone=True), nullable=False),
        sa.Column("descripcion", sa.Text()),
        sa.Column("cantidad", sa.Numeric(15, 2), nullable=False),
        sa.Column("tipo", sa.String(10), nullable=False),
        sa.Column("referencia", sa.String(100)),
        sa.Column("pdf_import_id", sa.Integer(), sa.ForeignKey("pdf_imports.id"), nullable=True),
        sa.Column("billing_period_start", sa.DateTime(timezone=True)),
        sa.Column("billing_period_end", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    op.create_table(
        "debt_payments",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("debt_id", sa.Integer(), sa.ForeignKey("debts.id"), nullable=False, index=True),
        sa.Column("transaction_id", sa.Integer(), sa.ForeignKey("transactions.id"), nullable=True),
        sa.Column("payment_date", sa.Date(), nullable=False),
        sa.Column("amount", sa.Numeric(15, 2), nullable=False),
        sa.Column("principal_portion", sa.Numeric(15, 2)),
        sa.Column("interest_portion", sa.Numeric(15, 2)),
        sa.Column("notes", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    op.create_table(
        "budgets",
        sa.Column("id", sa.Integer(), primary_key=True, index=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id"), nullable=False),
        sa.Column("month", sa.Integer(), nullable=False),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("amount_limit", sa.Numeric(15, 2), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
        sa.UniqueConstraint("user_id", "category_id", "month", "year", name="uq_budget_period"),
    )

def downgrade():
    op.drop_table("budgets")
    op.drop_table("debt_payments")
    op.drop_table("credit_card_transactions")
    op.drop_table("transactions")
    op.drop_table("pdf_imports")
    op.drop_table("debts")
    op.drop_table("credit_cards")
    op.drop_table("categories")
    op.drop_table("accounts")
    op.drop_table("users")
