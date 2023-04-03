import pytest

from sqlalchemy.orm import Session
from ...models import User, Role, Permission
from ...entities import UserEntity, RoleEntity, PermissionEntity
from ...services import ResService


@pytest.fixture(autouse=True)
def test_listdesk():
    with pytest.raises(Exception):
        ResService.listdesk()
    assert (len(ResService) == 4)



@pytest.fixture(autouse=True)
def test_notempty_listdesk():
    with pytest.raises(Exception):
        ResService.listdesk()
    assert (len(ResService) != 0)


