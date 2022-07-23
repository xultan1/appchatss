from email import message
from multiprocessing import context
from this import s
from unicodedata import name
from django.dispatch import receiver
from django.shortcuts import render

from urllib import request, response
from django.shortcuts import render
#from rest_framework import serializers
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required
import json
from django.http import Http404

from django.db.models import Q

from chat.serializers import Persons,PersonsChat,ChatHistory,Friend

from django.http import JsonResponse


from rest_framework.response import Response
from rest_framework.views import APIView

from .models import TestMessage3, User, TestMessage1,TestMessage2,TestFriend1,SaveMessage


def index(request):
    if not request.user.is_anonymous:
        return render(request, 'chat/design.html',{
            'loggedInUser':request.user
        })
    
    return render(request, 'chat/login.html')


def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name': room_name
    })



def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "chat/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "chat/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("people"))
    else:
        return render(request, "chat/register.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "chat/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "chat/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))


def people(request):
    #persons = User.objects.all()

    persons = User.objects.exclude(username=request.user)

    return render(request, "chat/users.html",{
        'persons':persons
    })


def test(request,name):
    return render(request, "chat/design.html")


@login_required
def chats(request, chats_name):
    persons = User.objects.get(username=chats_name)
    sender = User.objects.get(username=request.user)

    userLoggedIn = request.user.username

    if TestMessage1.objects.filter(sender=sender,receiver=persons).exists() or TestMessage1.objects.filter(otherSender=sender,otherReceiver=persons).exists():
       # person = TestMessage.objects.get(sender=sender,receiver=persons)
        try:
           person = TestMessage1.objects.get(sender=sender,receiver=persons) 
           
        except:
           person = TestMessage1.objects.get(otherSender=sender,otherReceiver=persons)

        t = TestMessage2.objects.filter(testMessage1=person)

        return HttpResponseRedirect(reverse("index"))
        
        return render(request, 'chat/design.html', {
            'user':userLoggedIn,
            'chats_name': person,
            'other':chats_name,
            't':t
        })
    
    person = TestMessage1.objects.create(sender=sender,receiver=persons,otherSender=persons,otherReceiver=sender)
    person.save()
    friend = TestFriend1.objects.create(user=sender,friend=persons)
    #person = TestMessage.objects.get(id=13) 
    #person = TestMessage.objects.get(sender=persons,receiver=sender)
    #person = TestMessage.objects.get(id=person.id)
    return HttpResponseRedirect(reverse("index"))
    return render(request, 'chat/design.html', {
        'user':userLoggedIn,
        'chats_name': person,
        'other':chats_name
    })

class Friends(APIView):
    def get(self,request):
        try:
            #Q(sender=user,receiver=otherUser) | Q(sender=otherUser,receiver=user)
            #User.objects.exclude(Q(username=request.user) | Q(username='xultan'))
            user = User.objects.get(username=request.user.username)
            persons = TestFriend1.objects.filter(user=user)
            serializer = Friend(persons,many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            raise Http404



def logged_in_user(request):
    user = User.objects.get(username=request.user)
    user = user.username
    return JsonResponse({"username":user})



class Chats(APIView):
    def get(self,request,name):
        try:
            persons = User.objects.get(username=name)
            sender = User.objects.get(username=request.user)
            if TestMessage1.objects.filter(sender=sender,receiver=persons).exists() or TestMessage1.objects.filter(otherSender=sender,otherReceiver=persons).exists():
                try:
                    person = TestMessage1.objects.get(sender=sender,receiver=persons) 
                except:
                    person = TestMessage1.objects.get(otherSender=sender,otherReceiver=persons)
            p = {}
            p.update(person.serialize())
            p.update({'user':request.user.username})


            #x = [person.serialize()]
            return JsonResponse(p, safe=False)
            #serializer = PersonsChat(person,context={'ss':"ss"})
            #return Response(serializer.data)
            if serializer.is_valid():
                return Response(serializer.data)
            else:
                return Response(serializer.errors,status=400)
        except User.DoesNotExist:
            raise Http404




class History(APIView):
    def get(self,request,other):
        try:
            user = User.objects.get(username=request.user)
            otherUser = User.objects.get(username=other)
            message1 = Q(sender=user,receiver=otherUser)
            message2 = Q(sender=otherUser,receiver=user)
            message = SaveMessage.objects.filter(Q(sender=user,receiver=otherUser) | Q(sender=otherUser,receiver=user))
            message = message.order_by("timestamp").all()
            serializer = ChatHistory(message,many=True)
            return Response(serializer.data)
        except User.DoesNotExist:
            raise Http404

class Personal(APIView):
    def get(self,request,name):
        try:
            person = User.objects.get(username=name)
            serializer = Persons(person)
            return Response(serializer.data)
        except person.DoesNotExist:
            raise Http404


def first_friend(request,name):
    user1 = User.objects.get(username=request.user)
    friend = User.objects.get(username=name)
    if not TestFriend1.objects.filter(user=user1,friend=friend).exists():
        new = TestFriend1.objects.create(user = user1 , friend = friend)
        new.save()

    persons = User.objects.get(username=name)
    sender = User.objects.get(username=request.user)

    if TestMessage1.objects.filter(sender=sender,receiver=persons).exists() or TestMessage1.objects.filter(otherSender=sender,otherReceiver=persons).exists():
        try:
           person = TestMessage1.objects.get(sender=sender,receiver=persons) 
           
        except:
           person = TestMessage1.objects.get(otherSender=sender,otherReceiver=persons)

        t = TestMessage2.objects.filter(testMessage1=person)

        return HttpResponseRedirect(reverse("index"))
            
    person = TestMessage1.objects.create(sender=sender,receiver=persons,otherSender=persons,otherReceiver=sender)
    person.save()
    return HttpResponseRedirect(reverse("index"))



def add_friend_other(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)


    data = json.loads(request.body)
    user = data.get("user", "")
    friend = data.get("friend", "")
    if user == "" or friend == "":
        return JsonResponse({
            "error": "Cannot be empty"
        }, status=400)
    user1 = User.objects.get(username=user)
    friend = User.objects.get(username=friend)

    if TestFriend1.objects.filter(user=user1,friend=friend).exists():
        return JsonResponse({"message": "successful."}, status=201)

    
    



    new = TestFriend1.objects.create(user = user1 , friend = friend)
    new.save()

    return JsonResponse({"message": "successful."}, status=201)