import pytest
from unittest.mock import MagicMock, patch
from uuid import uuid4

from fastapi import HTTPException

from src.auth.service import AuthService
from src.user.models import User
from src.auth.models import RefreshToken


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


async def test_register_success(db):
    db.execute.return_value = mock_scalar(None)

    with patch("src.auth.service.hash_password", return_value="hashed"), \
         patch("src.auth.service.create_access_token", return_value="access"), \
         patch("src.auth.service.create_refresh_token", return_value="refresh"), \
         patch("src.auth.service.hash_refresh_token", return_value="hash"):

        result = await AuthService.register(db, {
            "username": "test",
            "email": "test@mail.com",
            "password": "1234"
        })

        assert result["access_token"] == "access"
        assert result["refresh_token"] == "refresh"

        assert db.add.call_count == 2
        db.commit.assert_called()


async def test_register_user_exists(db):
    db.execute.return_value = mock_scalar(User())

    with pytest.raises(HTTPException) as exc:
        await AuthService.register(db, {
            "username": "test",
            "email": "test@mail.com",
            "password": "1234"
        })

    assert exc.value.status_code == 400


async def test_login_success(db):
    user = User()
    user.id = uuid4()
    user.hashed_password = "hashed"

    db.execute.return_value = mock_scalar(user)

    with patch("src.auth.service.verify_password", return_value=True), \
         patch("src.auth.service.create_access_token", return_value="access"), \
         patch("src.auth.service.create_refresh_token", return_value="refresh"), \
         patch("src.auth.service.hash_refresh_token", return_value="hash"):

        result = await AuthService.login(db, {
            "email": "test@mail.com",
            "password": "1234"
        })

        assert result["access_token"] == "access"
        assert result["refresh_token"] == "refresh"

        db.add.assert_called_once()
        db.commit.assert_called_once()


async def test_login_invalid(db):
    db.execute.return_value = mock_scalar(None)

    with pytest.raises(HTTPException) as exc:
        await AuthService.login(db, {
            "email": "test@mail.com",
            "password": "wrong"
        })

    assert exc.value.status_code == 401


async def test_get_me_found(db):
    user = User()
    db.execute.return_value = mock_scalar(user)

    result = await AuthService.get_me(db, uuid4())

    assert result == user


async def test_get_me_not_found(db):
    db.execute.return_value = mock_scalar(None)

    result = await AuthService.get_me(db, uuid4())

    assert result is None


async def test_refresh_success(db):
    user = User()
    user.id = uuid4()

    token = RefreshToken()
    token.token_hash = "hash"

    db.execute.side_effect = [
        mock_scalar(user),
        mock_scalars([token])
    ]

    with patch("src.auth.service.decode_token", return_value={"type": "refresh", "sub": str(user.id)}), \
         patch("src.auth.service.verify_refresh_token", return_value=True), \
         patch("src.auth.service.create_access_token", return_value="access"), \
         patch("src.auth.service.create_refresh_token", return_value="new_refresh"), \
         patch("src.auth.service.hash_refresh_token", return_value="new_hash"):

        result = await AuthService.refresh(db, "token")

        assert result["access_token"] == "access"
        assert result["refresh_token"] == "new_refresh"

        db.delete.assert_called_once()
        db.add.assert_called_once()
        db.commit.assert_called_once()


async def test_refresh_invalid_type(db):
    with patch("src.auth.service.decode_token", return_value={"type": "access"}):
        with pytest.raises(HTTPException) as exc:
            await AuthService.refresh(db, "token")

    assert exc.value.status_code == 401


async def test_refresh_user_not_found(db):
    db.execute.return_value = mock_scalar(None)

    with patch("src.auth.service.decode_token", return_value={"type": "refresh", "sub": str(uuid4())}):
        with pytest.raises(HTTPException) as exc:
            await AuthService.refresh(db, "token")

    assert exc.value.status_code == 404


async def test_refresh_token_not_found(db):
    user = User()
    user.id = uuid4()

    db.execute.side_effect = [
        mock_scalar(user),
        mock_scalars([])
    ]

    with patch("src.auth.service.decode_token", return_value={"type": "refresh", "sub": str(user.id)}):
        with pytest.raises(HTTPException) as exc:
            await AuthService.refresh(db, "token")

    assert exc.value.status_code == 401


async def test_logout_success(db):
    token = RefreshToken()
    token.token_hash = "hash"

    db.execute.return_value = mock_scalars([token])

    with patch("src.auth.service.verify_refresh_token", return_value=True):
        await AuthService.logout(db, "token")

        db.delete.assert_called_once()
        db.commit.assert_called_once()


async def test_logout_invalid(db):
    db.execute.return_value = mock_scalars([])

    with pytest.raises(HTTPException) as exc:
        await AuthService.logout(db, "token")

    assert exc.value.status_code == 401
