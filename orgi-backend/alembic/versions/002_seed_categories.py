"""Seed default categories

Revision ID: 002
Revises: 001
Create Date: 2026-06-24
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer, Boolean

revision = "002"
down_revision = "001"
branch_labels = None
depends_on = None

categories_table = table(
    "categories",
    column("user_id", Integer),
    column("name", String),
    column("type", String),
    column("color", String),
    column("icon", String),
    column("is_system", Boolean),
    column("parent_id", Integer),
)

income_categories = [
    {"name": "Salario", "icon": "briefcase", "color": "#0EA472"},
    {"name": "Freelance", "icon": "laptop", "color": "#16BDCA"},
    {"name": "Inversiones", "icon": "trending-up", "color": "#1A56DB"},
    {"name": "Bonificaciones", "icon": "gift", "color": "#FF8800"},
    {"name": "Otros ingresos", "icon": "plus-circle", "color": "#6B7280"},
]

expense_categories = [
    {"name": "Alimentación", "icon": "shopping-cart", "color": "#E02424"},
    {"name": "Transporte", "icon": "navigation", "color": "#FF8800"},
    {"name": "Vivienda", "icon": "home", "color": "#1A56DB"},
    {"name": "Salud", "icon": "heart", "color": "#E02424"},
    {"name": "Educación", "icon": "book", "color": "#16BDCA"},
    {"name": "Entretenimiento", "icon": "film", "color": "#8B5CF6"},
    {"name": "Ropa", "icon": "shirt", "color": "#EC4899"},
    {"name": "Servicios públicos", "icon": "zap", "color": "#FF8800"},
    {"name": "Comunicaciones", "icon": "phone", "color": "#3B82F6"},
    {"name": "Deudas", "icon": "credit-card", "color": "#E02424"},
    {"name": "Ahorros", "icon": "piggy-bank", "color": "#0EA472"},
    {"name": "Otros gastos", "icon": "more-horizontal", "color": "#6B7280"},
]

def upgrade():
    # Create a system user (ID 1) for default categories if not exists
    op.execute("INSERT OR IGNORE INTO users (id, email, hashed_password, full_name) VALUES (1, 'system@orgi.app', '', 'System')")

    for cat in income_categories:
        op.execute(
            f"INSERT OR IGNORE INTO categories (user_id, name, type, color, icon, is_system) "
            f"VALUES (1, '{cat['name']}', 'ingreso', '{cat['color']}', '{cat['icon']}', 1)"
        )

    for cat in expense_categories:
        op.execute(
            f"INSERT OR IGNORE INTO categories (user_id, name, type, color, icon, is_system) "
            f"VALUES (1, '{cat['name']}', 'gasto', '{cat['color']}', '{cat['icon']}', 1)"
        )

def downgrade():
    op.execute("DELETE FROM categories WHERE is_system = 1")
