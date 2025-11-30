# Backend

## Структура проекта
```
backend/
├── .dockerignore 
├── Dockerfile             # Образ backend-сервера
├── README.md
├── requirements.txt       # Зависимости Python
└── src/
    ├── __init__.py
    ├── config.py          # Конфигурации проекта
    ├── database.py        # Подключение к базе данных (SQLAlchemy)
    ├── dependencies.py    # Зависимости FastAPI
    ├── main.py            # Точка входа FastAPI-приложения
    │
    ├── auth/              # Авторизация
    │   ├── __init__.py
    │   ├── router.py      # Эндпоинты
    │   ├── schemas.py     # Pydantic-схемы
    │   ├── security.py    # Функции безопасности
    │   └── service.py     # Бизнес-логика
    │
    ├── dish/              # Блюда
    │   ├── __init__.py
    │   ├── models.py      # SQL-модели
    │   ├── router.py      # Эндпоинты
    │   ├── schemas.py     # Pydantic-схемы
    │   └── service.py     # Бизнес-логика
    │
    ├── product/           # Продукты
    │   ├── __init__.py
    │   ├── models.py
    │   ├── router.py 
    │   ├── schemas.py 
    │   └── service.py 
    │
    └── user/              # Пользователи
        ├── __init__.py
        ├── models.py
        ├── router.py
        ├── schemas.py
        └── service.py
```

## API
### Auth
POST /auth/register — регистрация пользователя и выдача пары токенов\
POST /auth/login — аутентификация пользователя и выдача пары токенов\
GET  /auth/me — получение информации о текущем пользователе (по access-токену)\
POST /auth/refresh — обновление access-токена по refresh-токену

### Dish
POST /dish/ — создание блюда\
GET /dish/{dish_id} — получение блюда по ID\
PUT /dish/{dish_id} — обновление блюда\
DELETE /dish/{dish_id} — удаление блюда\
GET /dish/ — список всех блюд\
GET /dish/search/?query=… — поиск блюд по названию\
GET /dish/{dish_id}/products/ — список продуктов в блюде\
POST /dish/{dish_id}/products/ — добавление продуктов в блюдо\
PUT /dish/{dish_id}/products/ — обновление продуктов блюда

### Product
POST /products/ — создание продукта\
GET /products/{product_id} — получение продукта по ID\
PUT /products/{product_id} — обновление продукта\
DELETE /products/{product_id} — удаление продукта\
GET /products/ — список всех продуктов\
GET /products/search/?query=… — поиск продуктов по названию

### User
GET /user/me — получение текущего пользователя\
PUT /user/me — обновление текущего пользователя\
DELETE /user/me — удаление текущего пользователя\
GET /user/me/favorites/dishes/ — список избранных блюд текущего пользователя\
POST /user/me/favorites/dishes/{dish_id} — добавить блюдо в избранное текущего пользователя\
DELETE /user/me/favorites/dishes/{dish_id} — убрать блюдо из избранного текущего пользователя\
GET /user/me/favorites/products/ — список избранных продуктов текущего пользователя\
POST /user/me/favorites/products/{product_id} — добавить продукт в избранное текущего пользователя\
DELETE /user/me/favorites/products/{product_id} — убрать продукт из избранного текущего пользователя
