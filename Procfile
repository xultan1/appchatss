release: python manage.py migrate
web: daphne mysite.asgi:application --port $PORT --bind 0.0.0.0 -v2
celery:celery -A mysite.celery worker --pool=solo -l info
celerybeat:celery -A mysite beat -l INFO
celeryworker2: celery -A mysite.celery worker & celery -A mysite -l INFO & wait -n
heroku config:set DJANGO_SETTINGS_MODULE=mysite.settings --account <xultanjj@gmail.com> 
