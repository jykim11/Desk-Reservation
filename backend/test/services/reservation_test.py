import pytest

from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from ...models import User, Role, Permission, Desk, DeskReservation
from ...entities import UserEntity, RoleEntity, PermissionEntity, DeskEntity, DeskReservationEntity
from ...services import ResService


@pytest.fixture(autouse=True)
def test_session():
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from ...entities import EntityBase

    engine = create_engine('sqlite:///:memory:', echo=True)
    EntityBase.metadata.create_all(engine)

    Session = sessionmaker(bind=engine)
    session = Session()

    yield session

    session.rollback()
    session.close()
    EntityBase.metadata.drop_all(engine)


# Tests all desks in the database.
def test_list_desk(test_session: Session):
    desk1 = Desk(id=1, tag='AA1', desk_type='Computer Desk', included_resource='Pro Display XDR w/ Mac Pro', available=True)
    desk2 = Desk(id=2, tag='CD1', desk_type='Standing Desk', included_resource='Windows Desktop i9', available=True)

    desk1_entity = DeskEntity.from_model(desk1)
    desk2_entity = DeskEntity.from_model(desk2)

    test_session.add(desk1_entity)
    test_session.add(desk2_entity)

    test_session.commit()

    reservation_service = ResService(test_session)
    desks = reservation_service.list_desks()
    
    assert [desk.tag for desk in desks] == ['AA1', 'CD1']


# Test desk reservation by user.
def test_list_desk_reservations_by_user(test_session: Session):
    student = User(id=1, pid=123456789, onyen='student', email='student@unc.edu')
    student_entity = UserEntity.from_model(student)
    test_session.add(student_entity)

    desk = Desk(id=1, tag='AA1', desk_type='Computer Desk', included_resource='Pro Display XDR w/ Mac Pro', available=True)
    desk_entity = DeskEntity.from_model(desk)
    test_session.add(desk_entity)
    test_session.commit()
    
    date = datetime.now()
    reservation = DeskReservation(id=1, date=date, user_id=student.id, desk_id=desk.id)
    reservation_entity = DeskReservationEntity.from_model(reservation)
    test_session.add(reservation_entity)
    test_session.commit()

    assert reservation_entity.id is not None

    get_reservation_entity = test_session.get(DeskReservationEntity, reservation_entity.id)
    assert get_reservation_entity.date == reservation.date.date()


# Test making the desk unavailable to reserve.
def test_make_desk_unavailable(test_session: Session):
    desk1 = Desk(id=1, tag='AA1', desk_type='Computer Desk', included_resource='Pro Display XDR w/ Mac Pro', available=True)
    desk2 = Desk(id=2, tag='CD1', desk_type='Standing Desk', included_resource='Windows Desktop i9', available=True)
    desk1_entity = DeskEntity.from_model(desk1)
    desk2_entity = DeskEntity.from_model(desk2)

    test_session.add(desk1_entity)
    test_session.add(desk2_entity)

    test_session.commit()
    reservation_service = ResService(test_session)

    reservation_service.make_desk_unavailable(desk1)

    desk1_unavailable = test_session.get(DeskEntity, desk1.id)
    assert not desk1_unavailable.available


# Test making the desk available to reserve.
def test_make_desk_available(test_session: Session):
    desk1 = Desk(id=1, tag='AA1', desk_type='Computer Desk', included_resource='Pro Display XDR w/ Mac Pro', available=True)
    desk2 = Desk(id=2, tag='CD1', desk_type='Standing Desk', included_resource='Windows Desktop i9', available=True)
    desk1_entity = DeskEntity.from_model(desk1)
    desk2_entity = DeskEntity.from_model(desk2)

    test_session.add(desk1_entity)
    test_session.add(desk2_entity)

    test_session.commit()
    reservation_service = ResService(test_session)

    reservation_service.make_desk_unavailable(desk1)

    desk1_unavailable = test_session.get(DeskEntity, desk1.id)
    assert not desk1_unavailable.available

    reservation_service.make_desk_available(desk1)
    desk1_available = test_session.get(DeskEntity, desk1.id)
    print('desk1 available: ', desk1_available)
    assert desk1_available.available == True


