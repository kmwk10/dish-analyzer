from typing import List, Optional
from uuid import UUID

from sqlalchemy import select, delete, desc as sa_desc, asc
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Dish, DishProduct


class DishService:

    @staticmethod
    async def create_dish(db: AsyncSession, data: dict) -> Dish:
        dish = Dish(**data)
        db.add(dish)
        await db.commit()
        await db.refresh(dish)
        return dish

    @staticmethod
    async def get_dish(db: AsyncSession, dish_id: UUID) -> Optional[Dish]:
        result = await db.execute(select(Dish).where(Dish.id == dish_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def update_dish(db: AsyncSession, dish_id: UUID, data: dict) -> Optional[Dish]:
        dish = await DishService.get_dish(db, dish_id)
        if not dish:
            return None
        for key, value in data.items():
            setattr(dish, key, value)
        await db.commit()
        await db.refresh(dish)
        return dish

    @staticmethod
    async def delete_dish(db: AsyncSession, dish_id: UUID) -> bool:
        dish = await DishService.get_dish(db, dish_id)
        if not dish:
            return False
        await db.delete(dish)
        await db.commit()
        return True

    @staticmethod
    async def list_dishes(db: AsyncSession, offset: int = 0, limit: int = 20) -> List[Dish]:
        result = await db.execute(select(Dish).offset(offset).limit(limit))
        return result.scalars().all()

    @staticmethod
    async def search_dishes(
        db: AsyncSession,
        query: str | None = None,
        min_calories: float | None = None,
        max_calories: float | None = None,
        desc: bool = False,
        offset: int = 0,
        limit: int = 20
    ) -> List[Dish]:
        stmt = select(Dish)

        if query:
            stmt = stmt.where(Dish.name.ilike(f"%{query}%"))

        if min_calories is not None:
            stmt = stmt.where(Dish.calories >= min_calories)

        if max_calories is not None:
            stmt = stmt.where(Dish.calories <= max_calories)

        stmt = stmt.order_by(sa_desc(Dish.created_at) if desc else asc(Dish.created_at))
        stmt = stmt.offset(offset).limit(limit)

        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def list_products_in_dish(db: AsyncSession, dish_id: UUID) -> List[DishProduct]:
        result = await db.execute(select(DishProduct).where(DishProduct.dish_id == dish_id))
        return result.scalars().all()

    @staticmethod
    async def add_products_to_dish(
        db: AsyncSession,
        dish_id: UUID,
        items: List[dict]
    ):
        objects = [
            DishProduct(dish_id=dish_id, product_id=item.product_id, weight=item.weight)
            for item in items
        ]
        db.add_all(objects)
        await db.commit()

    @staticmethod
    async def update_dish_products(
        db: AsyncSession,
        dish_id: UUID,
        items: List[dict]
    ):
        await db.execute(delete(DishProduct).where(DishProduct.dish_id == dish_id))
        await db.commit()

        objects = [
            DishProduct(dish_id=dish_id, product_id=item.product_id, weight=item.weight)
            for item in items
        ]
        db.add_all(objects)
        await db.commit()

    @staticmethod
    async def get_dish_owner_id(
        db: AsyncSession,
        dish_id: UUID,
    ) -> UUID:
        result = await db.execute(
            select(Dish.created_by).where(Dish.id == dish_id)
        )
        owner_id = result.scalar_one_or_none()
        return owner_id
