from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """カスタムユーザー管理画面"""
    list_display = ('email', 'username', 'is_staff', 'is_active', 'created_at')
    list_filter = ('is_staff', 'is_active', 'created_at')
    search_fields = ('email', 'username')
    ordering = ('-created_at',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('追加情報', {'fields': ('created_at', 'updated_at')}),
    )
    readonly_fields = ('created_at', 'updated_at')
