import os
from minio import Minio
from minio.error import S3Error
from typing import Optional

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")
MINIO_BUCKET = os.getenv("MINIO_BUCKET")
USE_SECURE = os.getenv("MINIO_USE_SECURE") == "1"

client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=USE_SECURE
)

if not client.bucket_exists(MINIO_BUCKET):
    client.make_bucket(MINIO_BUCKET)


def upload_file(object_name: str, file_data: bytes, content_type: str) -> None:
    client.put_object(
        bucket_name=MINIO_BUCKET,
        object_name=object_name,
        data=file_data,
        length=len(file_data),
        content_type=content_type
    )


def delete_file(object_name: str) -> None:
    try:
        client.remove_object(MINIO_BUCKET, object_name)
    except S3Error as e:
        print(f"MinIO delete error: {e}")


def generate_presigned_url(object_name: str, expires: int = 3600) -> Optional[str]:
    try:
        url = client.presigned_get_object(
            bucket_name=MINIO_BUCKET,
            object_name=object_name,
            expires=expires
        )
        return url
    except S3Error as e:
        print(f"MinIO presigned URL error: {e}")
        return None
