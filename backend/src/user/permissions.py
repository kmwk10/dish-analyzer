from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from ..dependencies import get_current_user_id
from ..database import get_db
from .service import UserService
from .models import UserRole, User


async def admin_only(
    db: AsyncSession = Depends(get_db),
    current_user: UUID = Depends(get_current_user_id)
) -> User:
    user = await UserService.get_user(db, current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return user
