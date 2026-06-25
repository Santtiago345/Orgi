def test_monthly_summary(client, auth_headers, test_account, test_category):
    # Create income
    client.post("/api/v1/transactions", json={
        "fecha": "2026-06-01T00:00:00Z", "tipo": "ingreso",
        "cantidad": "5000000.00", "descripcion": "Salario",
        "account_id": test_account.id, "category_id": test_category.id,
    }, headers=auth_headers)

    # Create expense
    client.post("/api/v1/transactions", json={
        "fecha": "2026-06-15T00:00:00Z", "tipo": "gasto",
        "cantidad": "3000000.00", "descripcion": "Gastos varios",
        "account_id": test_account.id, "category_id": test_category.id,
    }, headers=auth_headers)

    response = client.get("/api/v1/reports/monthly?year=2026&month=6", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["ingresos_total"] == "5000000.00"
    assert data["gastos_total"] == "3000000.00"
    assert data["balance_neto"] == "2000000.00"

def test_net_worth(client, auth_headers, test_account):
    response = client.get("/api/v1/reports/net-worth", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "activos" in data
    assert "pasivos" in data
    assert "patrimonio_neto" in data
