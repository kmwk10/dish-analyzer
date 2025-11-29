from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime


class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class UserOut(UserBase):
    id: UUID
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

class FavoriteProductBase(BaseModel):
    user_id: UUID
    product_id: UUID

class FavoriteProductCreate(FavoriteProductBase):
    pass

class FavoriteProductOut(FavoriteProductBase):
    model_config = {
        "from_attributes": True
    }

class FavoriteDishBase(BaseModel):
    user_id: UUID
    dish_id: UUID

class FavoriteDishCreate(FavoriteDishBase):
    pass

class FavoriteDishOut(FavoriteDishBase):
    model_config = {
        "from_attributes": True
    }
