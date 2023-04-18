from fastapi import Depends
from sqlalchemy import select, or_, func
from sqlalchemy.orm import Session
from ..database import db_session
from ..models import User, Desk, Paginated, PaginationParams, DeskReservation
from ..entities import UserEntity, DeskEntity, DeskReservationEntity
from .permission import PermissionService

class ResService:
    def __init__(self, session: Session = Depends(db_session), permission: PermissionService = Depends()):
        self._session = session
        self._permission = permission

    def list_desks(self, subject: User) -> list[Desk]:
        """List all desks.

        Args:
            subject: The user performing the action.

        Returns:
            list[Desk]: A list of all desk entities.
        
        Raises:
            PermissionError: If the subject does not have permission to admin access.
        """
        self._permission.enforce(subject, '*', 'admin/')
        stmt = select(DeskEntity).order_by(DeskEntity.id)
        desk_entities = self._session.execute(stmt).scalars()
        return [desk_entity.to_model() for desk_entity in desk_entities]

    def list_available_desks(self) -> list[Desk]:
        """List available desks.

        Returns:
            list[Desk]: A list of available desk entities.
        """
        stmt = select(DeskEntity).where(DeskEntity.available == True).order_by(DeskEntity.id)
        desk_entities = self._session.execute(stmt).scalars()
        return [desk_entity.to_model() for desk_entity in desk_entities]

    def list_desk_reservations_by_user(self, user: User) -> list[(DeskReservation, Desk)]:
        """List desk reservations by user.

        Args:
            user: The user whose reservations to retrieve.

        Returns:
            list[(DeskReservation, Desk)]: A list of tuples, each containing a desk reservation entity and its associated desk entity.
        """
        stmt = select(DeskReservationEntity, DeskEntity)\
            .join(DeskEntity)\
            .where(DeskReservationEntity.user_id == user.id)\
            .order_by(DeskReservationEntity.date)
        reservation_entities = self._session.execute(stmt).all()
        return [(desk_reservation_entity, desk_entity) for desk_reservation_entity, desk_entity in reservation_entities]

    def list_all_desk_reservations(self, subject: User) -> list[(DeskReservation, Desk, User)]:
        """List all desk reservations.

        Args:
            subject: The user performing the action.

        Returns:
            list[(DeskReservation, Desk, User)]: A list of tuples, each containing a desk reservation entity, its associated desk entity, and the user who reserved the desk.
        
        Raises:
            PermissionError: If the subject does not have permission to admin access.
        """
        self._permission.enforce(subject, '*', 'admin/')
        stmt = select(DeskReservationEntity, DeskEntity, UserEntity)\
            .join(DeskEntity)\
            .join(UserEntity)\
            .order_by(DeskReservationEntity.date)
        reservation_entities = self._session.execute(stmt).all()
        return [(desk_reservation_entity, desk_entity, user_entity) for desk_reservation_entity, desk_entity, user_entity in reservation_entities]
    
    def make_desk_unavailable(self, desk: Desk) -> Desk:
        """Make a desk unavailable.

        Args:
            desk: The desk to make unavailable.

        Returns:
            Desk: The updated desk entity.
        """
        desk_entity = self._session.get(DeskEntity, desk.id)
        desk_entity.available = False
        self._session.commit()
        return desk_entity.to_model()

    def make_desk_available(self, desk: Desk) -> Desk:
        """Make a desk available.

        Args:
            desk: The desk to make available.

        Returns:
            Desk: The updated desk entity.
        """
        desk_entity = self._session.get(DeskEntity, desk.id)
        desk_entity.available = True
        self._session.commit()
        return desk_entity.to_model()

    def create_desk_reservation(self, desk: Desk, user: User, reservation: DeskReservation) -> DeskReservation:
        """Create a desk reservation.

        Args:
            desk: The desk to reserve.
            user: The user reserving the desk.
            reservation: The desk reservation details.

        Returns:
            DeskReservation: The created desk reservation entity.
        """
        self.make_desk_unavailable(desk)
        reservation_entity = DeskReservationEntity.from_model(reservation)
        reservation_entity.user_id = user.id
        reservation_entity.desk_id = desk.id
        self._session.add(reservation_entity)
        self._session.commit()
        return reservation_entity.to_model()

    def remove_desk_reservation(self, desk: Desk, user: User, reservation: DeskReservation) -> Desk:
        """Remove a desk reservation.

        Args:
            desk: The desk whose reservation to remove.
            user: The user who reserved the desk.
            reservation: The reservation to remove.

        Returns:
            Desk: The updated desk entity.
        """
        self.make_desk_available(desk)
        reservation_entity = self._session.get(DeskReservationEntity, reservation.id)
        self._session.delete(reservation_entity)
        self._session.commit()
        return reservation_entity.to_model()

    #unverified services
    
    def create_desk(self, desk: Desk, subject: User) -> Desk:
        """Create a new desk.

        Args:
            desk: The desk to create.

        Returns:
            Desk: The created desk entity.
        
        Raises:
            PermissionError: If the subject does not have permission to admin access.
        """
        self._permission.enforce(subject, '*', 'admin/')
        desk_entity = DeskEntity.from_model(desk)
        self._session.add(desk_entity)
        self._session.commit()
        return desk_entity.to_model()

    def remove_desk(self, desk: Desk, subject: User) -> Desk:
        """Remove a desk.

        Args:
            desk: The desk to remove.

        Returns:
            Desk: The removed desk entity.

        Raises:
            PermissionError: If the subject does not have permission to admin access.
        """
        self._permission.enforce(subject, '*', 'admin/')
        desk_entity = self._session.get(DeskEntity, desk.id)
        self._session.delete(desk_entity)
        self._session.commit()
        return desk_entity.to_model()   