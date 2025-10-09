from fastapi import FastAPI

app = FastAPI(title="Fullstack Project API")

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Server is running"}
