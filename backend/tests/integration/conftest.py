import os
import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import NullPool
from unittest.mock import MagicMock


from src.main import app
from src.database import get_db, Base
from src.s3 import get_minio

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")

@pytest.fixture(scope="session")
async def engine():
    engine = create_async_engine(
        TEST_DATABASE_URL, 
        poolclass=NullPool
    )
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    yield engine
    await engine.dispose()

@pytest.fixture
async def db(engine):
    async_session = async_sessionmaker(
        engine,
        expire_on_commit=False,
        class_=AsyncSession
    )

    async with async_session() as session:
        yield session
        await session.rollback()

@pytest.fixture
async def client(db):
    async def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac
    
    app.dependency_overrides.clear()

@pytest.fixture(autouse=True)
def override_minio():
    mock = MagicMock()
    mock.put_object = MagicMock()
    mock.fget_object = MagicMock()
    mock.get_object = MagicMock()
    mock.remove_object = MagicMock()
    mock.presigned_get_object = MagicMock(return_value="http://test-url")

    app.dependency_overrides[get_minio] = lambda: mock

    yield

    app.dependency_overrides.pop(get_minio, None)
