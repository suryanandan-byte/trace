from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Trace2Prompt API"}
@app.get("/health")
async def health():
    return {"section":"health"}