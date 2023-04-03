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

    def listdesks(self) -> list[Desk]:
        #self._permission.enforce(subject, 'reservation.listdesks', 'reservation/')
        stmt = select(DeskEntity).order_by(DeskEntity.id)
        desk_entities = self._session.execute(stmt).scalars()
        return [desk_entity.to_model() for desk_entity in desk_entities]