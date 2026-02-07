from django.contrib.auth.models import User
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import UserSerializer
from .permissions import IsAdmin

from django.http import JsonResponse
from oauth2_provider.models import Application

def oauth_config(request):
    app = Application.objects.get(name="frontend")

    return JsonResponse({
        "client_id": app.client_id,
        "client_secret": app.client_secret,
        "token_url": "/o/token/",
    })

class UserViewSet(ModelViewSet):
    # permission_classes = [IsAuthenticated, IsAdmin]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    def get_permissions(self):
        if self.action in ['list', 'create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
