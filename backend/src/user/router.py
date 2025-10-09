from fastapi import APIRouter

router = APIRouter(
    prefix="/user",
    tags=["User"]
)

@router.get("/")
def auth_root():
    return {"message": "Not implemented"}
