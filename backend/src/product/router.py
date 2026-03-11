from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from src.user.models import User
from ..database import get_db
from ..dependencies import get_current_user_id

from .schemas import ProductCreate, ProductUpdate, ProductOut
from .service import ProductService
from .permissions import product_owner_only, product_owner_or_admin


router = APIRouter(prefix="/product", tags=["Product"])

@router.post("/", response_model=ProductOut)
async def create_product_endpoint(
    product: ProductCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UUID = Depends(get_current_user_id)
):
    product_data = product.model_dump(exclude_unset=True)
    product_data["created_by"] = current_user
    return await ProductService.create_product(db, product_data)

@router.get("/{product_id}", response_model=ProductOut)
async def get_product_endpoint(
    product_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    product_obj = await ProductService.get_product(db, product_id)
    if not product_obj:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_obj

@router.put("/{product_id}", response_model=ProductOut)
async def update_product_endpoint(
    product_id: UUID,
    product: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(product_owner_only)
):
    updated = await ProductService.update_product(db, product_id, product.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated

@router.delete("/{product_id}")
async def delete_product_endpoint(
    product_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(product_owner_or_admin),
):
    await ProductService.delete_product(db, product_id)
    return {"detail": "Product deleted"}

@router.get("/", response_model=List[ProductOut])
async def list_products_endpoint(
    offset: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    return await ProductService.list_products(db, offset=offset, limit=limit)

@router.get("/search/", response_model=List[ProductOut])
async def search_products_endpoint(
    query: str = Query(..., min_length=1),
    min_calories: float | None = None,
    max_calories: float | None = None,
    desc: bool = False,
    offset: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    return await ProductService.search_products(
        db,
        query,
        min_calories=min_calories,
        max_calories=max_calories,
        desc=desc,
        offset=offset,
        limit=limit
    )
