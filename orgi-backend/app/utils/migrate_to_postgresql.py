"""Migrate all data from SQLite to PostgreSQL.

Usage:
    python -m app.utils.migrate_to_postgresql "postgresql://user:pass@host:5432/db"
    python -m app.utils.migrate_to_postgresql "postgresql://user:pass@host:5432/db" --sqlite-path "data/orgi_dev.db"
"""
import argparse
import sys
from datetime import date, datetime
from decimal import Decimal
from pathlib import Path
from sqlalchemy import create_engine, MetaData, text
from sqlalchemy.orm import Session
from app.core.database import Base
from app.models import (
    User, Account, Category, Transaction, Debt, DebtPayment,
    CreditCard, CreditCardTransaction, PDFImport, Budget
)

ALL_MODELS = [
    User, Account, Category, Transaction, Debt, DebtPayment,
    CreditCard, CreditCardTransaction, PDFImport, Budget
]

def get_sqlite_data(sqlite_path: str) -> dict:
    engine = create_engine(f"sqlite:///{sqlite_path}", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    session = Session(engine)
    data = {}
    for model in ALL_MODELS:
        rows = session.query(model).all()
        data[model.__tablename__] = rows
    session.close()
    engine.dispose()
    return data

def migrate(pg_url: str, sqlite_path: str):
    print(f"Reading data from SQLite: {sqlite_path}")
    data = get_sqlite_data(sqlite_path)
    for table, rows in data.items():
        print(f"  {table}: {len(rows)} rows")

    print(f"\nConnecting to PostgreSQL...")
    pg_engine = create_engine(pg_url)
    Base.metadata.drop_all(bind=pg_engine)
    Base.metadata.create_all(bind=pg_engine)
    pg_session = Session(pg_engine)

    try:
        for model in ALL_MODELS:
            rows = data[model.__tablename__]
            if not rows:
                print(f"  Skipping {model.__tablename__} (empty)")
                continue

            for row in rows:
                row_dict = {c.name: getattr(row, c.name) for c in model.__table__.columns}
                cleaned = {}
                for k, v in row_dict.items():
                    if isinstance(v, Decimal):
                        v = float(v)
                    elif isinstance(v, datetime):
                        v = v.replace(tzinfo=None)
                    elif isinstance(v, date):
                        pass
                    cleaned[k] = v
                pg_session.execute(model.__table__.insert().values(**cleaned))
            pg_session.commit()
            print(f"  Migrated {model.__tablename__}: {len(rows)} rows")

        print("\nMigration complete!")
    except Exception as e:
        pg_session.rollback()
        print(f"\nError during migration: {e}")
        sys.exit(1)
    finally:
        pg_session.close()
        pg_engine.dispose()

def main():
    parser = argparse.ArgumentParser(description="Migrate SQLite data to PostgreSQL")
    parser.add_argument("pg_url", help="PostgreSQL connection string")
    parser.add_argument("--sqlite-path", default="data/orgi_dev.db", help="Path to SQLite database")
    args = parser.parse_args()
    migrate(args.pg_url, args.sqlite_path)

if __name__ == "__main__":
    main()
