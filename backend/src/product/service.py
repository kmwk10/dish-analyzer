from typing import Optional, List
from uuid import UUID

from sqlalchemy import select, desc as sa_desc
from sqlalchemy.ext.asyncio import AsyncSession

from .models import Product


class ProductService:

    @staticmethod
    async def create_product(
        db: AsyncSession,
        data: dict
    ) -> Product:
        product = Product(**data)
        db.add(product)
        await db.commit()
        await db.refresh(product)
        return product

    @staticmethod
    async def get_product(
        db: AsyncSession,
        product_id: UUID
    ) -> Optional[Product]:
        result = await db.execute(
            select(Product).where(Product.id == product_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def update_product(
        db: AsyncSession,
        product_id: UUID,
        data: dict
    ) -> Optional[Product]:
        product = await ProductService.get_product(db, product_id)
        if not product:
            return None

        for key, value in data.items():
            setattr(product, key, value)

        await db.commit()
        await db.refresh(product)
        return product

    @staticmethod
    async def delete_product(
        db: AsyncSession,
        product_id: UUID
    ) -> bool:
        product = await ProductService.get_product(db, product_id)
        if not product:
            return False

        await db.delete(product)
        await db.commit()
        return True

    @staticmethod
    async def list_products(
        db: AsyncSession,
        offset: int = 0,
        limit: int = 20
    ) -> List[Product]:
        result = await db.execute(
            select(Product)
            .offset(offset)
            .limit(limit)
        )
        return result.scalars().all()

    @staticmethod
    async def search_products(
        db: AsyncSession,
        query: str | None = None,
        min_calories: float | None = None,
        max_calories: float | None = None,
        desc: bool = False,
        offset: int = 0,
        limit: int = 20
    ) -> List[Product]:

        stmt = select(Product)

        if query:
            stmt = stmt.where(Product.name.ilike(f"%{query}%"))

        if min_calories is not None:
            stmt = stmt.where(Product.calories >= min_calories)

        if max_calories is not None:
            stmt = stmt.where(Product.calories <= max_calories)

        stmt = stmt.order_by(Product.created_at if desc else sa_desc(Product.created_at))
        stmt = stmt.offset(offset).limit(limit)

        result = await db.execute(stmt)
        return result.scalars().all()

    @staticmethod
    async def get_product_owner_id(
        db: AsyncSession,
        product_id: UUID
    ) -> UUID:
        result = await db.execute(
            select(Product.created_by).where(Product.id == product_id)
        )
        owner_id = result.scalar_one_or_none()
        return owner_id
