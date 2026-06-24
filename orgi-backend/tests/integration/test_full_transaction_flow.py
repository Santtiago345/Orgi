from decimal import Decimal

def test_full_transaction_lifecycle(client, db_session):
    # 1. Register user
    reg = client.post("/api/v1/auth/register", json={
        "email": "flow@test.com",
        "password": "password123",
        "full_name": "Flow User",
    })
    assert reg.status_code == 201
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create account
    acct = client.post("/api/v1/accounts", json={
        "name": "Cuenta Principal",
        "type": "corriente",
        "balance": "0.00",
    }, headers=headers)
    assert acct.status_code == 201
    account_id = acct.json()["id"]

    # 3. Create income category
    cat = client.post("/api/v1/categories", json={
        "name": "Salario",
        "type": "ingreso",
    }, headers=headers)
    cat_id = cat.json()["id"]

    # 4. Create transaction (income)
    tx = client.post("/api/v1/transactions", json={
        "fecha": "2026-06-24T00:00:00Z",
        "tipo": "ingreso",
        "cantidad": "2000000.00",
        "descripcion": "Salario Junio",
        "account_id": account_id,
        "category_id": cat_id,
    }, headers=headers)
    assert tx.status_code == 201
    tx_id = tx.json()["id"]

    # 5. List transactions
    lst = client.get("/api/v1/transactions", headers=headers)
    assert lst.status_code == 200
    assert lst.json()["total"] >= 1

    # 6. Update transaction
    upd = client.put(f"/api/v1/transactions/{tx_id}", json={
        "cantidad": "2500000.00",
    }, headers=headers)
    assert upd.status_code == 200

    # 7. Delete transaction
    dlt = client.delete(f"/api/v1/transactions/{tx_id}", headers=headers)
    assert dlt.status_code == 200
