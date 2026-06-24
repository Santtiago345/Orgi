"""
Script de introspección y adaptación de la base de datos existente (MyFinance.db).

Usage:
    python -m app.utils.inspect_existing_db --source "Database app/MyFinance.db"
    python -m app.utils.inspect_existing_db --source "Database app/MyFinance.db" --dry-run
"""
import argparse
import json
import sqlite3
import sys
from pathlib import Path
from datetime import datetime
from decimal import Decimal

TABLE_MAPPING = {
    "transaction": {
        "table": "transactions",
        "columns": {
            "uid": "referencia",
            "date": "fecha",
            "comment": "descripcion",
            "type": "tipo",
        },
        "amount_col": "amountInDefaultCurrency",
        "account_link_table": "sync_link",
        "category_link_table": "sync_link",
    },
    "account": {
        "table": "accounts",
        "columns": {
            "uid": "referencia",
            "title": "name",
        },
        "balance_table": "account_balance",
    },
    "category": {
        "table": "categories",
        "columns": {
            "uid": "referencia",
            "title": "name",
            "type": "type",
            "color": "color",
            "icon": "icon",
        },
    },
}

def inspect_db(source_path: str) -> dict:
    conn = sqlite3.connect(source_path)
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    tables = [row[0] for row in cursor.fetchall()]

    report = {"tables": {}, "total_tables": len(tables)}

    for table in tables:
        cursor.execute(f"PRAGMA table_info('{table}')")
        columns = [{"cid": c[0], "name": c[1], "type": c[2], "notnull": c[3], "pk": c[4]} for c in cursor.fetchall()]
        cursor.execute(f"SELECT COUNT(*) FROM '{table}'")
        row_count = cursor.fetchone()[0]
        report["tables"][table] = {"columns": columns, "row_count": row_count}

    conn.close()
    return report

def generate_mapping_report(report: dict) -> str:
    output = []
    output.append("# Reporte de Mapeo - MyFinance.db → ORGI Schema\n")

    for table_name, info in report["tables"].items():
        if table_name in TABLE_MAPPING:
            mapping = TABLE_MAPPING[table_name]
            output.append(f"## Tabla: {table_name} → {mapping['table']}")
            output.append(f"Registros encontrados: {info['row_count']}")
            output.append("")
            output.append("| Columna Origen | Columna Destino | Tipo |")
            output.append("|---------------|-----------------|------|")
            for col in info["columns"]:
                dest = mapping["columns"].get(col["name"], col["name"])
                output.append(f"| {col['name']} | {dest} | {col['type']} |")
            output.append("")

    return "\n".join(output)

