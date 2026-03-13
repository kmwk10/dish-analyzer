from typing import Optional, List
from uuid import UUID
from fastapi import HTTPException, UploadFile

from sqlalchemy import select, delete, update
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from ..auth.security import verify_password, hash_password
from ..s3 import upload_file, delete_file, generate_presigned_url
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

    @staticmethod
    async def update_user_role(db: AsyncSession, user_id: UUID, role: str):
        stmt = (
            update(User)
            .where(User.id == user_id)
            .values(role=role)
            .returning(User)
        )
        result = await db.execute(stmt)
        await db.commit()
        user = result.scalar_one_or_none()
        return user

    async def upload_avatar(db: AsyncSession, user_id: UUID, file: UploadFile) -> Optional[str]:
        user = await UserService.get_user(db, user_id)
        if not user:
            return None

        if file.content_type not in ["image/jpeg", "image/png"]:
            raise HTTPException(status_code=400, detail="Invalid file type")

        file_bytes = await file.read()

        if len(file_bytes) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large")

        extension = file.filename.rsplit(".", 1)[-1]
        object_key = f"avatars/{uuid.uuid4()}.{extension}"

        if user.avatar_key:
            delete_file(user.avatar_key)

        upload_file(object_key, file_bytes, file.content_type)

        user.avatar_key = object_key
        await db.commit()
        await db.refresh(user)

        return object_key

    @staticmethod
    async def get_avatar_url(db: AsyncSession, user_id: UUID) -> Optional[str]:
        user = await UserService.get_user(db, user_id)
        if not user or not user.avatar_key:
            return None

        return generate_presigned_url(user.avatar_key)

    @staticmethod
    async def delete_avatar(db: AsyncSession, user_id: UUID) -> bool:
        user = await UserService.get_user(db, user_id)
        if not user or not user.avatar_key:
            return False

        delete_file(user.avatar_key)

        user.avatar_key = None
        await db.commit()

        return True
