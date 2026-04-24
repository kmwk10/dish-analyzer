## Инструкция по запуску проекта

Клонируйте репозиторий:

```bash
git clone https://github.com/kmwk10/dish-analyzer.git
cd dish-analyzer
```

Скопируйте пример файла окружения `.env.example` в `.env`.

```bash
cp backend/.env.example backend/.env
```

> При необходимости отредактируйте `.env` файл, чтобы задать свои значения переменных окружения.

Соберите и запустите контейнеры с помощью Docker Compose:

```bash
docker-compose up --build
```

Перейдите по адресам, чтобы пользоваться приложением:

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000/docs](http://localhost:8000/docs)
