from fastapi import FastAPI

from src.auth.router import router as auth_router
from src.dish.router import router as dish_router
from src.product.router import router as product_router
from src.user.router import router as user_router
 
app = FastAPI(title="KBJU Project API")

app.include_router(auth_router)
app.include_router(dish_router)
app.include_router(product_router)
app.include_router(user_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
