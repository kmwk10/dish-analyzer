from fastapi import APIRouter

router = APIRouter(
    prefix="/product",
    tags=["Product"]
)

@router.get("/")
def auth_root():
    return {"message": "Not implemented"}
