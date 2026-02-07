from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, MeView, oauth_config

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')

urlpatterns = [
    path('me/', MeView.as_view()),
    path('oauth-config/', oauth_config, name='oauth-config'),
    path('', include(router.urls)),
]
