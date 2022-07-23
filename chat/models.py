from django.db import models
from django.contrib.auth.models import AbstractUser
from django.dispatch import receiver


class User(AbstractUser):
    pass


class TestMessage(models.Model):
    sender = models.ForeignKey(User,on_delete=models.CASCADE,related_name='user')
    receiver = models.ForeignKey(User,on_delete=models.CASCADE,related_name='receiver')


class TestMessage1(models.Model):
    sender = models.ForeignKey(User,on_delete=models.CASCADE,related_name='user1')
    receiver = models.ForeignKey(User,on_delete=models.CASCADE,related_name='receiver1')
    otherSender = models.ForeignKey(User,on_delete=models.CASCADE,related_name='otheruser1')
    otherReceiver = models.ForeignKey(User,on_delete=models.CASCADE,related_name='otherreceiver1')

    def serialize(self):
        return {
            "id": self.id
        }

class TestMessage2(models.Model):
    testMessage1 = models.ForeignKey(TestMessage1,on_delete=models.CASCADE,related_name='test')
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='user2')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

class TestMessage3(models.Model):
    testMessage1 = models.ForeignKey(TestMessage1,on_delete=models.CASCADE,related_name='test1')
    sender = models.ForeignKey(User, on_delete=models.CASCADE,related_name='user3')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE,related_name='user4')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} is sending to {self.receiver}"

class SaveMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE,related_name='user10')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE,related_name='user11')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} is sending to {self.receiver}"


class TestFriends(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='firnd_user')


class TestFriend1(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='_user')
    friend = models.ForeignKey(User, on_delete=models.CASCADE,related_name='friend_user')
    
    def __str__(self):
        return f"{self.user} and friend {self.friend}"

class RoomTest(models.Model):
    name = models.CharField(max_length=128)
    online = models.ManyToManyField(to=User, blank=True)

    def get_online_count(self):
        return self.online.count()

    def join(self, user):
        self.online.add(user)
        self.save()

    def leave(self, user):
        self.online.remove(user)
        self.save()

    def __str__(self):
        return f'{self.name} ({self.get_online_count()})'

class RoomTest1(models.Model):
    name = models.ForeignKey(TestMessage1, on_delete=models.CASCADE,related_name='test_user')
    online = models.ManyToManyField(to=User, blank=True)

    def get_online_count(self):
        return self.online.count()

    def join(self, user):
        self.online.add(user)
        self.save()

    def leave(self, user):
        self.online.remove(user)
        self.save()

    def __str__(self):
        return f'{self.name} ({self.get_online_count()})'