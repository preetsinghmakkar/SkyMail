from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class TemplateAssetResponse(BaseModel):
    id: UUID
    template_id: Optional[UUID]
    file_url: str
    file_type: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TemplateCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Template name")
    subject: str = Field(..., min_length=1, max_length=255, description="Email subject")
    html_content: str = Field(..., description="HTML content")
    text_content: Optional[str] = Field(None, description="Plain text content")
    constants: List[str] = Field(default_factory=list, description="Template constants")


class TemplateUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, max_length=100, description="Template name")
    subject: Optional[str] = Field(None, max_length=255, description="Email subject")
    html_content: Optional[str] = Field(None, description="HTML content")
    text_content: Optional[str] = Field(None, description="Plain text content")
    constants: Optional[List[str]] = Field(None, description="Template constants")
    is_active: Optional[bool] = Field(None, description="Active status")


class TemplateResponse(BaseModel):
    id: UUID
    company_id: UUID
    name: str
    subject: str
    html_content: str
    text_content: Optional[str]
    constants: List[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime
    assets: List[TemplateAssetResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class TemplateListItem(BaseModel):
    id: UUID
    name: str
    subject: str
    constants: List[str]
    is_active: bool
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TemplateListResponse(BaseModel):
    items: List[TemplateListItem]
    total: int
    page: int
    limit: int


class TemplateVersionResponse(BaseModel):
    id: UUID
    template_id: UUID
    subject: str
    html_content: str
    text_content: Optional[str]
    constants: List[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
