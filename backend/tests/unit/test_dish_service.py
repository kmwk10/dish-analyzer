import pytest
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4

from src.dish.service import DishService
from src.dish.models import Dish, DishProduct


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
    db.add_all = MagicMock()
    return db


async def test_create_dish(db):
    dish = Dish()

    db.refresh.return_value = None

    with pytest.MonkeyPatch.context() as mp:
        mp.setattr("src.dish.service.Dish", lambda **kwargs: dish)

        result = await DishService.create_dish(db, {"name": "test"})

        assert result == dish
        db.add.assert_called_once()
        db.commit.assert_called_once()
        db.refresh.assert_called_once()


async def test_get_dish(db):
    dish = Dish()
    db.execute.return_value = mock_scalar(dish)

    result = await DishService.get_dish(db, uuid4())

    assert result == dish


async def test_get_dish_not_found(db):
    db.execute.return_value = mock_scalar(None)

    result = await DishService.get_dish(db, uuid4())

    assert result is None


async def test_update_dish(db):
    dish = Dish()
    dish.name = "old"

    db.execute.return_value = mock_scalar(dish)

    result = await DishService.update_dish(
        db,
        uuid4(),
        {"name": "new"}
    )

    assert result.name == "new"
    db.commit.assert_called_once()
    db.refresh.assert_called_once()


async def test_update_dish_not_found(db):
    db.execute.return_value = mock_scalar(None)

    result = await DishService.update_dish(db, uuid4(), {"name": "x"})

    assert result is None


async def test_delete_dish_success(db):
    dish = Dish()
    db.execute.return_value = mock_scalar(dish)

    result = await DishService.delete_dish(db, uuid4())

    assert result is True
    db.delete.assert_called_once()
    db.commit.assert_called_once()


async def test_delete_dish_not_found(db):
    db.execute.return_value = mock_scalar(None)

    result = await DishService.delete_dish(db, uuid4())

    assert result is False


async def test_list_dishes(db):
    dishes = [Dish(), Dish()]
    db.execute.return_value = mock_scalars(dishes)

    result = await DishService.list_dishes(db)

    assert result == dishes


async def test_search_dishes(db):
    dishes = [Dish()]
    db.execute.return_value = mock_scalars(dishes)

    result = await DishService.search_dishes(
        db,
        query="test",
        min_calories=10,
        max_calories=100,
        desc=True
    )

    assert result == dishes


async def test_list_products_in_dish(db):
    items = [DishProduct(), DishProduct()]
    db.execute.return_value = mock_scalars(items)

    result = await DishService.list_products_in_dish(db, uuid4())

    assert result == items


async def test_add_products_to_dish(db):
    class Item:
        product_id = uuid4()
        weight = 100

    items = [Item(), Item()]

    await DishService.add_products_to_dish(db, uuid4(), items)

    db.add_all.assert_called_once()
    db.commit.assert_called_once()


async def test_update_dish_products(db):
    class Item:
        product_id = uuid4()
        weight = 50

    items = [Item()]

    await DishService.update_dish_products(db, uuid4(), items)

    assert db.execute.called
    assert db.add_all.called
    assert db.commit.call_count == 2


async def test_get_dish_owner_id(db):
    user_id = uuid4()
    db.execute.return_value = mock_scalar(user_id)

    result = await DishService.get_dish_owner_id(db, uuid4())

    assert result == user_id
