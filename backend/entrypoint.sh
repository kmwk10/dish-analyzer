#!/bin/bash
set -e

echo "Waiting for Postgres..."
export PGPASSWORD=$POSTGRES_PASSWORD
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER"; do
  sleep 1
done
echo "Postgres is ready"

echo "Running migrations..."
alembic upgrade head

echo "Starting backend..."
exec uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
