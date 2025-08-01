# 満足度記録アプリ - Django Backend

このディレクトリには、満足度記録アプリのDjangoバックエンドAPIが含まれています。

## 技術スタック

- **Django 4.2.23** - Webフレームワーク
- **Django REST Framework** - REST API構築
- **SQLite** - データベース（開発用）
- **django-cors-headers** - CORS設定
- **python-decouple** - 環境変数管理

## プロジェクト構造

```
backend/
├── satisfaction_backend/   # プロジェクト設定
│   ├── settings.py        # Django設定
│   ├── urls.py           # メインURL設定
│   └── wsgi.py           # WSGI設定
├── users/                # ユーザー管理アプリ
│   ├── models.py         # カスタムユーザーモデル
│   ├── serializers.py    # ユーザー関連シリアライザー
│   ├── views.py          # 認証関連API
│   └── urls.py           # ユーザー関連URL
├── records/              # 記録管理アプリ
│   ├── models.py         # 記録モデル
│   ├── serializers.py    # 記録関連シリアライザー
│   ├── views.py          # 記録関連API
│   └── urls.py           # 記録関連URL
├── manage.py             # Django管理コマンド
├── requirements.txt      # Python依存関係
├── .env                  # 環境変数
└── db.sqlite3           # SQLiteデータベース
```

## セットアップ手順

### 1. 仮想環境の作成（既に作成済み）

```bash
python3 -m venv venv
```

### 2. 仮想環境のアクティベート

```bash
# macOS/Linux
source venv/bin/activate

# Windows
venv\\Scripts\\activate
```

### 3. 依存関係のインストール

```bash
pip install -r requirements.txt
```

### 4. データベースマイグレーション

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. スーパーユーザーの作成（オプション）

```bash
python manage.py createsuperuser
```

### 6. 開発サーバーの起動

```bash
python manage.py runserver 8000
```

## API エンドポイント

### 認証関連（/api/auth/）

- `POST /api/auth/register/` - ユーザー登録
- `POST /api/auth/login/` - ログイン
- `POST /api/auth/logout/` - ログアウト
- `GET /api/auth/profile/` - プロフィール取得
- `GET /api/auth/check-auth/` - 認証状態確認

### 記録関連（/api/records/）

- `GET /api/records/` - 記録一覧取得
- `POST /api/records/` - 記録作成
- `GET /api/records/{id}/` - 記録詳細取得
- `PUT /api/records/{id}/` - 記録更新
- `DELETE /api/records/{id}/` - 記録削除
- `GET /api/records/home-stats/` - ホーム統計
- `GET /api/records/ranking/` - ランキング統計

## データモデル

### User モデル
- Django標準のAbstractUserを拡張
- メールアドレスでのログイン
- 作成日時、更新日時の自動管理

### Record モデル
- 満足度レベル（1-7）
- メモ（オプション）
- 記録日付
- ユーザーとの関連付け
- 一意制約（ユーザー × 日付）

## 環境変数

`.env`ファイルで以下の環境変数を設定：

```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///db.sqlite3
FRONTEND_URL=http://localhost:3001
```

## 開発・デバッグ

### 管理画面
- URL: http://localhost:8000/admin/
- スーパーユーザーでログイン可能

### API テスト
- REST APIは http://localhost:8000/api/ でアクセス可能
- Postman、curl、またはフロントエンドから動作確認

### ログ確認
- Djangoの開発サーバーで詳細なログを確認可能
- SQLクエリログも出力される

## フロントエンドとの連携

フロントエンド（Next.js）は以下の設定でAPIと通信：
- ベースURL: `http://localhost:8000/api`
- CORS設定により、localhost:3001からのアクセスを許可
- セッションベース認証を使用

## 本番環境への展開

1. 環境変数の設定（SECRET_KEY、DEBUG=False等）
2. 本番用データベースの設定
3. ALLOWED_HOSTSの設定
4. 静的ファイルの設定
5. CORS設定の調整
