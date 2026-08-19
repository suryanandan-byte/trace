from fastapi import FastAPI
from app.schemas.page import PageInfo
app = FastAPI()
@app.get("/")
async def root():
    return {"message": "Trace2Prompt API"}
@app.post("/page")
async def receive_page(page:PageInfo):
    return {
        "message":"page received",
        "url":page.url,
        "title":page.title
    }
if __name__ =="__main__":
    import uvicorn
    uvicorn.run(app,host="127.0.0.1",port=8000)