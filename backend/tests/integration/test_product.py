import pytest


@pytest.mark.asyncio
async def test_create_product(client):
    reg_payload = {
        "username": "productuser",
        "email": "productuser@example.com",
        "password": "password123"
    }

    reg = await client.post("/auth/register", json=reg_payload)
    token = reg.json()["access_token"]

    product_payload = {
        "name": "Apple",
        "calories": 52,
        "protein": 0.3,
        "fat": 0.2,
        "carbs": 14
    }

    response = await client.post(
        "/product/",
        json=product_payload,
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Apple"
    assert "id" in data


@pytest.mark.asyncio
async def test_get_product(client):
    reg_payload = {
        "username": "getproductuser",
        "email": "getproduct@example.com",
        "password": "password123"
    }

    reg = await client.post("/auth/register", json=reg_payload)
    token = reg.json()["access_token"]

    product_payload = {
        "name": "Banana",
        "calories": 89,
        "protein": 1.1,
        "fat": 0.3,
        "carbs": 23
    }

    created = await client.post(
        "/product/",
        json=product_payload,
        headers={"Authorization": f"Bearer {token}"}
    )

    product_id = created.json()["id"]

    response = await client.get(f"/product/{product_id}")

    assert response.status_code == 200
    assert response.json()["id"] == product_id


@pytest.mark.asyncio
async def test_update_product(client):
    reg_payload = {
        "username": "updateproductuser",
        "email": "updateproduct@example.com",
        "password": "password123"
    }

    reg = await client.post("/auth/register", json=reg_payload)
    token = reg.json()["access_token"]

    product_payload = {
        "name": "Orange",
        "calories": 40,
        "protein": 1,
        "fat": 0.1,
        "carbs": 10
    }

    created = await client.post(
        "/product/",
        json=product_payload,
        headers={"Authorization": f"Bearer {token}"}
    )

    product_id = created.json()["id"]

    update_payload = {
        "name": "Updated Orange",
        "calories": 999
    }

    response = await client.put(
        f"/product/{product_id}",
        json=update_payload,
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Orange"
    assert data["calories"] == 999


@pytest.mark.asyncio
async def test_delete_product(client):
    reg_payload = {
        "username": "deleteproductuser",
        "email": "deleteproduct@example.com",
        "password": "password123"
    }

    reg = await client.post("/auth/register", json=reg_payload)
    token = reg.json()["access_token"]

    product_payload = {
        "name": "Milk",
        "calories": 42,
        "protein": 3.4,
        "fat": 1,
        "carbs": 5
    }

    created = await client.post(
        "/product/",
        json=product_payload,
        headers={"Authorization": f"Bearer {token}"}
    )

    product_id = created.json()["id"]

    response = await client.delete(
        f"/product/{product_id}",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert response.json()["detail"] == "Product deleted"


@pytest.mark.asyncio
async def test_list_products(client):
    response = await client.get("/product/?offset=0&limit=10")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_search_products(client):
    response = await client.get("/product/search/?query=Apple")

    assert response.status_code == 200
    assert isinstance(response.json(), list)
