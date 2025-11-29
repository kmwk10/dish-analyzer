from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import String, DateTime, ForeignKey, text, UniqueConstraint, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base

if TYPE_CHECKING:
    from ..product.models import Product
    from ..dish.models import Dish


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, server_default=text("gen_random_uuid()")
    )
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()"), nullable=False
    )

    products: Mapped[list[Product]] = relationship(back_populates="creator", cascade="all, delete-orphan")
    dishes: Mapped[list[Dish]] = relationship(back_populates="creator", cascade="all, delete-orphan")
    favorite_products: Mapped[list[FavoriteProduct]] = relationship(
        "FavoriteProduct", back_populates="user", cascade="all, delete-orphan"
    )
    favorite_dishes: Mapped[list[FavoriteDish]] = relationship(
        "FavoriteDish", back_populates="user", cascade="all, delete-orphan"
    )


class FavoriteProduct(Base):
    __tablename__ = "favorite_products"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), primary_key=True
    )

    user: Mapped[User] = relationship(back_populates="favorite_products")
    product: Mapped[Product] = relationship(back_populates="favorite_products")


class FavoriteDish(Base):
    __tablename__ = "favorite_dishes"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    dish_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("dishes.id", ondelete="CASCADE"), primary_key=True
    )

    user: Mapped[User] = relationship(back_populates="favorite_dishes")
    dish: Mapped[Dish] = relationship(back_populates="favorite_dishes")
