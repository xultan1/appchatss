from urllib import request
from attr import fields
from django.dispatch import receiver
from rest_framework import serializers
from .models import User ,TestMessage1,TestMessage3,TestFriend1

class Persons(serializers.ModelSerializer):
    #username = serializers.CharField(source='user.username',read_only=True)

    class Meta:
        model = User
        fields = (
            'id','username'
        )

class PersonsChat(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username',read_only=True)

    Available = serializers.SerializerMethodField()

    class Meta:
        model = TestMessage1
        fields = (
            'id','username','Available'
        )

    def get_Available(self, obj):
        # here write the logic to compute the value based on object
        return 1

class ChatHistory(serializers.ModelSerializer):
    sender = serializers.CharField(source='sender.username',read_only=True)
    receiver = serializers.CharField(source='receiver.username',read_only=True)

    class Meta:
        model = TestMessage3
        fields = (
            'id','sender','receiver','message','timestamp'
        )

class Friend(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username',read_only=True)
    friend = serializers.CharField(source='friend.username',read_only=True)
    class Meta:
        model = TestFriend1
        fields = (
            'id','username','friend'
        )

#working progress
class SaveFriend(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username',read_only=True)
    friend = serializers.CharField(source='friend.username',read_only=True)

    class Meta:
        model = TestFriend1
        fields = (
            'id',
        )