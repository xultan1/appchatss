import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"