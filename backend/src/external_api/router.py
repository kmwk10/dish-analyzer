from fastapi import APIRouter
from .service import fetch_quote
from .schemas import Quote

router = APIRouter(prefix="/external", tags=["external"])

@router.get("/quote", response_model=Quote)
async def get_quote():
    return await fetch_quote()
