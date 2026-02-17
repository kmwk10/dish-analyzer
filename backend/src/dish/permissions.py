from uuid import UUID
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.dependencies import get_current_user_id

from src.user.models import UserRole
from .service import DishService


async def dish_owner_only(
    dish_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: UUID = Depends(get_current_user_id),
):
    from src.user.service import UserService

    user = await UserService.get_user(db, current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    owner_id = await DishService.get_dish_owner_id(db, dish_id)
    if owner_id is None:
        raise HTTPException(status_code=404, detail="Dish not found")

    if user.id != owner_id:
        raise HTTPException(
            status_code=403,
            detail="Only the owner can modify this resource"
        )

    return user


async def dish_owner_or_admin(
    dish_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: UUID = Depends(get_current_user_id),
):
    from src.user.service import UserService

    user = await UserService.get_user(db, current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    owner_id = await DishService.get_dish_owner_id(db, dish_id)
    if owner_id is None:
        raise HTTPException(status_code=404, detail="Dish not found")

    if user.role == UserRole.admin or user.id == owner_id:
        return user

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Not enough permissions"
    )
