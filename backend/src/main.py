from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.auth import router as auth_router
from src.dish import router as dish_router
from src.product import router as product_router
from src.user import router as user_router
from src.seo import router as seo_router
from src.external_api import router as external_router
 
app = FastAPI(title="KBJU Project API")

app.include_router(auth_router)
app.include_router(dish_router)
app.include_router(product_router)
app.include_router(user_router)
app.include_router(seo_router)
app.include_router(external_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
