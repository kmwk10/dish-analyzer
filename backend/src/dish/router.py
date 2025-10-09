from fastapi import APIRouter

router = APIRouter(
    prefix="/dish",
    tags=["Dish"]
)

@router.get("/")
def list_dishes():
    return {"message": "stub: list all dishes"}

@router.get("/{dish_id}")
def get_dish(dish_id: int):
    return {"message": f"stub: get dish {dish_id}"}

@router.post("/")
def create_dish():
    return {"message": "stub: create dish"}

@router.put("/{dish_id}")
def update_dish(dish_id: int):
    return {"message": f"stub: update dish {dish_id}"}

@router.delete("/{dish_id}")
def delete_dish(dish_id: int):
    return {"message": f"stub: delete dish {dish_id}"}

@router.get("/favorites")
def list_my_dishes():
    return {"message": "stub: list favorite dishes of current user"}
