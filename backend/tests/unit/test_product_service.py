import pytest
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4

from src.product.service import ProductService
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


async def test_create_product(db):
    product = Product()

    with pytest.MonkeyPatch.context() as mp:
        mp.setattr("src.product.service.Product", lambda **kwargs: product)

        result = await ProductService.create_product(db, {"name": "milk"})

        assert result == product
        db.add.assert_called_once()
        db.commit.assert_called_once()
        db.refresh.assert_called_once()


async def test_get_product(db):
    product = Product()
    db.execute.return_value = mock_scalar(product)

    result = await ProductService.get_product(db, uuid4())

    assert result == product


async def test_get_product_not_found(db):
    db.execute.return_value = mock_scalar(None)

    result = await ProductService.get_product(db, uuid4())

    assert result is None


async def test_update_product(db):
    product = Product()
    product.name = "old"

    db.execute.return_value = mock_scalar(product)

    result = await ProductService.update_product(
        db,
        uuid4(),
        {"name": "new"}
    )

    assert result.name == "new"
    db.commit.assert_called_once()
    db.refresh.assert_called_once()


async def test_update_product_not_found(db):
    db.execute.return_value = mock_scalar(None)

    result = await ProductService.update_product(db, uuid4(), {"name": "x"})

    assert result is None


async def test_delete_product_success(db):
    product = Product()
    db.execute.return_value = mock_scalar(product)

    result = await ProductService.delete_product(db, uuid4())

    assert result is True
    db.delete.assert_called_once()
    db.commit.assert_called_once()


async def test_delete_product_not_found(db):
    db.execute.return_value = mock_scalar(None)

    result = await ProductService.delete_product(db, uuid4())

    assert result is False


async def test_list_products(db):
    items = [Product(), Product()]
    db.execute.return_value = mock_scalars(items)

    result = await ProductService.list_products(db)

    assert result == items


async def test_search_products(db):
    items = [Product()]
    db.execute.return_value = mock_scalars(items)

    result = await ProductService.search_products(
        db,
        query="milk",
        min_calories=10,
        max_calories=100,
        desc=True
    )

    assert result == items


async def test_get_product_owner_id(db):
    user_id = uuid4()
    db.execute.return_value = mock_scalar(user_id)

    result = await ProductService.get_product_owner_id(db, uuid4())

    assert result == user_id
