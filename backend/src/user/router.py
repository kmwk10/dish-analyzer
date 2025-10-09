from fastapi import APIRouter

router = APIRouter(
    prefix="/user",
    tags=["User"]
)

@router.get("/{user_id}")
def get_user(user_id: int):
    return {"message": f"stub: get user {user_id}"}

@router.post("/")
def create_user():
    return {"message": "stub: create user"}

@router.put("/{user_id}")
def update_user(user_id: int):
    return {"message": f"stub: update user {user_id}"}

@router.delete("/{user_id}")
def delete_user(user_id: int):
    return {"message": f"stub: delete user {user_id}"}