def generate_insert_sql(source_path: str, target_user_id: int = 1) -> tuple:
    conn = sqlite3.connect(source_path)
    cursor = conn.cursor()

    sql_statements = []
    stats = {"found": 0, "inserted": 0, "skipped": 0, "errors": 0}
    errors = []

    # Map accounts
    cursor.execute("SELECT uid, title, currencyCode FROM account WHERE isRemoved = 0")
    accounts = cursor.fetchall()
    for uid, title, currency in accounts:
        if not title:
            title = "Cuenta principal"
        sql_statements.append(
            f"INSERT OR IGNORE INTO accounts (user_id, name, type, currency, referencia) "
            f"VALUES ({target_user_id}, '{title}', 'corriente', '{currency or 'COP'}', '{uid}');"
        )
        stats["found"] += 1

    # Map categories
    cursor.execute("SELECT uid, title, type, color, icon FROM category WHERE isRemoved = 0")
    categories = cursor.fetchall()
    for uid, title, cat_type, color, icon in categories:
        tipo = "ingreso" if cat_type == "Income" else "gasto"
        sql_statements.append(
            f"INSERT OR IGNORE INTO categories (user_id, name, type, color, icon, referencia) "
            f"VALUES ({target_user_id}, '{title}', '{tipo}', '{color}', '{icon}', '{uid}');"
        )

    # Map transactions
    cursor.execute("""
        SELECT t.uid, t.date, t.comment, t.type, t.amountInDefaultCurrency,
               sl1.otherUid as account_uid,
               sl2.otherUid as category_uid
        FROM transaction t
        LEFT JOIN sync_link sl1 ON sl1.entityUid = t.uid AND sl1.entityType = 'Transaction' AND sl1.otherType = 'Account'
        LEFT JOIN sync_link sl2 ON sl2.entityUid = t.uid AND sl2.entityType = 'Transaction' AND sl2.otherType = 'Category'
        WHERE t.isRemoved = 0
    """)
    transactions = cursor.fetchall()
    stats["found"] = len(transactions)

    for t in transactions:
        uid, date_str, comment, tx_type, amount, account_uid, category_uid = t
        tipo = "ingreso" if tx_type == "Income" else "gasto"
        cantidad = abs(amount) / 100 if amount else 0  # Convert from cents to major unit
        descripcion = (comment or "").replace("'", "''")
        fecha = date_str or datetime.now().isoformat()
        account_ref = account_uid or "main"
        category_ref = category_uid or ""

        sql_statements.append(
            f"INSERT OR IGNORE INTO transactions (user_id, account_id, category_id, fecha, tipo, cantidad, descripcion, referencia) "
            f"SELECT {target_user_id}, a.id, COALESCE(c.id, 1), '{fecha}', '{tipo}', {cantidad}, '{descripcion}', '{uid}' "
            f"FROM accounts a LEFT JOIN categories c ON c.referencia = '{category_ref}' "
            f"WHERE a.referencia = '{account_ref}';"
        )
        stats["inserted"] += 1

    conn.close()
    return sql_statements, stats, errors

def main():
    parser = argparse.ArgumentParser(description="Inspect and migrate data from existing MyFinance.db")
    parser.add_argument("--source", required=True, help="Path to existing .db file")
    parser.add_argument("--dry-run", action="store_true", help="Only show mapping, don't insert")
    parser.add_argument("--user-id", type=int, default=1, help="Target user ID for imported data")
    args = parser.parse_args()

    source_path = Path(args.source)
    if not source_path.exists():
        print(f"Error: File not found: {args.source}")
        sys.exit(1)

    print(f"=== Inspecting database: {args.source} ===\n")
    report = inspect_db(str(source_path))

    print(generate_mapping_report(report))

    print("\n=== Generating migration SQL ===\n")
    sql_statements, stats, errors = generate_insert_sql(str(source_path), args.user_id)

    print(f"Found: {stats['found']} records to process")
    print(f"Generated: {len(sql_statements)} SQL statements")
    print(f"Estimated inserted: {stats['inserted']}")
    print(f"Estimated skipped (duplicates): {stats['skipped']}")
    print(f"Errors: {stats['errors']}")

    if args.dry_run:
        print("\n=== DRY RUN - No changes made ===\n")
        print("\nSample SQL (first 3 statements):")
        for s in sql_statements[:3]:
            print(f"  {s}")
    else:
        print("\n=== Executing migration... ===")
        # Execute against the new database
        new_conn = sqlite3.connect("data/orgi_dev.db")
        new_cursor = new_conn.cursor()
        for sql in sql_statements:
            try:
                new_cursor.execute(sql)
                stats["inserted"] += 1
            except Exception as e:
                stats["errors"] += 1
                errors.append(str(e))
        new_conn.commit()
        new_conn.close()

        print("\n=== Migration Complete ===")
        print(f"Total inserted: {stats['inserted']}")
        print(f"Skipped (duplicates): {stats['skipped']}")
        print(f"Errors: {stats['errors']}")
        if errors:
            print(f"First error: {errors[0]}")

    if errors:
        print(f"\nErrors encountered: {len(errors)}")
        for e in errors[:5]:
            print(f"  - {e}")

if __name__ == "__main__":
    main()
