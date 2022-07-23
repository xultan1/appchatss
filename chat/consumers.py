# chat/consumers.py
from email import message
from getpass import getuser
import imp
import json
from urllib import request
from django.contrib.auth import authenticate, login, logout
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from asgiref.sync import async_to_sync
import sys

from django.http import HttpRequest
from django.urls import path
from .models import User,TestMessage3,TestMessage1,RoomTest,SaveMessage

from . import views

def getUser(request):
    return request.user.username

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chats_name = self.scope['url_route']['kwargs']['chats_name']
        # re_path(r'ws/chat/(?P<chats_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
        self.room_group_name = 'chat_%s' % self.chats_name
        self.user = self.scope["user"]
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        


        self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_join',
                'user': "self.user.username",
            }
        )

        

    def user_join(self, event):
        self.send(text_data=json.dumps(event))

    



    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        self.user = self.scope["user"]

        #if str(self.user) != str(message['sender']):
         #   print(self.user)
          #  print(message['sender'])
            #print('not equals')
           # return

        #message = {"sender":str(self.user),"message":message}

        #print({"user":str(self.user),"message":message})



        await self.create_chat(str(self.user),message['message'],message['receiver'])






        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {"sender":str(self.user),"message":message["message"]},
            }
        )





    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
        }))



    @database_sync_to_async
    def create_chat(self, sender,msg,receiver):
        #add the reciver message to the models
        user = User.objects.get(username=sender)
        otherUser = User.objects.get(username=receiver)
        #testM = TestMessage1.objects.get(pk=id)
        m = SaveMessage.objects.create(sender=user,message=msg,receiver=otherUser)
        m.save()



class ChatConsumerAll(AsyncWebsocketConsumer):
    async def connect(self):
        self.all_name = self.scope['url_route']['kwargs']['id']
        self.room_group_name = 'new_%s' % self.all_name
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()


    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        print(message)


        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']


        

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
        }))


class ChatConsumerPublic(AsyncWebsocketConsumer):
    async def connect(self):
        self.all_name = self.scope['url_route']['kwargs']['id']
        #self.room_group_name = 'chat_%s' % self.chats_name
        self.room_group_name = 'public_%s' % self.all_name
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()


    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        self.user = self.scope["user"]

        try:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': {"person":message["person"],"personMessaging":message["personMessaging"],"who":message["who"]},
                }
            )
        except:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': {"person":message["person"]},
                }
            )

    

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        self.user = self.scope["user"]

        try:
            if message["who"] == message["personMessaging"]:
                return
        except:
            print("")




        if message["person"] != str(self.user):
            return



    
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message["personMessaging"],
        }))
