# デプロイガイド

## 🚀 無料デプロイ手順

### 1. バックエンド（Django）- Railwayにデプロイ

1. **Railwayアカウント作成**
   - [Railway](https://railway.app/)にアクセス
   - GitHubアカウントでサインアップ

2. **新プロジェクト作成**
   - "Deploy from GitHub repo"を選択
   - このリポジトリを選択
   - Root directoryを`backend`に設定

3. **環境変数設定**
   ```
   SECRET_KEY=your-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-app-name.railway.app
   PRODUCTION_FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

4. **PostgreSQLデータベース追加**
   - "Add service" > "Database" > "PostgreSQL"
   - 自動的にDATABASE_URLが設定されます

5. **初期デプロイ後の設定**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

### 2. フロントエンド（Next.js）- Vercelにデプロイ

1. **Vercelアカウント作成**
   - [Vercel](https://vercel.com/)にアクセス
   - GitHubアカウントでサインアップ

2. **新プロジェクト作成**
   - "Import Project"を選択
   - このリポジトリを選択
   - Root directoryを`nextjs-demoapp`に設定

3. **環境変数設定**
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-name.railway.app/api
   ```

4. **デプロイ実行**
   - 自動的にビルド・デプロイが開始されます

## 🔧 設定ファイル一覧

### バックエンド
- `Procfile` - Railway/Heroku用プロセス定義
- `runtime.txt` - Pythonバージョン指定
- `requirements.txt` - Python依存関係（更新済み）
- `settings.py` - 本番用設定追加

### フロントエンド
- `vercel.json` - Vercel設定

## 💰 コスト

### Railway（バックエンド）
- **無料枠**: $5/月クレジット
- **目安**: 約500時間稼働可能
- **PostgreSQL**: 無料プランに含まれる

### Vercel（フロントエンド）
- **無料枠**: 100GB帯域幅/月
- **制限**: 商用利用はPro プラン推奨

## 🔍 代替オプション

### バックエンド代替
1. **Render** - 無料750時間/月
2. **PythonAnywhere** - 無料プラン（制限あり）
3. **Heroku** - 有料のみ（$7/月〜）

### フロントエンド代替
1. **Netlify** - 無料100GB/月
2. **GitHub Pages** - 静的サイト限定

## ⚠️ 注意事項

1. **データベース**: SQLiteから PostgreSQLに変更
2. **CORS設定**: 本番URLを環境変数で設定
3. **静的ファイル**: WhiteNoise使用
4. **セキュリティ**: SECRET_KEYは必ず変更

## 🛠️ トラブルシューティング

### よくある問題
1. **CORS エラー**: PRODUCTION_FRONTEND_URL設定確認
2. **データベース接続エラー**: DATABASE_URL確認
3. **静的ファイル404**: collectstaticコマンド実行

### デバッグコマンド
```bash
# Railway CLI（バックエンド）
railway logs

# Vercel CLI（フロントエンド）
vercel logs
```
