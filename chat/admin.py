from django.contrib import admin

from chat.models import User,TestMessage1,TestMessage3,TestFriend1

admin.site.register(User)
admin.site.register(TestMessage1)
admin.site.register(TestMessage3)
admin.site.register(TestFriend1)

# Register your models here.
