from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..dependencies import get_current_user_id
from ..user.models import User

from .schemas import DishCreate, DishUpdate, DishOut, DishProductOut, DishProductIn
from .service import DishService
from .permissions import dish_owner_only, dish_owner_or_admin

router = APIRouter(prefix="/dish", tags=["Dish"])


@router.post("/", response_model=DishOut)
async def create_dish_endpoint(
    dish: DishCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UUID = Depends(get_current_user_id)
):
    dish_data = dish.model_dump(exclude_unset=True)
    dish_data["created_by"] = current_user
    return await DishService.create_dish(db, dish_data)

@router.get("/{dish_id}", response_model=DishOut)
async def get_dish_endpoint(
    dish_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    dish_obj = await DishService.get_dish(db, dish_id)
    if not dish_obj:
        raise HTTPException(status_code=404, detail="Dish not found")
    return dish_obj

@router.put("/{dish_id}", response_model=DishOut)
async def update_dish_endpoint(
    dish_id: UUID,
    dish: DishUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(dish_owner_only)
):
    updated = await DishService.update_dish(db, dish_id, dish.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Dish not found")
    return updated

@router.delete("/{dish_id}", response_model=dict)
async def delete_dish_endpoint(
    dish_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(dish_owner_or_admin),
):
    deleted = await DishService.delete_dish(db, dish_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Dish not found")
    return {"detail": "Dish deleted"}

@router.get("/", response_model=List[DishOut])
async def list_dishes_endpoint(
    offset: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    return await DishService.list_dishes(db, offset=offset, limit=limit)

@router.get("/search/", response_model=List[DishOut])
async def search_dishes_endpoint(
    query: str | None = Query(None),
    min_calories: float | None = None,
    max_calories: float | None = None,
    desc: bool = False,
    offset: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    return await DishService.search_dishes(
        db,
        query,
        min_calories=min_calories,
        max_calories=max_calories,
        desc=desc,
        offset=offset,
        limit=limit
    )

@router.get("/{dish_id}/products/", response_model=List[DishProductOut])
async def list_products_in_dish_endpoint(
    dish_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    return await DishService.list_products_in_dish(db, dish_id)

@router.post("/{dish_id}/products/", response_model=dict)
async def add_products_to_dish_endpoint(
    dish_id: UUID,
    product_ids: List[DishProductIn],
    db: AsyncSession = Depends(get_db),
    user: User = Depends(dish_owner_only)
):
    await DishService.add_products_to_dish(db, dish_id, product_ids)
    return {"detail": "Products added to dish"}

@router.put("/{dish_id}/products/", response_model=dict)
async def update_dish_products_endpoint(
    dish_id: UUID,
    product_ids: List[DishProductIn],
    db: AsyncSession = Depends(get_db),
    user: User = Depends(dish_owner_only)
):
    await DishService.update_dish_products(db, dish_id, product_ids)
    return {"detail": "Dish products updated"}
