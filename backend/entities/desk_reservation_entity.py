from sqlalchemy import Integer, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Self
from .entity_base import EntityBase
from ..models import DeskReservation
from . import UserEntity
# from . import DeskEntity
from datetime import datetime

class DeskReservationEntity(EntityBase):
    __tablename__ = "desk_reservation"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    date: Mapped[datetime] = mapped_column(Date, unique=False)

    desk_id: Mapped[int] = mapped_column(ForeignKey('desk.id'), nullable=True)
<<<<<<< HEAD:backend/entities/desk_reservation_entity.py
    desk: Mapped['DeskEntity'] = relationship(back_populates='desk_reservations')

    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=True)
    user: Mapped[UserEntity] = relationship(back_populates='desk_reservations')
    # __table_args__ = (UniqueConstraint('desk_id', 'date', name='reservation_detail'),UniqueConstraint('user_id', 'date', name='user_reservation_time'))
=======
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=True)
    __table_args__ = (UniqueConstraint('desk_id', 'date', name='reservation_detail'),UniqueConstraint('user_id', 'date', name='user_reservation_time'))
>>>>>>> stage:backend/entities/desk_reservation.py

    @classmethod
    def from_model(cls, model: DeskReservation) -> Self:
        return cls(
            id=model.id,
            date=model.date,
        )
    
    def to_model(self) -> DeskReservation:
        print(self.date)
        return DeskReservation(
            id=self.id,
<<<<<<< HEAD:backend/entities/desk_reservation_entity.py
            date= str(self.date),
=======
            date=self.date
>>>>>>> stage:backend/entities/desk_reservation.py
        )