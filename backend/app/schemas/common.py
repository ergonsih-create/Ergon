"""
GRAM-DISHA — Common Schema Definitions (Pydantic v2)
Provides CamelModel base with dual camelCase/snake_case serialization
and standard response wrappers.
"""

from typing import Generic, TypeVar, Optional, Any, List
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

T = TypeVar("T")


class CamelModel(BaseModel):
    """
    Base model that automatically aliases snake_case fields to camelCase
    for JSON serialization, while accepting BOTH snake_case and camelCase inputs.
    """
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )


class ApiResponse(CamelModel, Generic[T]):
    success: bool = True
    message: Optional[str] = None
    data: Optional[T] = None


class ApiErrorDetail(CamelModel):
    code: str
    message: str
    details: Optional[List[Any]] = None


class ApiErrorResponse(CamelModel):
    success: bool = False
    error: ApiErrorDetail
