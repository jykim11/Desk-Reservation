from sqlalchemy import Table, Column, ForeignKey
from .entity_base import EntityBase

desk_resource_table = Table(
    "desk_desk_resource",
    EntityBase.metadata,
    Column('desk_id', ForeignKey('desk.id'), primary_key=True),
    Column('resource_id', ForeignKey('resource.id'), primary_key=True)
)