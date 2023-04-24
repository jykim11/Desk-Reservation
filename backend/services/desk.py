from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..database import db_session
from ..models import User, Desk
from ..entities import DeskEntity
from .permission import PermissionService

class DeskService:
    def __init__(self, session: Session = Depends(db_session), permission: PermissionService = Depends()):
        self._session = session
        self._permission = permission
    

    def list_all_desks(self, subject: User) -> list[Desk]:
        """List all desks.

        Args:
            subject: The user performing the action.

        Returns:
            list[Desk]: A list of all desk entities.
        
        Raises:
            PermissionError: If the subject does not have permission to admin access.
        """
        self._permission.enforce(subject, 'admin/', '*')
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
    

    def create_desk(self, desk: Desk, subject: User) -> Desk:
        """Create a new desk.

        Args:
            desk: The desk to create.

        Returns:
            Desk: The created desk entity.
        
        Raises:
            PermissionError: If the subject does not have permission to admin access.
        """
        self._permission.enforce(subject, 'admin/', '*')
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
        self._permission.enforce(subject, 'admin/', '*')
        desk_entity = self._session.get(DeskEntity, desk.id)
        self._session.delete(desk_entity)
        self._session.commit()
        return desk_entity.to_model()


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