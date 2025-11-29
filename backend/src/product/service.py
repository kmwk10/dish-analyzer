from typing import Optional, List
from uuid import UUID

from sqlalchemy import select
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
        skip: int = 0,
        limit: int = 100
    ) -> List[Product]:
        result = await db.execute(
            select(Product).offset(skip).limit(limit)
        )
        return result.scalars().all()

    @staticmethod
    async def search_products(
        db: AsyncSession,
        query: str
    ) -> List[Product]:
        result = await db.execute(
            select(Product).where(Product.name.ilike(f"%{query}%"))
        )
        return result.scalars().all()
