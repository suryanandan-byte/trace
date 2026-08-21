from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(
    prefix="/api/browser",
    tags=["Browser"]
)


class Viewport(BaseModel):
    width: int
    height: int


class BrowserInfo(BaseModel):
    url: str
    title: str
    tab_id: int
    viewport: Viewport


@router.post("")
async def receive_browser_info(
    browser_info: BrowserInfo
):

    print("Received:")
    print(browser_info)

    return {
        "status": "success",
        "message": "Browser information received",
        "url": browser_info.url,
        "title": browser_info.title
    }