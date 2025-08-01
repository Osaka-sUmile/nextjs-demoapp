from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

User = get_user_model()

class Command(BaseCommand):
    help = 'Create superuser if it does not exist'

    def handle(self, *args, **options):
        if not User.objects.filter(is_superuser=True).exists():
            # 環境変数から取得、なければデフォルト値を使用
            username = os.environ.get('SUPERUSER_USERNAME', 'admin')
            email = os.environ.get('SUPERUSER_EMAIL', 'admin@example.com')
            password = os.environ.get('SUPERUSER_PASSWORD', 'admin123')
            
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created superuser: {username}')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Superuser already exists')
            )
