from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal

class UserPreferences(BaseModel):
    dataRetentionDays: int = Field(default=30, ge=0, le=365)
    language: str = Field(default="en")
    lowLiteracyMode: bool = Field(default=False)

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: str = Field(min_length=2, max_length=100)
    role: Optional[Literal["user", "officer", "admin"]] = "user"
    organization: Optional[str] = None
    industrySector: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    id: str
    email: str
    name: str
    role: str
    organization: Optional[str] = None
    industrySector: Optional[str] = None
    preferences: UserPreferences
    createdAt: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    organization: Optional[str] = None
    industrySector: Optional[str] = None

class PreferencesUpdate(BaseModel):
    dataRetentionDays: Optional[int] = Field(default=None, ge=0, le=365)
    language: Optional[str] = None
    lowLiteracyMode: Optional[bool] = None

class TokenResponse(BaseModel):
    user: UserProfile
    token: str
