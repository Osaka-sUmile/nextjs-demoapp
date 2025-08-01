from django.contrib import admin
from .models import Record

@admin.register(Record)
class RecordAdmin(admin.ModelAdmin):
    """満足度記録管理画面"""
    list_display = ('user', 'date', 'satisfaction_level', 'get_satisfaction_display_japanese', 'created_at')
    list_filter = ('satisfaction_level', 'date', 'created_at')
    search_fields = ('user__email', 'user__username', 'memo')
    ordering = ('-date', '-created_at')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('基本情報', {
            'fields': ('user', 'date', 'satisfaction_level')
        }),
        ('詳細', {
            'fields': ('memo',)
        }),
        ('タイムスタンプ', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
