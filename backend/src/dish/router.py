from fastapi import APIRouter

router = APIRouter(
    prefix="/dish",
    tags=["Dish"]
)

@router.get("/")
def auth_root():
    return {"message": "Not implemented"}
