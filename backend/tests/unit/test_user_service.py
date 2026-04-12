import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

from fastapi import HTTPException, UploadFile

from src.user.service import UserService
from src.user.models import User, FavoriteDish, FavoriteProduct
from src.dish.models import Dish
from src.product.models import Product


pytestmark = pytest.mark.asyncio


def mock_scalar(value):
    m = MagicMock()
    m.scalar_one_or_none.return_value = value
    return m


def mock_scalars(items):
    result = MagicMock()
    scalars = MagicMock()
    scalars.all.return_value = items
    result.scalars.return_value = scalars
    return result


@pytest.fixture
def db():
    db = MagicMock()
    db.execute = AsyncMock()
    db.commit = AsyncMock()
    db.refresh = AsyncMock()
    db.delete = AsyncMock()
    db.add = MagicMock()
    return db


async def test_create_user(db):
    user = User()

    with patch("src.user.service.User", lambda **kwargs: user):
        result = await UserService.create_user(db, {"email": "a@mail.com"})

        assert result == user
        db.add.assert_called_once()
        db.commit.assert_called_once()
        db.refresh.assert_called_once()


async def test_get_user(db):
    user = User()
    db.execute.return_value = mock_scalar(user)

    result = await UserService.get_user(db, uuid4())

    assert result == user


async def test_get_user_by_email(db):
    user = User()
    db.execute.return_value = mock_scalar(user)

    result = await UserService.get_user_by_email(db, "a@mail.com")

    assert result == user


async def test_update_user(db):
    user = User()
    user.name = "old"

    db.execute.return_value = mock_scalar(user)

    result = await UserService.update_user(db, uuid4(), {"name": "new"})

    assert result.name == "new"
    db.commit.assert_called_once()
    db.refresh.assert_called_once()


async def test_update_user_not_found(db):
    db.execute.return_value = mock_scalar(None)

    result = await UserService.update_user(db, uuid4(), {})

    assert result is None


async def test_delete_user(db):
    user = User()
    db.execute.return_value = mock_scalar(user)

    result = await UserService.delete_user(db, uuid4())

    assert result is True
    db.delete.assert_called_once()
    db.commit.assert_called_once()


async def test_delete_user_not_found(db):
    db.execute.return_value = mock_scalar(None)

    result = await UserService.delete_user(db, uuid4())

    assert result is False


async def test_update_password_success(db):
    user = User()
    user.hashed_password = "old_hash"

    db.execute.return_value = mock_scalar(user)

    with patch("src.user.service.verify_password", return_value=True), \
         patch("src.user.service.hash_password", return_value="new_hash"):

        result = await UserService.update_password(
            db,
            uuid4(),
            "old",
            "new"
        )

        assert result is True
        db.commit.assert_called_once()


async def test_update_password_wrong_old(db):
    user = User()
    user.hashed_password = "old_hash"

    db.execute.return_value = mock_scalar(user)

    with patch("src.user.service.verify_password", return_value=False):
        result = await UserService.update_password(db, uuid4(), "old", "new")

        assert result is False


async def test_update_password_user_not_found(db):
    db.execute.return_value = mock_scalar(None)

    result = await UserService.update_password(db, uuid4(), "old", "new")

    assert result is False


async def test_get_favorite_dishes(db):
    items = [Dish(), Dish()]
    db.execute.return_value = mock_scalars(items)

    result = await UserService.get_favorite_dishes(db, uuid4())

    assert result == items


async def test_get_favorite_products(db):
    items = [Product()]
    db.execute.return_value = mock_scalars(items)

    result = await UserService.get_favorite_products(db, uuid4())

    assert result == items


async def test_add_favorite_dish(db):
    await UserService.add_favorite_dish(db, uuid4(), uuid4())

    db.add.assert_called_once()
    db.commit.assert_called_once()


async def test_add_favorite_product(db):
    await UserService.add_favorite_product(db, uuid4(), uuid4())

    db.add.assert_called_once()
    db.commit.assert_called_once()


async def test_remove_favorite_dish(db):
    await UserService.remove_favorite_dish(db, uuid4(), uuid4())

    db.execute.assert_called_once()
    db.commit.assert_called_once()


async def test_remove_favorite_product(db):
    await UserService.remove_favorite_product(db, uuid4(), uuid4())

    db.execute.assert_called_once()
    db.commit.assert_called_once()


async def test_update_user_role(db):
    user = User()

    db.execute.return_value = mock_scalar(user)

    result = await UserService.update_user_role(db, uuid4(), "admin")

    assert result == user
    db.commit.assert_called_once()


async def test_upload_avatar_success(db):
    user = User()
    user.avatar_key = None

    db.execute.return_value = mock_scalar(user)

    file = MagicMock(spec=UploadFile)
    file.filename = "test.png"
    file.content_type = "image/png"
    file.read = AsyncMock(return_value=b"123")

    with patch("src.user.service.uuid.uuid4", return_value=uuid4()), \
         patch("src.user.service.upload_file"), \
         patch("src.user.service.delete_file"):

        result = await UserService.upload_avatar(
            db,
            MagicMock(),
            uuid4(),
            file
        )

        assert result is not None
        db.commit.assert_called_once()
        db.refresh.assert_called_once()


async def test_upload_avatar_invalid_type(db):
    user = User()
    db.execute.return_value = mock_scalar(user)

    file = MagicMock(spec=UploadFile)
    file.content_type = "text/plain"
    file.read = AsyncMock()

    with pytest.raises(HTTPException) as exc:
        await UserService.upload_avatar(db, MagicMock(), uuid4(), file)

    assert exc.value.status_code == 400


async def test_upload_avatar_too_large(db):
    user = User()
    db.execute.return_value = mock_scalar(user)

    file = MagicMock(spec=UploadFile)
    file.content_type = "image/png"
    file.filename = "a.png"
    file.read = AsyncMock(return_value=b"x" * (6 * 1024 * 1024))

    with pytest.raises(HTTPException) as exc:
        await UserService.upload_avatar(db, MagicMock(), uuid4(), file)

    assert exc.value.status_code == 400


async def test_get_avatar_url(db):
    user = User()
    user.avatar_key = "key"

    db.execute.return_value = mock_scalar(user)

    with patch("src.user.service.generate_presigned_url", return_value="url"):
        result = await UserService.get_avatar_url(db, MagicMock(), uuid4())

        assert result == "url"


async def test_delete_avatar(db):
    user = User()
    user.avatar_key = "key"

    db.execute.return_value = mock_scalar(user)

    with patch("src.user.service.delete_file"):
        result = await UserService.delete_avatar(db, MagicMock(), uuid4())

        assert result is True
        db.commit.assert_called_once()
