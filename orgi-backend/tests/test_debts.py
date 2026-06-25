from decimal import Decimal

def test_create_debt(client, auth_headers, test_user):
    response = client.post("/api/v1/debts", json={
        "name": "Préstamo prueba",
        "creditor_name": "Banco",
        "type": "prestamo",
        "original_amount": "5000000.00",
        "current_balance": "5000000.00",
        "interest_rate": "0.015",
        "monthly_payment": "500000.00",
        "start_date": "2026-01-15",
    }, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Préstamo prueba"
    assert data["current_balance"] == "5000000.00"

def test_register_debt_payment_updates_balance(client, auth_headers, db_session, test_user):
    debt_resp = client.post("/api/v1/debts", json={
        "name": "Deuda test",
        "type": "otro",
        "original_amount": "10000000.00",
        "current_balance": "10000000.00",
    }, headers=auth_headers)
    debt_id = debt_resp.json()["id"]

    response = client.post(f"/api/v1/debts/{debt_id}/payments", json={
        "payment_date": "2026-07-15",
        "amount": "500000.00",
    }, headers=auth_headers)
    assert response.status_code == 201

    from app.models.debt import Debt
    debt = db_session.query(Debt).filter(Debt.id == debt_id).first()
    assert debt.current_balance == Decimal("9500000.00")

def test_debt_summary(client, auth_headers, test_user):
    client.post("/api/v1/debts", json={
        "name": "Deuda 1", "type": "otro",
        "original_amount": "3000000.00", "current_balance": "3000000.00",
    }, headers=auth_headers)
    client.post("/api/v1/debts", json={
        "name": "Deuda 2", "type": "otro",
        "original_amount": "2000000.00", "current_balance": "2000000.00",
    }, headers=auth_headers)

    response = client.get("/api/v1/debts/summary", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_debt"] == "5000000.00"
    assert data["active_count"] == 2

def test_debt_interest_calculation(client, auth_headers, db_session, test_user):
    debt_resp = client.post("/api/v1/debts", json={
        "name": "Deuda interés",
        "type": "prestamo",
        "original_amount": "10000000.00",
        "current_balance": "10000000.00",
        "interest_rate": "1.5",
    }, headers=auth_headers)
    debt_id = debt_resp.json()["id"]

    client.post(f"/api/v1/debts/{debt_id}/payments", json={
        "payment_date": "2026-07-15",
        "amount": "500000.00",
    }, headers=auth_headers)

    from app.models.debt_payment import DebtPayment
    payment = db_session.query(DebtPayment).filter(DebtPayment.debt_id == debt_id).first()
    assert payment.interest_portion == Decimal("150000.00")
    assert payment.principal_portion == Decimal("350000.00")
