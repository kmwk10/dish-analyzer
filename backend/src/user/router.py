from fastapi import APIRouter, HTTPException, Depends
from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..dependencies import get_current_user_id
from ..dish import DishOut
from ..product import ProductOut

from .schemas import UserUpdate, UserOut
from .service import UserService

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/{user_id}", response_model=UserOut)
async def get_user_endpoint(
    user_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    user_obj = await UserService.get_user(db, user_id)
    if not user_obj:
        raise HTTPException(status_code=404, detail="User not found")
    return user_obj

@router.put("/{user_id}", response_model=UserOut)
async def update_user_endpoint(
    user_id: UUID,
    user: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UUID = Depends(get_current_user_id)
):
    if user_id != current_user:
        raise HTTPException(status_code=403, detail="Forbidden")
    updated = await UserService.update_user(db, user_id, user.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated

@router.delete("/{user_id}", response_model=dict)
async def delete_user_endpoint(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: UUID = Depends(get_current_user_id)
):
    if user_id != current_user:
        raise HTTPException(status_code=403, detail="Forbidden")
    deleted = await UserService.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}


@router.get("/{user_id}/favorites/dishes/", response_model=List[DishOut])
async def get_favorite_dishes_endpoint(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: UUID = Depends(get_current_user_id)
):
    if user_id != current_user:
        raise HTTPException(status_code=403, detail="Forbidden")
    return await UserService.get_favorite_dishes(db, user_id)

@router.get("/{user_id}/favorites/products/", response_model=List[ProductOut])
async def get_favorite_products_endpoint(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: UUID = Depends(get_current_user_id)
):
    if user_id != current_user:
        raise HTTPException(status_code=403, detail="Forbidden")
    return await UserService.get_favorite_products(db, user_id)

@router.post("/{user_id}/favorites/dishes/{dish_id}", response_model=dict)
async def add_favorite_dish_endpoint(
    user_id: UUID,
    dish_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: UUID = Depends(get_current_user_id)
):
    if user_id != current_user:
        raise HTTPException(status_code=403, detail="Forbidden")
    await UserService.add_favorite_dish(db, user_id, dish_id)
    return {"detail": "Dish added to favorites"}

@router.post("/{user_id}/favorites/products/{product_id}", response_model=dict)
async def add_favorite_product_endpoint(
    user_id: UUID,
    product_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: UUID = Depends(get_current_user_id)
):
    if user_id != current_user:
        raise HTTPException(status_code=403, detail="Forbidden")
    await UserService.add_favorite_product(db, user_id, product_id)
    return {"detail": "Product added to favorites"}

@router.delete("/{user_id}/favorites/dishes/{dish_id}", response_model=dict)
async def remove_favorite_dish_endpoint(
    user_id: UUID,
    dish_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: UUID = Depends(get_current_user_id)
):
    if user_id != current_user:
        raise HTTPException(status_code=403, detail="Forbidden")
    await UserService.remove_favorite_dish(db, user_id, dish_id)
    return {"detail": "Dish removed from favorites"}

@router.delete("/{user_id}/favorites/products/{product_id}", response_model=dict)
async def remove_favorite_product_endpoint(
    user_id: UUID,
    product_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: UUID = Depends(get_current_user_id)
):
    if user_id != current_user:
        raise HTTPException(status_code=403, detail="Forbidden")
    await UserService.remove_favorite_product(db, user_id, product_id)
    return {"detail": "Product removed from favorites"}
