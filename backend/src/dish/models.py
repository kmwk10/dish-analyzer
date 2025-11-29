from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import String, Float, Text, ForeignKey, DateTime, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base

if TYPE_CHECKING:
    from ..user.models import User, FavoriteDish
    from ..product.models import Product


class Dish(Base):
    __tablename__ = "dishes"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, server_default=text("gen_random_uuid()")
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    weight: Mapped[float] = mapped_column(Float, nullable=False)
    servings: Mapped[float] = mapped_column(Float, nullable=False)
    calories: Mapped[float] = mapped_column(Float, nullable=False)
    protein: Mapped[float] = mapped_column(Float, nullable=False)
    fat: Mapped[float] = mapped_column(Float, nullable=False)
    carbs: Mapped[float] = mapped_column(Float, nullable=False)
    recipe: Mapped[str | None] = mapped_column(Text)

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()"), nullable=False
    )
    created_by: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL")
    )

    creator: Mapped[User] = relationship(back_populates="dishes")
    dish_products: Mapped[list[DishProduct]] = relationship(
        "DishProduct", back_populates="dish", cascade="all, delete-orphan"
    )
    favorite_dishes: Mapped[list[FavoriteDish]] = relationship(
        "FavoriteDish", back_populates="dish", cascade="all, delete-orphan"
    )


class DishProduct(Base):
    __tablename__ = "dish_products"

    dish_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("dishes.id", ondelete="CASCADE"), primary_key=True
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), primary_key=True
    )
    weight: Mapped[float] = mapped_column(Float, nullable=False)

    dish: Mapped[Dish] = relationship(back_populates="dish_products")
    product: Mapped[Product] = relationship(back_populates="dish_products")
