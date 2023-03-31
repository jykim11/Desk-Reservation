"""Sample Desk models to use in development environment"""

from ...models import Desk

a1 = Desk(id=1, name='A1', available=True)
a2 = Desk(id=2, name='A2', available=True)
b1 = Desk(id=3, name='B1', available=True)
b2 = Desk(id=4, name='B2', available=False)

models = [
    a1,
    a2,
    b1,
    b2
]