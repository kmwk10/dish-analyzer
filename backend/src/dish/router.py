from fastapi import APIRouter

router = APIRouter(
    prefix="/dish",
    tags=["Dish"]
)

@router.get("/")
def dish_root():
    return {"message": "Not implemented"}
