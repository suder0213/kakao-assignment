from fastapi import FastAPI

app = FastAPI(title="Todo API")

@app.get("/")
def root():
    return {"message": "Hello World"}
