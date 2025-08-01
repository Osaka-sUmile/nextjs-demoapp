from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    """ユーザー登録用シリアライザー"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password_confirm')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("パスワードが一致しません")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    """ユーザーログイン用シリアライザー"""
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError("メールアドレスまたはパスワードが正しくありません")
            if not user.is_active:
                raise serializers.ValidationError("このアカウントは無効です")
            attrs['user'] = user
        else:
            raise serializers.ValidationError("メールアドレスとパスワードを入力してください")
        
        return attrs

class UserSerializer(serializers.ModelSerializer):
    """ユーザー情報用シリアライザー"""
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'created_at')
