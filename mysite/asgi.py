# mysite/asgi.py
import os

import django

#os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

from django.conf import settings

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from .chat import routing



os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

#os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
#settings.configure()
django.setup()

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": AuthMiddlewareStack(
        URLRouter(
            routing.websocket_urlpatterns
        )
    ),
})