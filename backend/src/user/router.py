from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..dependencies import get_current_user_id
from ..dish import DishOut
from ..product import ProductOut
from ..user.models import User

from .schemas import UserUpdate, UserOut, PasswordUpdate, UserRoleUpdate
from .service import UserService
from .permissions import admin_only

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/me", response_model=UserOut)
async def get_me_endpoint(
    current_user: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    user_obj = await UserService.get_user(db, current_user)
    if not user_obj:
        raise HTTPException(status_code=404, detail="User not found")
    return user_obj

@router.put("/me", response_model=UserOut)
async def update_me_endpoint(
    user: UserUpdate,
    current_user: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    updated = await UserService.update_user(db, current_user, user.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated

@router.delete("/me", response_model=dict)
async def delete_me_endpoint(
    current_user: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    deleted = await UserService.delete_user(db, current_user)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted"}


@router.put("/me/password", response_model=dict)
async def update_password_endpoint(
    data: PasswordUpdate,
    current_user: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    updated = await UserService.update_password(db, current_user, data.old_password, data.new_password)
    if not updated:
        raise HTTPException(status_code=400, detail="Old password is incorrect or update failed")
    return {"detail": "Password updated successfully"}


@router.get("/me/favorites/dishes/", response_model=List[DishOut])
async def get_favorite_dishes_endpoint(
    current_user: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    return await UserService.get_favorite_dishes(db, current_user)

@router.get("/me/favorites/products/", response_model=List[ProductOut])
async def get_favorite_products_endpoint(
    current_user: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    return await UserService.get_favorite_products(db, current_user)

@router.post("/me/favorites/dishes/{dish_id}", response_model=dict)
async def add_favorite_dish_endpoint(
    dish_id: UUID,
    current_user: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    await UserService.add_favorite_dish(db, current_user, dish_id)
    return {"detail": "Dish added to favorites"}

@router.post("/me/favorites/products/{product_id}", response_model=dict)
async def add_favorite_product_endpoint(
    product_id: UUID,
    current_user: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    await UserService.add_favorite_product(db, current_user, product_id)
    return {"detail": "Product added to favorites"}

@router.delete("/me/favorites/dishes/{dish_id}", response_model=dict)
async def remove_favorite_dish_endpoint(
    dish_id: UUID,
    current_user: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    await UserService.remove_favorite_dish(db, current_user, dish_id)
    return {"detail": "Dish removed from favorites"}

@router.delete("/me/favorites/products/{product_id}", response_model=dict)
async def remove_favorite_product_endpoint(
    product_id: UUID,
    current_user: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    await UserService.remove_favorite_product(db, current_user, product_id)
    return {"detail": "Product removed from favorites"}

@router.put("/{user_id}/role", response_model=dict)
async def update_user_role_endpoint(
    user_id: UUID,
    data: UserRoleUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(admin_only)
):
    updated = await UserService.update_user_role(db, user_id, data.role)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": f"User role updated to {data.role}"}

@router.post("/me/avatar", response_model=dict)
async def upload_avatar_endpoint(
    file: UploadFile = File(...),
    current_user: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    avatar_key = await UserService.upload_avatar(db, current_user, file)
    if not avatar_key:
        raise HTTPException(status_code=404, detail="User not found")

    return {"detail": "Avatar uploaded successfully"}

@router.get("/me/avatar", response_model=dict)
async def get_avatar_endpoint(
    current_user: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    avatar_url = await UserService.get_avatar_url(db, current_user)

    if not avatar_url:
        raise HTTPException(status_code=404, detail="Avatar not found")

    return {"avatar_url": avatar_url}

@router.delete("/me/avatar", response_model=dict)
async def delete_avatar_endpoint(
    current_user: UUID = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    deleted = await UserService.delete_avatar(db, current_user)

    if not deleted:
        raise HTTPException(status_code=404, detail="Avatar not found")

    return {"detail": "Avatar deleted successfully"}
