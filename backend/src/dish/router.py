from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db

from .schemas import DishCreate, DishUpdate, DishOut, DishProductOut, DishProductIn
from .service import DishService

router = APIRouter(prefix="/dish", tags=["Dish"])


@router.post("/", response_model=DishOut)
async def create_dish_endpoint(
    dish: DishCreate,
    db: AsyncSession = Depends(get_db)
):
    return await DishService.create_dish(db, dish.model_dump(exclude_unset=True))

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
    db: AsyncSession = Depends(get_db)
):
    updated = await DishService.update_dish(db, dish_id, dish.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Dish not found")
    return updated

@router.delete("/{dish_id}", response_model=dict)
async def delete_dish_endpoint(
    dish_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    deleted = await DishService.delete_dish(db, dish_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Dish not found")
    return {"detail": "Dish deleted"}

@router.get("/", response_model=List[DishOut])
async def list_dishes_endpoint(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    return await DishService.list_dishes(db, skip=skip, limit=limit)

@router.get("/search/", response_model=List[DishOut])
async def search_dishes_endpoint(
    query: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db)
):
    return await DishService.search_dishes(db, query)

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
    db: AsyncSession = Depends(get_db)
):
    await DishService.add_products_to_dish(db, dish_id, product_ids)
    return {"detail": "Products added to dish"}

@router.put("/{dish_id}/products/", response_model=dict)
async def update_dish_products_endpoint(
    dish_id: UUID,
    product_ids: List[DishProductIn],
    db: AsyncSession = Depends(get_db)
):
    await DishService.update_dish_products(db, dish_id, product_ids)
    return {"detail": "Dish products updated"}
