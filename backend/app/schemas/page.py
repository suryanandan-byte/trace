from pydantic import BaseModel

class PageInfo(BaseModel):
    url:str
    title:str