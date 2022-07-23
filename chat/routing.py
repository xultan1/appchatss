# chat/routing.py
from django.urls import re_path

from django.urls import path

from . import consumers

websocket_urlpatterns = [
    #re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/chat/(?P<chats_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/all/new/(?P<id>\w+)/new/$', consumers.ChatConsumerAll.as_asgi()),
    re_path(r'ws/public/(?P<id>\w+)/$', consumers.ChatConsumerPublic.as_asgi()),
]