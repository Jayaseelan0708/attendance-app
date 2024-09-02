from pydantic import BaseModel

class NewCompany(BaseModel):
    name: str
    emailId: str
    address: str
    coordinate: str

class Company(BaseModel):
    sid: str
    name: str
    emailId: str
    address: str
    coordinate: str
    isActive: bool
    isVerified: bool