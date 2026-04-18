import pytest

@pytest.mark.asyncio
async def test_register_success(client):
    payload = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    }

    response = await client.post("/auth/register", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_register_duplicate_email(client):
    payload = {
        "username": "user1",
        "email": "dup@example.com",
        "password": "password123"
    }

    await client.post("/auth/register", json=payload)
    response = await client.post("/auth/register", json=payload)

    assert response.status_code in (400, 409)


@pytest.mark.asyncio
async def test_login_success(client):
    register_payload = {
        "username": "loginuser",
        "email": "login@example.com",
        "password": "password123"
    }

    await client.post("/auth/register", json=register_payload)

    login_payload = {
        "email": "login@example.com",
        "password": "password123"
    }

    response = await client.post("/auth/login", json=login_payload)

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


@pytest.mark.asyncio
async def test_login_wrong_password(client):
    register_payload = {
        "username": "wrongpassuser",
        "email": "wrongpass@example.com",
        "password": "password123"
    }

    await client.post("/auth/register", json=register_payload)

    login_payload = {
        "email": "wrongpass@example.com",
        "password": "wrongpassword"
    }

    response = await client.post("/auth/login", json=login_payload)

    assert response.status_code in (400, 401)


@pytest.mark.asyncio
async def test_refresh_token(client):
    register_payload = {
        "username": "refreshuser",
        "email": "refresh@example.com",
        "password": "password123"
    }

    register_resp = await client.post("/auth/register", json=register_payload)
    refresh_token = register_resp.json()["refresh_token"]

    response = await client.post("/auth/refresh", params={"refresh_token": refresh_token})

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data


@pytest.mark.asyncio
async def test_logout(client):
    register_payload = {
        "username": "logoutuser",
        "email": "logout@example.com",
        "password": "password123"
    }

    register_resp = await client.post("/auth/register", json=register_payload)
    refresh_token = register_resp.json()["refresh_token"]

    response = await client.post("/auth/logout", params={"refresh_token": refresh_token})

    assert response.status_code == 200
    assert response.json()["detail"] == "Logged out successfully"
