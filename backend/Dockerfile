FROM python:3.9-slim

# 作業ディレクトリを設定
WORKDIR /app

# システムの依存関係をインストール
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Pythonの依存関係をインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションのコードをコピー
COPY . .

# データベースのマイグレーションを実行
RUN python manage.py migrate

# デフォルトのスーパーユーザーを作成
RUN python manage.py create_default_superuser

# 静的ファイルを収集
RUN python manage.py collectstatic --noinput

# ポートを公開
EXPOSE 8000

# アプリケーションを起動
CMD ["gunicorn", "satisfaction_backend.wsgi", "--bind", "0.0.0.0:8000", "--log-file", "-"]
