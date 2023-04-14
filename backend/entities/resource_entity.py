from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Self
from .entity_base import EntityBase
from .desk_resource_entity import desk_resource_table
from ..models import Desk, Resource

class ResourceEntity(EntityBase):
    __tablename__ = "resource"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    tag: Mapped[str] = mapped_column(String, unique=True)

    desks: Mapped[list['DeskEntity']] = relationship(secondary=desk_resource_table, back_populates='resources')

    @classmethod
    def from_model(cls, model: Resource) -> Self:
        return cls(
            id=model.id,
            tag=model.tag,
        )
    
    def to_model(self) -> Resource:
        return Resource(
            id=self.id,
            tag=self.tag
        )

