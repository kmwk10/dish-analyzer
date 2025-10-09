from fastapi import APIRouter

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post("/register")
def register_user():
    return {"message": "stub: register user"}

@router.post("/login")
def login_user():
    return {"message": "stub: login"}

@router.post("/logout")
def logout_user():
    return {"message": "stub: logout"}
