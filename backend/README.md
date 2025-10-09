# Backend

## Структура проекта

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
