import pytest
from unittest.mock import AsyncMock, MagicMock


@pytest.fixture
def db():
    db = MagicMock()

    db.execute = AsyncMock()
    db.commit = AsyncMock()
    db.refresh = AsyncMock()
    db.delete = AsyncMock()

    return db
