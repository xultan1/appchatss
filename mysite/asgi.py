## mysite/asgi.py
#import os
#
#import django
#
##os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
#
#from django.conf import settings
#
#from channels.auth import AuthMiddlewareStack
#from channels.routing import ProtocolTypeRouter, URLRouter
#from django.core.asgi import get_asgi_application
#from chat import routing
#
#
#
#
#os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
#
#
#
##os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
##settings.configure()
#django.setup()
#
#application = ProtocolTypeRouter({
#  "http": get_asgi_application(),
#  "websocket": AuthMiddlewareStack(
#        URLRouter(
#            routing.websocket_urlpatterns
#        )
#    ),
#})

import os
import django
from channels.routing import get_default_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()
application = get_default_application()