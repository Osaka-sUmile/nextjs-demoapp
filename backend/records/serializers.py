from rest_framework import serializers
from .models import Record

class RecordSerializer(serializers.ModelSerializer):
    """満足度記録用シリアライザー"""
    satisfaction_display = serializers.CharField(source='get_satisfaction_display_japanese', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Record
        fields = (
            'id', 'satisfaction_level', 'satisfaction_display', 
            'memo', 'date', 'created_at', 'updated_at', 'user_email'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'user_email')
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class RecordCreateUpdateSerializer(serializers.ModelSerializer):
    """記録作成・更新用シリアライザー"""
    class Meta:
        model = Record
        fields = ('satisfaction_level', 'memo', 'date')
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class RecordStatsSerializer(serializers.Serializer):
    """統計情報用シリアライザー"""
    total_records = serializers.IntegerField()
    average_satisfaction = serializers.FloatField()
    monthly_average = serializers.DictField()
    weekly_trend = serializers.ListField()
    satisfaction_distribution = serializers.DictField()
