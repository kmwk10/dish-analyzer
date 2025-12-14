## Инструкция по запуску проекта

Клонируйте репозиторий:

```bash
git clone https://github.com/kmwk10/dish-analyzer.git
cd dish-analyzer
```

Скопируйте пример файлов окружения `.env.example` в `.env`.

Для backend:

```bash
cp backend/.env.example backend/.env
```

Для frontend:

```bash
cp frontend/.env.example frontend/.env
```

> При необходимости отредактируйте `.env` файлы, чтобы задать свои значения переменных окружения.

Соберите и запустите контейнеры с помощью Docker Compose:

```bash
docker-compose up --build
```

Перейдите по адресам, чтобы пользоваться приложением:

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000/docs](http://localhost:8000/docs)
