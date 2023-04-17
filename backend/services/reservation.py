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

<<<<<<< HEAD

    #verified services

    def list_desks(self) -> list[Desk]:
=======
    # def list_available_desks(self, subject: User, pagination: PaginationParams) -> Paginated[Desk]:
    #     #self._permission.enforce(subject, 'reservation.list_available_desks', 'reservation/')
    #     stmt = select(DeskEntity).where(DeskEntity.reserved == False).order_by(DeskEntity.id)
    #     desk_entities = self._session.execute(stmt).scalars()
    #     return Paginated(
    #         items=[desk_entity.to_model() for desk_entity in desk_entities],
    #         total=desk_entities.count()
    #     )

    def listdesks(self) -> list[Desk]:
>>>>>>> stage
        #self._permission.enforce(subject, 'reservation.listdesks', 'reservation/')
        stmt = select(DeskEntity).order_by(DeskEntity.id)
        desk_entities = self._session.execute(stmt).scalars()
        return [desk_entity.to_model() for desk_entity in desk_entities]
<<<<<<< HEAD

    def list_available_desks(self) -> list[Desk]:
        #self._permission.enforce(subject, 'reservation.listavailabledesks', 'reservation/')
        stmt = select(DeskEntity).where(DeskEntity.available == True).order_by(DeskEntity.id)
        desk_entities = self._session.execute(stmt).scalars()
        return [desk_entity.to_model() for desk_entity in desk_entities]

    def list_desk_reservations_by_user(self, user: User) -> list[(DeskReservation, Desk)]:
        #self._permission.enforce(subject, 'reservation.listdeskreservationsbyuser', 'reservation/')
        stmt = select(DeskReservationEntity, DeskEntity)\
            .join(DeskEntity)\
            .where(DeskReservationEntity.user_id == user.id)\
            .order_by(DeskReservationEntity.id, DeskEntity.id)
        reservation_entities = self._session.execute(stmt).all()
        return [(desk_reservation_entity, desk_entity) for desk_reservation_entity, desk_entity in reservation_entities]

    def make_desk_unavailable(self, desk: Desk) -> Desk:
        #self._permission.enforce(subject, 'reservation.makedeskunavailable', 'reservation/')
        desk_entity = self._session.get(DeskEntity, desk.id)
        desk_entity.available = False
        self._session.commit()
        return desk_entity.to_model()

    def make_desk_available(self, desk: Desk) -> Desk:
        #self._permission.enforce(subject, 'reservation.makedeskavailable', 'reservation/')
        desk_entity = self._session.get(DeskEntity, desk.id)
        desk_entity.available = True
        self._session.commit()
        return desk_entity.to_model()

    def create_desk_reservation(self, desk: Desk, user: User, reservation: DeskReservation) -> DeskReservation:
        #self._permission.enforce(subject, 'reservation.createdeskreservation', 'reservation/')
        self.make_desk_unavailable(desk)
        reservation_entity = DeskReservationEntity.from_model(reservation)
        reservation_entity.user_id = user.id
        reservation_entity.desk_id = desk.id
        self._session.add(reservation_entity)
        self._session.commit()
        return reservation_entity.to_model()

    def remove_desk_reservation(self, desk: Desk, user: User, reservation: DeskReservation) -> Desk:
        #self._permission.enforce(subject, 'reservation.removedeskreservation', 'reservation/')
        self.make_desk_available(desk)
        reservation_entity = self._session.get(DeskReservationEntity, reservation.id)
        self._session.delete(reservation_entity)
        self._session.commit()
        return reservation_entity.to_model()

    #unverified services
    
    def create_desk(self, desk: Desk) -> Desk:
        #self._permission.enforce(subject, 'reservation.createdesk', 'reservation/')
        desk_entity = DeskEntity.from_model(desk)
        self._session.add(desk_entity)
        self._session.commit()
        return desk_entity.to_model()

    def remove_desk(self, desk: Desk) -> Desk:
        #self._permission.enforce(subject, 'reservation.removedesk', 'reservation/')
        desk_entity = self._session.get(DeskEntity, desk.id)
        self._session.delete(desk_entity)
        self._session.commit()
        return desk_entity.to_model()

    
    

    

    
    
=======
    
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
>>>>>>> stage

    
    