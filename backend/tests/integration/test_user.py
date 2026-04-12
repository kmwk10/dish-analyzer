import pytest
from uuid import uuid4


@pytest.mark.asyncio
async def test_get_me(client):
    reg = await client.post(
        "/auth/register",
        json={
            "username": "meuser",
            "email": "meuser@example.com",
            "password": "password123"
        }
    )

    token = reg.json()["access_token"]

    response = await client.get(
        "/user/me",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "meuser@example.com"


@pytest.mark.asyncio
async def test_update_me(client):
    reg = await client.post(
        "/auth/register",
        json={
            "username": "updateuser",
            "email": "updateuser@example.com",
            "password": "password123"
        }
    )

    token = reg.json()["access_token"]

    response = await client.put(
        "/user/me",
        json={"username": "updatedname"},
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert response.json()["username"] == "updatedname"


@pytest.mark.asyncio
async def test_update_password(client):
    reg = await client.post(
        "/auth/register",
        json={
            "username": "passuser",
            "email": "passuser@example.com",
            "password": "oldpassword"
        }
    )

    token = reg.json()["access_token"]

    response = await client.put(
        "/user/me/password",
        json={
            "old_password": "oldpassword",
            "new_password": "newpassword"
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    assert response.json()["detail"] == "Password updated successfully"


@pytest.mark.asyncio
async def test_favorite_dishes_flow(client):
    reg = await client.post(
        "/auth/register",
        json={
            "username": "favdishuser",
            "email": "favdish@example.com",
            "password": "password123"
        }
    )

    token = reg.json()["access_token"]

    dish = await client.post(
        "/dish/",
        json={
            "name": "Fav Dish",
            "weight": 100,
            "servings": 1,
            "calories": 100,
            "protein": 10,
            "fat": 5,
            "carbs": 20
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    dish_id = dish.json()["id"]

    add = await client.post(
        f"/user/me/favorites/dishes/{dish_id}",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert add.status_code == 200

    get = await client.get(
        "/user/me/favorites/dishes/",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert get.status_code == 200
    assert isinstance(get.json(), list)

    delete = await client.delete(
        f"/user/me/favorites/dishes/{dish_id}",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert delete.status_code == 200


@pytest.mark.asyncio
async def test_favorite_products_flow(client):
    reg = await client.post(
        "/auth/register",
        json={
            "username": "favproduser",
            "email": "favprod@example.com",
            "password": "password123"
        }
    )

    token = reg.json()["access_token"]

    product = await client.post(
        "/product/",
        json={
            "name": "Fav Product",
            "calories": 50,
            "protein": 2,
            "fat": 1,
            "carbs": 10
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    product_id = product.json()["id"]

    add = await client.post(
        f"/user/me/favorites/products/{product_id}",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert add.status_code == 200

    get = await client.get(
        "/user/me/favorites/products/",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert get.status_code == 200
    assert isinstance(get.json(), list)

    delete = await client.delete(
        f"/user/me/favorites/products/{product_id}",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert delete.status_code == 200


@pytest.mark.asyncio
async def test_update_role_as_admin_or_forbidden(client):
    reg = await client.post(
        "/auth/register",
        json={
            "username": "roleuser",
            "email": "roleuser@example.com",
            "password": "password123"
        }
    )

    token = reg.json()["access_token"]

    user_id = uuid4()

    response = await client.put(
        f"/user/{user_id}/role",
        json={"role": "admin"},
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code in (403, 404)


@pytest.mark.asyncio
async def test_avatar_upload_get_delete(client):
    reg = await client.post(
        "/auth/register",
        json={
            "username": "avataruser",
            "email": "avatar@example.com",
            "password": "password123"
        }
    )

    token = reg.json()["access_token"]

    file_content = b"fake-image-data"

    upload = await client.post(
        "/user/me/avatar",
        files={"file": ("avatar.png", file_content, "image/png")},
        headers={"Authorization": f"Bearer {token}"}
    )

    assert upload.status_code == 200

    get = await client.get(
        "/user/me/avatar",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert get.status_code == 200

    delete = await client.delete(
        "/user/me/avatar",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert delete.status_code == 200
