"""Sample Resoruce models to use in development environment"""

from ...models import Resource

winDesktop = Resource(id= 1, name='Windows Desktop')
macbook = Resource(id = 2, name='Macbook')
headphone = Resource(id = 3, name='Headphone')

models = [
    winDesktop,
    macbook,
    headphone
]
