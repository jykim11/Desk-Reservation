"""Desk model serves as the data object for representing desks that can be reserved"""

from pydantic import BaseModel

class Desk(BaseModel):
    id: int | None = None
    name: str = ""
    available: bool = True

