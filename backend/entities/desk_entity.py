'''Desks that are able to be reserved.'''

from sqlalchemy import Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Self
from .entity_base import EntityBase
from .desk_resource_entity import desk_resource_table
from ..models import Desk

class DeskEntity(EntityBase):
    __tablename__ = 'desk'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    available: Mapped[bool] = mapped_column(Boolean, default=True)

    resources: Mapped[list['ResourceEntity']] = relationship(secondary=desk_resource_table, back_populates='desks')

    @classmethod
    def from_model(cls, model: Desk) -> Self:
        return cls(
            id=model.id,
            name=model.name,
            available=model.available,
        )

    def to_model(self) -> Desk:
        return Desk(
            id=self.id,
            name=self.name,
            available=self.available,
        )

    def update(self, model: Desk) -> None:
        self.available = model.available