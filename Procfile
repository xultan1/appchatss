release: python manage.py migrate
web: daphne mysite.asgi:application --port $PORT --bind 0.0.0.0 -v2
celery:celery -A mysite.celery worker --pool=solo -l info
celerybeat:celery -A mysite beat -l INFO
worker: python manage.py runworker channels --settings=mysite.settings -v2