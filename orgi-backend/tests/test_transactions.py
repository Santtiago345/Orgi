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

def test_update_transaction_recalculates_balance(client, auth_headers, db_session, test_user, test_account, test_category):
    response = client.post("/api/v1/transactions", json={
        "fecha": "2026-06-24T00:00:00Z", "tipo": "gasto",
        "cantidad": "100000.00", "descripcion": "Gasto inicial",
        "account_id": test_account.id, "category_id": test_category.id,
    }, headers=auth_headers)
    tx_id = response.json()["id"]

    from app.models.account import Account
    account = db_session.query(Account).filter(Account.id == test_account.id).first()
    assert account.balance == Decimal("400000.00")

    response = client.put(f"/api/v1/transactions/{tx_id}", json={
        "cantidad": "150000.00",
    }, headers=auth_headers)
    assert response.status_code == 200

    db_session.refresh(account)
    assert account.balance == Decimal("350000.00")

def test_transfer_between_accounts(client, auth_headers, db_session, test_user, test_category):
    from app.models.account import Account
    from app.models.category import Category
    cuenta_a = Account(user_id=test_user.id, name="Cuenta A", type="corriente", balance=Decimal("1000000.00"))
    cuenta_b = Account(user_id=test_user.id, name="Cuenta B", type="ahorros", balance=Decimal("0.00"))
    db_session.add_all([cuenta_a, cuenta_b])
    db_session.commit()
    db_session.refresh(cuenta_a)
    db_session.refresh(cuenta_b)

    cat_income = db_session.query(Category).filter(Category.type == "ingreso").first()
    if not cat_income:
        cat_income = Category(user_id=test_user.id, name="Transferencia", type="ingreso", is_system=True)
        db_session.add(cat_income)
        db_session.commit()
        db_session.refresh(cat_income)

    client.post("/api/v1/transactions", json={
        "fecha": "2026-06-24T00:00:00Z", "tipo": "gasto",
        "cantidad": "500000.00", "descripcion": "Transferencia salida",
        "account_id": cuenta_a.id, "category_id": test_category.id,
    }, headers=auth_headers)

    client.post("/api/v1/transactions", json={
        "fecha": "2026-06-24T00:00:00Z", "tipo": "ingreso",
        "cantidad": "500000.00", "descripcion": "Transferencia entrada",
        "account_id": cuenta_b.id, "category_id": cat_income.id,
    }, headers=auth_headers)

    db_session.refresh(cuenta_a)
    db_session.refresh(cuenta_b)
    assert cuenta_a.balance == Decimal("500000.00")
    assert cuenta_b.balance == Decimal("500000.00")

def test_transaction_belongs_to_user(client, auth_headers, db_session, test_account, test_category):
    from app.models.user import User
    from app.core.security import get_password_hash, create_access_token

    other_user = User(email="other@example.com", hashed_password=get_password_hash("pass123"), full_name="Other")
    db_session.add(other_user)
    db_session.commit()
    db_session.refresh(other_user)

    other_token = create_access_token({"sub": str(other_user.id), "email": other_user.email})
    other_headers = {"Authorization": f"Bearer {other_token}"}

    # Create transaction as original user
    resp = client.post("/api/v1/transactions", json={
        "fecha": "2026-06-24T00:00:00Z", "tipo": "gasto",
        "cantidad": "10000.00", "descripcion": "Privado",
        "account_id": test_account.id, "category_id": test_category.id,
    }, headers=auth_headers)
    tx_id = resp.json()["id"]

    # Other user tries to access it
    response = client.get(f"/api/v1/transactions/{tx_id}", headers=other_headers)
    assert response.status_code == 404

def test_transactions_filter_by_date(client, auth_headers, test_account, test_category):
    client.post("/api/v1/transactions", json={
        "fecha": "2026-06-01T00:00:00Z", "tipo": "gasto",
        "cantidad": "10000.00", "descripcion": "Junio",
        "account_id": test_account.id, "category_id": test_category.id,
    }, headers=auth_headers)
    client.post("/api/v1/transactions", json={
        "fecha": "2026-07-15T00:00:00Z", "tipo": "gasto",
        "cantidad": "20000.00", "descripcion": "Julio",
        "account_id": test_account.id, "category_id": test_category.id,
    }, headers=auth_headers)

    response = client.get(
        "/api/v1/transactions?start_date=2026-06-01T00:00:00Z&end_date=2026-06-30T23:59:59Z",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1, f"Expected 1 transaction in June, got {data['total']}"