# Test to create reservation of desk.
def test_create_reservation(test_session: Session):
    student = User(id=1, pid=123456789, onyen='student', email='student@unc.edu')
    student_entity = UserEntity.from_model(student)
    test_session.add(student_entity)

    desk = Desk(id=1, tag='AA1', desk_type='Computer Desk', included_resource='Pro Display XDR w/ Mac Pro', available=True)
    desk_entity = DeskEntity.from_model(desk)
    test_session.add(desk_entity)

    reservation = DeskReservation(id=1, date=datetime.now())
    reservation_service = ResService(test_session)

    reservation_service.create_desk_reservation(desk, student, reservation)

    with pytest.raises(IntegrityError):
        reservation_service.create_desk_reservation(desk, student, reservation)
    

# Test to remove the desk reservation.
def test_remove_desk_reservation(test_session: Session):
    student = User(id=1, pid=123456789, onyen='student', email='student@unc.edu')
    student_entity = UserEntity.from_model(student)
    test_session.add(student_entity)

    desk = Desk(id=1, tag='AA1', desk_type='Computer Desk', included_resource='Pro Display XDR w/ Mac Pro', available=True)
    desk2 = Desk(id=2, tag='CD1', desk_type='Standing Desk', included_resource='Windows Desktop i9', available=True)
    desk_entity = DeskEntity.from_model(desk)
    desk2_entity = DeskEntity.from_model(desk2)

    test_session.add(desk_entity)
    test_session.add(desk2_entity)

    reservation = DeskReservation(id=1, date=datetime.now())
    reservation_service = ResService(test_session)

    reservation_service.create_desk_reservation(desk, student, reservation)
    remove_reservation = reservation_service.remove_desk_reservation(desk, student, reservation)
    assert remove_reservation.id == reservation.id

# Test to list the desk reservations by desk.
def test_list_desk_reservations_by_desk(test_session: Session):
    student = User(id=1, pid=123456789, onyen='student', email='student@unc.edu')
    student_entity = UserEntity.from_model(student)
    test_session.add(student_entity)

    desk = Desk(id=1, tag='AA1', desk_type='Computer Desk', included_resource='Pro Display XDR w/ Mac Pro', available=True)
    desk_entity = DeskEntity.from_model(desk)

    test_session.add(desk_entity)

    reservation = DeskReservation(id=1, date=datetime(2023, 4, 17))
    reservation2 = DeskReservation(id=2, date=datetime(2023, 4, 18))
    reservation3 = DeskReservation(id=3, date=datetime(2023, 4, 19))
    reservation_service = ResService(test_session)

    reservation_service.create_desk_reservation(desk, student, reservation)
    reservation_service.create_desk_reservation(desk, student, reservation2)
    reservation_service.create_desk_reservation(desk, student, reservation3)

    desk_reservations = reservation_service.list_reservations_by_desk(desk.id)
    reservation.date = str(reservation.date).split(' ')[0]
    reservation2.date = str(reservation2.date).split(' ')[0]
    reservation3.date = str(reservation3.date).split(' ')[0]
    assert desk_reservations == [reservation, reservation2, reservation3]

# Test that listing desk reservations only returns the reservations for that desk.
def test_reservation_by_desk_multiple_desk(test_session: Session):
    student = User(id=1, pid=123456789, onyen='student', email='student@unc.edu')
    student_entity = UserEntity.from_model(student)
    test_session.add(student_entity)

    desk = Desk(id=1, tag='AA1', desk_type='Computer Desk', included_resource='Pro Display XDR w/ Mac Pro', available=True)
    desk2 = Desk(id=2, tag='CD1', desk_type='Standing Desk', included_resource='Windows Desktop i9', available=True)
    desk_entity = DeskEntity.from_model(desk)
    desk2_entity = DeskEntity.from_model(desk2)

    test_session.add(desk_entity)
    test_session.add(desk2_entity)

    reservation = DeskReservation(id=1, date=datetime(2023, 4, 17))
    reservation2 = DeskReservation(id=2, date=datetime(2023, 4, 18))
    reservation3 = DeskReservation(id=3, date=datetime(2023, 4, 19))
    reservation_service = ResService(test_session)

    reservation_service.create_desk_reservation(desk, student, reservation)
    reservation_service.create_desk_reservation(desk, student, reservation2)
    reservation_service.create_desk_reservation(desk2, student, reservation3)

    
    desk_reservations = reservation_service.list_reservations_by_desk(desk.id)
    reservation.date = str(reservation.date).split(' ')[0]
    reservation2.date = str(reservation2.date).split(' ')[0]
    assert desk_reservations == [reservation, reservation2]
