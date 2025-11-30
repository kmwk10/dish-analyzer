from typing import Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from ..user import User
from ..dependencies import decode_token

from .security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
)


class AuthService:

    @staticmethod
    async def register(
        db: AsyncSession,
        data: dict
    ) -> dict:
        result = await db.execute(
            select(User).where(User.email == data["email"])
        )
        existing = result.scalar_one_or_none()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )

        user = User(
            username=data["username"],
            email=data["email"],
            hashed_password=hash_password(data["password"]),
        )

        db.add(user)
        await db.commit()
        await db.refresh(user)

        return {
            "access_token": create_access_token(str(user.id)),
            "refresh_token": create_refresh_token(str(user.id)),
            "token_type": "bearer",
        }

    @staticmethod
    async def login(
        db: AsyncSession,
        data: dict
    ) -> dict:
        result = await db.execute(
            select(User).where(User.email == data["email"])
        )
        user = result.scalar_one_or_none()

        if not user or not verify_password(data["password"], user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        return {
            "access_token": create_access_token(str(user.id)),
            "refresh_token": create_refresh_token(str(user.id)),
            "token_type": "bearer",
        }

    @staticmethod
    async def get_me(
        db: AsyncSession,
        user_id: UUID
    ) -> Optional[User]:
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def refresh(
        db: AsyncSession,
        refresh_token: str
    ) -> dict:
        payload = decode_token(refresh_token)

        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )

        user_id = payload.get("sub")

        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        return {
            "access_token": create_access_token(str(user.id)),
            "refresh_token": create_refresh_token(str(user.id)),
            "token_type": "bearer",
        }
