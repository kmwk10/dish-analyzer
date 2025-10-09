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
GET /dish/ — список всех блюд\
GET /dish/{dish_id} — получение блюда по ID\
POST /dish/ — создание блюда\
PUT /dish/{dish_id} — обновление блюда\
DELETE /dish/{dish_id} — удаление блюда\
GET /dish/favorites — список избранных блюд текущего пользователя

### Product
GET /product/ — список всех продуктов\
GET /product/{product_id} — получение продукта по ID\
POST /product/ — создание продукта\
PUT /product/{product_id} — обновление продукта\
DELETE /product/{product_id} — удаление продукта\
GET /product/favorites — список избранных продуктов текущего пользователя

### User
GET /user/ — список всех пользователей\
GET /user/{user_id} — получение пользователя по ID\
POST /user/ — создание пользователя\
PUT /user/{user_id} — обновление пользователя\
DELETE /user/{user_id} — удаление пользователя
