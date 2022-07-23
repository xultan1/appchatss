from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from . import views

from .views import Friends,Chats,History,Personal

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login_view, name='login'),
    path('register', views.register, name='register'),
    path('logout', views.logout_view, name='logout'),
    path('people/ac', views.people, name='people'),
    path('test/<str:name>/', views.test, name='test'),
    #path('<str:chats_name>/', views.chats, name='chats'),
    #path('chats1/<str:chats_name>/', views.chats, name='chats1'),
    path('add/friend/<str:name>/', views.first_friend, name='addFriend'),
    #path('<str:room_name>/', views.room, name='room'),

    #Api
    path("friends/ac", Friends.as_view(), name="friends"),
    path('chats/<str:name>/', Chats.as_view(), name="chats"),
    path('chats/person/<str:name>/', Personal.as_view(), name="personal"),
    path('chats/add/other/friend/', views.add_friend_other, name="otherFriend"),
    path('history/<str:other>/', History.as_view(), name="history"),
    path('loggedUser', views.logged_in_user, name="loggedUser"),

]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
