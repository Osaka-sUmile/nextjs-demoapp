from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import login, logout
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """ユーザー登録API"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)
        user_serializer = UserSerializer(user)
        return Response({
            'user': user_serializer.data,
            'message': 'ユーザー登録が完了しました'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """ユーザーログインAPI"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        user_serializer = UserSerializer(user)
        return Response({
            'user': user_serializer.data,
            'message': 'ログインしました'
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """ユーザーログアウトAPI"""
    logout(request)
    return Response({
        'message': 'ログアウトしました'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """ユーザープロフィール取得API"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def check_auth_view(request):
    """認証状態確認API"""
    if request.user.is_authenticated:
        serializer = UserSerializer(request.user)
        return Response({
            'isAuthenticated': True,
            'user': serializer.data
        }, status=status.HTTP_200_OK)
    return Response({
        'isAuthenticated': False,
        'user': None
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def csrf_token_view(request):
    """CSRFトークン取得API"""
    return Response({'detail': 'CSRF cookie set'}, status=status.HTTP_200_OK)
