from pydantic import BaseModel
from typing import List

class Application(BaseModel):
    id: int
    company: str
    role: str
    status: str

class ApplicationList(BaseModel):
    applications: List[Application]

class CreateApplicationRequest(BaseModel):
    company: str
    role: str
    status: str

class UpdateApplicationStatusRequest(BaseModel):
    status: str