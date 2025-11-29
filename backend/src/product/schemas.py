from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class ProductBase(BaseModel):
    name: str
    calories: float
    protein: float
    fat: float
    carbs: float

class ProductCreate(ProductBase):
    created_by: Optional[UUID]

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    calories: Optional[float] = None
    protein: Optional[float] = None
    fat: Optional[float] = None
    carbs: Optional[float] = None

class ProductOut(ProductBase):
    id: UUID
    created_at: datetime
    created_by: Optional[UUID]

    model_config = {
        "from_attributes": True
    }
