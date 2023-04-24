import pytest

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from ...models import User, Desk, DeskReservation, Role, Permission
from ...entities import UserEntity, DeskEntity, DeskReservationEntity, RoleEntity, PermissionEntity
from ...services import DeskService, PermissionService

# Mock Models #
# Desks
desk1 = Desk(id=1, tag='AA1', desk_type='Computer Desk', included_resource='Pro Display XDR w/ Mac Pro', available=True)
desk2 = Desk(id=2, tag='CD1', desk_type='Standing Desk', included_resource='Windows Desktop i9', available=True)

# Root User
root = User(id=1, pid=999999999, onyen='root', email='root@unc.edu')
root_role = Role(id=1, name='root')

@pytest.fixture(autouse=True)
def setup_teardown(test_session: Session):
    # Bootstrap for root User and Role
    root_user_entity = UserEntity.from_model(root)
    test_session.add(root_user_entity)
    root_role_entity = RoleEntity.from_model(root_role)
    root_role_entity.users.append(root_user_entity)
    test_session.add(root_role_entity)
    root_permission_entity = PermissionEntity(
        action='*', resource='*', role=root_role_entity)
    test_session.add(root_permission_entity)

    # Bootstrap for Desks
    desk1_entity = DeskEntity.from_model(desk1)
    desk2_entity = DeskEntity.from_model(desk2)

    test_session.add(desk1_entity)
    test_session.add(desk2_entity)

    test_session.commit()

    yield


# pytest fixture to use for all the tests.
@pytest.fixture()
def permission(test_session: Session):
    return PermissionService(test_session)

@pytest.fixture()
def desk_service(test_session: Session, permission: PermissionService):
    return DeskService(test_session, permission)


# Test listing all desks in the database.
def test_list_all_desks(desk_service: DeskService):
    desk_service._permission.enforce(root, 'admin/', '*')
    desks = desk_service.list_all_desks(root)
    
    assert [desk.tag for desk in desks] == ['AA1', 'CD1']


# Test making the desk unavailable to reserve (for Admin).
def test_make_desk_unavailable(desk_service: DeskService):

    desk_service._permission.enforce(root, 'admin/', '*')

    desk1_unavailable = desk_service.make_desk_unavailable(desk1)
    assert not desk1_unavailable.available


# Test making the desk available to reserve (for Admin).
def test_make_desk_available(desk_service: DeskService):
    
    desk_service._permission.enforce(root, 'admin/', '*')

    desk1_unavailable = desk_service.make_desk_unavailable(desk1)
    assert not desk1_unavailable.available

    desk1_available = desk_service.make_desk_available(desk1)
    assert desk1_available.available == True


# Test to create new desk.
def test_create_desk(desk_service: DeskService):
    desk3 = Desk(id=3, tag='ND1', desk_type='Standing Desk', included_resource='iMac w/ Pro Display', available=True)

    desk_service._permission.enforce(root, 'admin/', '*')

    new_desk = desk_service.create_desk(desk3, root)
    assert new_desk.tag == desk3.tag
    assert new_desk is not None


# Test to remove a desk.
def test_remove_desk(desk_service: DeskService):
    desk_service._permission.enforce(root, 'admin/', '*')

    removed_desk1 = desk_service.remove_desk(desk1, root)
    assert removed_desk1.tag == desk1.tag
    assert removed_desk1 is not None
