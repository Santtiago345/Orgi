def test_register_success(client):
    response = client.post("/api/v1/auth/register", json={
        "email": "new@example.com",
        "password": "password123",
        "full_name": "New User",
    })
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "new@example.com"

def test_register_duplicate_email(client, test_user):
    response = client.post("/api/v1/auth/register", json={
        "email": test_user.email,
        "password": "password123",
        "full_name": "Duplicate",
    })
    assert response.status_code == 409

def test_login_success(client, test_user):
    response = client.post("/api/v1/auth/login", json={
        "email": test_user.email,
        "password": "password123",
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_wrong_password(client, test_user):
    response = client.post("/api/v1/auth/login", json={
        "email": test_user.email,
        "password": "wrongpassword",
    })
    assert response.status_code == 401

def test_protected_route_without_token(client):
    response = client.get("/api/v1/auth/me")
    assert response.status_code in (401, 403)

def test_protected_route_with_token(client, auth_headers):
    response = client.get("/api/v1/auth/me", headers=auth_headers)
    assert response.status_code == 200

def test_refresh_token(client, test_user):
    login = client.post("/api/v1/auth/login", json={
        "email": test_user.email,
        "password": "password123",
    })
    refresh_token = login.json()["refresh_token"]

    response = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data

def test_protected_route_with_expired_token(client):
    from jose import jwt
    from app.core.config import settings
    from datetime import datetime, timedelta, timezone
    expired = jwt.encode(
        {"sub": "1", "exp": datetime.now(timezone.utc) - timedelta(hours=1)},
        settings.SECRET_KEY, algorithm=settings.ALGORITHM,
    )
    response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {expired}"})
    assert response.status_code == 401
