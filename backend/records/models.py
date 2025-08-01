from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class Record(models.Model):
    """満足度記録モデル"""
    SATISFACTION_CHOICES = [
        (0, '最悪'),
        (1, '悪い'),
        (2, '普通'),
        (3, '良い'),
        (4, '最高'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='records'
    )
    satisfaction_level = models.IntegerField(
        choices=SATISFACTION_CHOICES,
        validators=[MinValueValidator(0), MaxValueValidator(4)]
    )
    memo = models.TextField(blank=True, null=True, max_length=500)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date', '-created_at']
        unique_together = ['user', 'date']
    
    def __str__(self):
        return f"{self.user.email} - {self.date} - Level {self.satisfaction_level}"
    
    def get_satisfaction_display_japanese(self):
        """日本語での満足度表示"""
        return dict(self.SATISFACTION_CHOICES).get(self.satisfaction_level)
