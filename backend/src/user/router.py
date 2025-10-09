from fastapi import APIRouter

router = APIRouter(
    prefix="/user",
    tags=["User"]
)

@router.get("/")
def user_root():
    return {"message": "Not implemented"}
