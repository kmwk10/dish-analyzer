from fastapi import APIRouter

router = APIRouter(
    prefix="/product",
    tags=["Product"]
)

@router.get("/")
def list_products():
    return {"message": "stub: list all products"}

@router.get("/{product_id}")
def get_product(product_id: int):
    return {"message": f"stub: get product {product_id}"}

@router.post("/")
def create_product():
    return {"message": "stub: create product"}

@router.put("/{product_id}")
def update_product(product_id: int):
    return {"message": f"stub: update product {product_id}"}

@router.delete("/{product_id}")
def delete_product(product_id: int):
    return {"message": f"stub: delete product {product_id}"}

@router.get("/favorites")
def list_my_products():
    return {"message": "stub: list favorite products of current user"}
