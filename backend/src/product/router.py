from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db

from .schemas import ProductCreate, ProductUpdate, ProductOut
from .service import ProductService

router = APIRouter(prefix="/products", tags=["products"])

@router.post("/", response_model=ProductOut)
async def create_product_endpoint(
    product: ProductCreate,
    db: AsyncSession = Depends(get_db)
):
    return await ProductService.create_product(db, product.model_dump(exclude_unset=True))

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
    db: AsyncSession = Depends(get_db)
):
    updated = await ProductService.update_product(db, product_id, product.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated

@router.delete("/{product_id}", response_model=dict)
async def delete_product_endpoint(
    product_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    deleted = await ProductService.delete_product(db, product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"detail": "Product deleted"}

@router.get("/", response_model=List[ProductOut])
async def list_products_endpoint(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    return await ProductService.list_products(db, skip=skip, limit=limit)

@router.get("/search/", response_model=List[ProductOut])
async def search_products_endpoint(
    query: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db)
):
    return await ProductService.search_products(db, query)
