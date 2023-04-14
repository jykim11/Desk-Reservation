"""Sample reservation data. Subject to change as the reservation model changes."""

from ...models import DeskReservation
from datetime import datetime
from . import desks, users

mar12_1200a1 = DeskReservation(id=1, date=datetime(2023, 3, 12, 12, 00))
mar12_1200a2 = DeskReservation(id=2, date=datetime(2023, 3, 12, 12, 00))
mar15_1350a2 = DeskReservation(id=3, date=datetime(2023, 3, 15, 13, 50))

models = [
    mar12_1200a1,
    mar12_1200a2,
    mar15_1350a2
]

pairs = [
    (mar12_1200a1, desks.a1, users.sol_student),
    (mar12_1200a2, desks.a2, users.sally_student),
    (mar15_1350a2, desks.a2, users.sol_student)
]
