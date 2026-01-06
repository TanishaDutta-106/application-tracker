from fastapi import FastAPI

app = FastAPI(title="Application Tracker API")

@app.get("/health")
def health():
    return {"status": "ok"}