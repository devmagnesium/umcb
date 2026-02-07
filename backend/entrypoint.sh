#!/bin/sh

echo "⏳ Waiting for PostgreSQL..."

while ! nc -z $POSTGRES_HOST 5432; do
  sleep 1
done

echo "✅ PostgreSQL is up!"

echo "📦 Running migrations..."
python manage.py migrate

echo "👤 Creating superuser (if not exists)..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()

if not User.objects.filter(username="admin").exists():
    User.objects.create_superuser(
        username="admin",
        email="admin@admin.com",
        password="admin"
    )
    print("Superuser created")
else:
    print("Superuser already exists")
EOF

echo "🔐 Creating OAuth application (if not exists)..."
python manage.py shell << EOF
from oauth2_provider.models import Application
from django.contrib.auth import get_user_model

User = get_user_model()
admin = User.objects.get(username="admin")

Application.objects.get_or_create(
    name="frontend",
    defaults={
        "user": admin,
        "client_type": Application.CLIENT_PUBLIC,
        "authorization_grant_type": Application.GRANT_PASSWORD,
    }
)
EOF

echo "🚀 Starting server..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000
