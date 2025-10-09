from fastapi import APIRouter

router = APIRouter(
    prefix="/product",
    tags=["Product"]
)

@router.get("/")
def product_root():
    return {"message": "Not implemented"}
