from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from ..database import get_db
from ..user import UserCreate

from .schemas import UserLogin, TokenPair
from .service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=TokenPair)
async def register(
    data: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    return await AuthService.register(
        db=db,
        data=data.model_dump()
    )

@router.post("/login", response_model=TokenPair)
async def login(
    data: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    return await AuthService.login(
        db=db,
        data=data.model_dump()
    )

@router.post("/refresh", response_model=TokenPair)
async def refresh(
    refresh_token: str,
    db: AsyncSession = Depends(get_db)
):
    return await AuthService.refresh(
        db=db,
        refresh_token=refresh_token
    )
