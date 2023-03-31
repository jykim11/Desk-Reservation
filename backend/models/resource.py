"""Resource is the data object for equipment that a desk comes with."""

from pydantic import BaseModel

class Resource(BaseModel):
    id: int | None = None
    name: str