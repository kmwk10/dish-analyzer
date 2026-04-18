import pytest


@pytest.mark.asyncio
async def test_create_dish(client):
    register_payload = {
        "username": "dishuser",
        "email": "dishuser@example.com",
        "password": "password123"
    }

    reg = await client.post("/auth/register", json=register_payload)
    token = reg.json()["access_token"]

    dish_payload = {
        "name": "Test Dish",
        "weight": 500,
        "servings": 2,
        "calories": 600,
        "protein": 30,
        "fat": 20,
        "carbs": 70,
        "recipe": "Mix everything"
    }

    response = await client.post(
        "/dish/",
        json=dish_payload,
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Dish"
    assert "id" in data


@pytest.mark.asyncio
async def test_get_dish(client):
    register_payload = {
        "username": "getdishuser",
        "email": "getdish@example.com",
        "password": "password123"
    }

    reg = await client.post("/auth/register", json=register_payload)
    token = reg.json()["access_token"]

    dish_payload = {
        "name": "Get Dish",
        "weight": 300,
        "servings": 1,
        "calories": 400,
        "protein": 20,
        "fat": 10,
        "carbs": 50
    }

    created = await client.post(
        "/dish/",
        json=dish_payload,
        headers={"Authorization": f"Bearer {token}"}
    )

    dish_id = created.json()["id"]

    response = await client.get(f"/dish/{dish_id}")

    assert response.status_code == 200
    assert response.json()["id"] == dish_id


@pytest.mark.asyncio
async def test_update_dish(client):
    register_payload = {
        "username": "updatedishuser",
        "email": "updatedish@example.com",
        "password": "password123"
    }

    reg = await client.post("/auth/register", json=register_payload)
    token = reg.json()["access_token"]

    dish_payload = {
        "name": "Old Dish",
        "weight": 200,
        "servings": 1,
        "calories": 300,
        "protein": 10,
        "fat": 5,
        "carbs": 40
    }

    created = await client.post(
        "/dish/",
        json=dish_payload,
        headers={"Authorization": f"Bearer {token}"}
    )

    dish_id = created.json()["id"]

    update_payload = {
        "name": "Updated Dish",
        "calories": 999
    }

    response = await client.put(
        f"/dish/{dish_id}",
        json=update_payload,
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Updated Dish"
    assert response.json()["calories"] == 999


@pytest.mark.asyncio
async def test_delete_dish(client):
    register_payload = {
        "username": "deletedishuser",
        "email": "deletedish@example.com",
        "password": "password123"
    }

    reg = await client.post("/auth/register", json=register_payload)
    token = reg.json()["access_token"]

    dish_payload = {
        "name": "Delete Dish",
        "weight": 100,
        "servings": 1,
        "calories": 100,
        "protein": 5,
        "fat": 3,
        "carbs": 10
    }

    created = await client.post(
        "/dish/",
        json=dish_payload,
        headers={"Authorization": f"Bearer {token}"}
    )

    dish_id = created.json()["id"]

    response = await client.delete(
        f"/dish/{dish_id}",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert response.json()["detail"] == "Dish deleted"


@pytest.mark.asyncio
async def test_list_dishes(client):
    response = await client.get("/dish/?offset=0&limit=10")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_search_dishes(client):
    response = await client.get("/dish/search/?query=Test")

    assert response.status_code == 200
    assert isinstance(response.json(), list)
