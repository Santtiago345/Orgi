from decimal import Decimal

def test_create_income_updates_account_balance(client, auth_headers, db_session, test_user, test_account, test_category):
    response = client.post("/api/v1/transactions", json={
        "fecha": "2026-06-24T00:00:00Z",
        "tipo": "ingreso",
        "cantidad": "100000.00",
        "descripcion": "Salario",
        "account_id": test_account.id,
        "category_id": test_category.id,
    }, headers=auth_headers)
    assert response.status_code == 201

    # Check balance updated
    from app.models.account import Account
    account = db_session.query(Account).filter(Account.id == test_account.id).first()
    assert account.balance == Decimal("600000.00")

def test_create_expense_reduces_account_balance(client, auth_headers, db_session, test_user, test_account, test_category):
    response = client.post("/api/v1/transactions", json={
        "fecha": "2026-06-24T00:00:00Z",
        "tipo": "gasto",
        "cantidad": "50000.00",
        "descripcion": "Supermercado",
        "account_id": test_account.id,
        "category_id": test_category.id,
    }, headers=auth_headers)
    assert response.status_code == 201

    from app.models.account import Account
    account = db_session.query(Account).filter(Account.id == test_account.id).first()
    assert account.balance == Decimal("450000.00")

def test_list_transactions_pagination(client, auth_headers, test_account, test_category):
    for i in range(5):
        client.post("/api/v1/transactions", json={
            "fecha": "2026-06-24T00:00:00Z",
            "tipo": "gasto",
            "cantidad": "10000.00",
            "descripcion": f"Gasto {i}",
            "account_id": test_account.id,
            "category_id": test_category.id,
        }, headers=auth_headers)

    response = client.get("/api/v1/transactions?page=1&per_page=3", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["data"]) == 3
    assert data["total"] == 5
    assert data["total_pages"] == 2

def test_delete_transaction_restores_balance(client, auth_headers, db_session, test_user, test_account, test_category):
    response = client.post("/api/v1/transactions", json={
        "fecha": "2026-06-24T00:00:00Z",
        "tipo": "gasto",
        "cantidad": "200000.00",
        "descripcion": "Compra grande",
        "account_id": test_account.id,
        "category_id": test_category.id,
    }, headers=auth_headers)
    tx_id = response.json()["id"]

    from app.models.account import Account
    account = db_session.query(Account).filter(Account.id == test_account.id).first()
    assert account.balance == Decimal("300000.00")

    response = client.delete(f"/api/v1/transactions/{tx_id}", headers=auth_headers)
    assert response.status_code == 200

    db_session.refresh(account)
    assert account.balance == Decimal("500000.00")
