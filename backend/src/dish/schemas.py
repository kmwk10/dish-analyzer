from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class DishBase(BaseModel):
    name: str
    weight: float
    servings: float
    calories: float
    protein: float
    fat: float
    carbs: float
    recipe: Optional[str] = None

class DishCreate(DishBase):
    created_by: Optional[UUID]

class DishUpdate(BaseModel):
    name: Optional[str] = None
    weight: Optional[float] = None
    servings: Optional[float] = None
    calories: Optional[float] = None
    protein: Optional[float] = None
    fat: Optional[float] = None
    carbs: Optional[float] = None
    recipe: Optional[str] = None

class DishOut(DishBase):
    id: UUID
    created_at: datetime
    created_by: Optional[UUID]

    model_config = {
        "from_attributes": True
    }


class DishProductBase(BaseModel):
    dish_id: UUID
    product_id: UUID
    weight: float

class DishProductCreate(DishProductBase):
    pass

class DishProductUpdate(BaseModel):
    weight: Optional[float] = None

class DishProductOut(DishProductBase):
    model_config = {
        "from_attributes": True
    }

class DishProductIn(BaseModel):
    product_id: UUID
    weight: float
