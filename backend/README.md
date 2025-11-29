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
    ├── main.py            # Точка входа FastAPI-приложения
    │
    ├── auth/              # Авторизация
    │   ├── __init__.py
    │   ├── router.py      # Эндпоинты
    │   ├── service.py     # Бизнес-логика
    │   └── security.py    # Функции безопасности
    │
    ├── dish/              # Блюда
    │   ├── __init__.py
    │   ├── models.py      # SQL-модели
    │   ├── schemas.py     # Pydantic-схемы
    │   ├── router.py      # Эндпоинты
    │   └── service.py     # Бизнес-логика
    │
    ├── product/           # Продукты
    │   ├── __init__.py
    │   ├── models.py
    │   ├── schemas.py 
    │   ├── router.py 
    │   └── service.py 
    │
    └── user/              # Пользователи
        ├── __init__.py
        ├── models.py
        ├── schemas.py
        ├── router.py
        └── service.py
```

## API
### Auth
POST /auth/register — регистрация пользователя\
POST /auth/login — вход пользователя\
POST /auth/logout — выход пользователя

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
GET /user/ — список всех пользователей\
GET /user/{user_id} — получение пользователя по ID\
POST /user/ — создание пользователя\
PUT /user/{user_id} — обновление пользователя\
DELETE /user/{user_id} — удаление пользователя
