def test_full_debt_lifecycle(client, db_session):
    # Register user
    reg = client.post("/api/v1/auth/register", json={
        "email": "debt-flow@test.com",
        "password": "password123",
        "full_name": "Debt User",
    })
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create debt
    debt_resp = client.post("/api/v1/debts", json={
        "name": "Préstamo Personal",
        "type": "prestamo",
        "original_amount": "5000000.00",
        "current_balance": "5000000.00",
        "monthly_payment": "1000000.00",
        "start_date": "2026-01-01",
    }, headers=headers)
    assert debt_resp.status_code == 201
    debt_id = debt_resp.json()["id"]

    # Make 3 payments
    for i in range(3):
        pay = client.post(f"/api/v1/debts/{debt_id}/payments", json={
            "payment_date": f"2026-0{i+2}-15",
            "amount": "1000000.00",
        }, headers=headers)
        assert pay.status_code == 201

    # Check balance reduced
    detail = client.get(f"/api/v1/debts/{debt_id}", headers=headers)
    assert detail.status_code == 200
    assert float(detail.json()["current_balance"]) == 2000000.00
