from fastapi import Depends
from sqlalchemy import select, or_, func
from sqlalchemy.orm import Session
from ..database import db_session
from ..models import User, Desk, Paginated, PaginationParams
from ..entities import UserEntity, DeskEntity
from .permission import PermissionService

class ResService:
    def __init__(self, session: Session = Depends(db_session), permission: PermissionService = Depends()):
        self._session = session
        self._permission = permission

    # def list_available_desks(self, subject: User, pagination: PaginationParams) -> Paginated[Desk]:
    #     #self._permission.enforce(subject, 'reservation.list_available_desks', 'reservation/')
    #     stmt = select(DeskEntity).where(DeskEntity.reserved == False).order_by(DeskEntity.id)
    #     desk_entities = self._session.execute(stmt).scalars()
    #     return Paginated(
    #         items=[desk_entity.to_model() for desk_entity in desk_entities],
    #         total=desk_entities.count()
    #     )

    def listdesks(self) -> list[Desk]:
        #self._permission.enforce(subject, 'reservation.listdesks', 'reservation/')
        stmt = select(DeskEntity).order_by(DeskEntity.id)
        desk_entities = self._session.execute(stmt).scalars()
        return [desk_entity.to_model() for desk_entity in desk_entities]
    
    # def create_reservation(self, subject: User, desk: Desk):        
    #     self._permission.enforce(subject, 'reservation.create_reservation', f'reservation/{desk.id}')
    #     desk = self._session.get(DeskEntity, desk.id)
    #     if desk:
    #         desk.reserved = True
    #         self._session.commit()
    #     return self.details(subject, desk.id)
    
    # def delete_reservation(self, subject: User, desk: Desk):
    #     self._permission.enforce(subject, 'reservation.delete_reservation', f'reservation/{desk.id}')
    #     desk = self._session.get(DeskEntity, desk.id)
    #     if desk:
    #         desk.reserved = False
    #         self._session.commit()
    #     return self.details(subject, desk.id)
    
    # def list_desk_reservation(self, subject: User, desk: Desk):
    #     self._permission.enforce(subject, 'reservation.list_desk_reservation', f'reservation/{desk.id}')
    #     desk = self._session.get(DeskEntity, desk.id)
    #     if desk:
    #         return desk.reserved
    #     return False

    
    