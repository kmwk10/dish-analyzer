from pydantic import BaseModel, EmailStr
from uuid import UUID


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None
    password: str | None = None


class UserOut(UserBase):
    id: UUID

    model_config = {
        "from_attributes": True
    }


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
