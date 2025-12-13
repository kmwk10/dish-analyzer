from typing import Optional, List
from uuid import UUID

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth.security import verify_password, hash_password
from ..dish import Dish
from ..product import Product

from .models import User, FavoriteDish, FavoriteProduct


class UserService:

    @staticmethod
    async def create_user(db: AsyncSession, data: dict) -> User:
        user = User(**data)
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    async def get_user(db: AsyncSession, user_id: UUID) -> Optional[User]:
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    @staticmethod
    async def update_user(db: AsyncSession, user_id: UUID, data: dict) -> Optional[User]:
        user = await UserService.get_user(db, user_id)
        if not user:
            return None
        for key, value in data.items():
            setattr(user, key, value)
        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    async def delete_user(db: AsyncSession, user_id: UUID) -> bool:
        user = await UserService.get_user(db, user_id)
        if not user:
            return False
        await db.delete(user)
        await db.commit()
        return True


    @staticmethod
    async def update_password(db: AsyncSession, user_id: UUID, old_password: str, new_password: str) -> bool:
        user = await UserService.get_user(db, user_id)
        if not user:
            return False
        if not verify_password(old_password, user.hashed_password):
            return False
        user.hashed_password = hash_password(new_password)
        await db.commit()
        await db.refresh(user)
        return True


    @staticmethod
    async def get_favorite_dishes(db: AsyncSession, user_id: UUID) -> List[Dish]:
        result = await db.execute(
            select(Dish)
            .join(FavoriteDish)
            .where(FavoriteDish.user_id == user_id)
        )
        return result.scalars().all()

    @staticmethod
    async def get_favorite_products(db: AsyncSession, user_id: UUID) -> List[Product]:
        result = await db.execute(
            select(Product)
            .join(FavoriteProduct)
            .where(FavoriteProduct.user_id == user_id)
        )
        return result.scalars().all()

    @staticmethod
    async def add_favorite_dish(db: AsyncSession, user_id: UUID, dish_id: UUID):
        favorite = FavoriteDish(user_id=user_id, dish_id=dish_id)
        db.add(favorite)
        await db.commit()

    @staticmethod
    async def add_favorite_product(db: AsyncSession, user_id: UUID, product_id: UUID):
        favorite = FavoriteProduct(user_id=user_id, product_id=product_id)
        db.add(favorite)
        await db.commit()

    @staticmethod
    async def remove_favorite_dish(db: AsyncSession, user_id: UUID, dish_id: UUID):
        await db.execute(
            delete(FavoriteDish).where(
                FavoriteDish.user_id == user_id,
                FavoriteDish.dish_id == dish_id
            )
        )
        await db.commit()

    @staticmethod
    async def remove_favorite_product(db: AsyncSession, user_id: UUID, product_id: UUID):
        await db.execute(
            delete(FavoriteProduct).where(
                FavoriteProduct.user_id == user_id,
                FavoriteProduct.product_id == product_id
            )
        )
        await db.commit()
