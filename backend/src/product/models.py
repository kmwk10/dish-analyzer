from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import String, Float, ForeignKey, DateTime, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base

if TYPE_CHECKING:
    from ..user.models import User, FavoriteProduct
    from ..dish.models import DishProduct


class Product(Base):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, server_default=text("gen_random_uuid()")
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    calories: Mapped[float] = mapped_column(Float, nullable=False)
    protein: Mapped[float] = mapped_column(Float, nullable=False)
    fat: Mapped[float] = mapped_column(Float, nullable=False)
    carbs: Mapped[float] = mapped_column(Float, nullable=False)

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()"), nullable=False
    )
    created_by: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL")
    )

    creator: Mapped[User] = relationship(back_populates="products")
    dish_products: Mapped[list[DishProduct]] = relationship(
        "DishProduct", back_populates="product", cascade="all, delete-orphan"
    )

    favorite_products: Mapped[list[FavoriteProduct]] = relationship(
        "FavoriteProduct", back_populates="product", cascade="all, delete-orphan"
    )
