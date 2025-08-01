# 満足度記録アプリ (Satisfaction Tracking App)

日々の活動に対する満足度を記録し、振り返ることで自己評価と行動改善を促進するWebアプリケーションです。

## 技術スタック

- **フロントエンド**: Next.js 15 (TypeScript)
- **バックエンド**: Django 4.2.23 + Django REST Framework
- **データベース**: SQLite (開発用)
- **スタイリング**: Tailwind CSS
- **アイコン**: Lucide React
- **認証**: セッションベース認証

## 主な機能

### ユーザー管理
- ユーザー登録・ログイン・ログアウト
- JWT認証によるセキュアな認証システム

### 満足度記録機能
- 日次の満足度記録作成（0-5の6段階評価）
- 「できたこと」「できなかったこと」のテキスト記録
- 記録の閲覧・編集・削除

### データ分析・表示機能
- ユーザーの平均満足度に基づく視覚的フィードバック
- 昨日の満足度と連続記録日数の表示
- 全ユーザーランキング（満足度累計）

## 画面構成

1. **ホーム画面**: 平均満足度に応じた画像表示、統計情報
2. **記録一覧画面**: 過去の記録をリスト表示
3. **記録詳細画面**: 特定の記録の詳細表示・編集
4. **記録画面**: 新しい満足度記録の作成
5. **ランキング画面**: 全ユーザーの満足度ランキング

## 開発環境のセットアップ

### フロントエンド

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3001](http://localhost:3001) を開いてアプリケーションを確認できます。

### バックエンド

```bash
# バックエンドディレクトリに移動
cd backend

# 仮想環境のアクティベート（macOS/Linux）
source venv/bin/activate

# 依存関係のインストール
pip install -r requirements.txt

# データベースマイグレーション
python manage.py migrate

# 開発サーバーの起動
python manage.py runserver 8000
```

バックエンドサーバーは [http://localhost:8000](http://localhost:8000) で起動します。

## 環境変数

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## プロジェクト構造

```
.
├── backend/            # Django バックエンド
│   ├── satisfaction_backend/  # プロジェクト設定
│   ├── users/         # ユーザー管理アプリ
│   ├── records/       # 記録管理アプリ
│   ├── manage.py      # Django管理コマンド
│   ├── requirements.txt # Python依存関係
│   └── README.md      # バックエンド詳細説明
├── src/               # Next.js フロントエンド
│   ├── app/          # Next.js App Router
│   │   ├── auth/     # 認証関連ページ
│   │   ├── records/  # 記録関連ページ
│   │   ├── ranking/  # ランキングページ
│   │   └── layout.tsx # ルートレイアウト
│   ├── components/   # 再利用可能なコンポーネント
│   │   ├── ui/      # 基本UIコンポーネント
│   │   ├── layout/  # レイアウトコンポーネント
│   │   └── features/ # 機能別コンポーネント
│   ├── lib/         # ユーティリティ関数
│   ├── types/       # TypeScript型定義
│   └── styles/      # グローバルスタイル
└── README.md        # プロジェクト全体説明
```

## デザインシステム

- **基調色**: オレンジ系（モチベーション向上）
- **アクセントカラー**: 高視認性を考慮した調和カラー
- **レスポンシブデザイン**: モバイルファーストアプローチ

## API連携

DjangoバックエンドAPIとの連携により以下の機能を提供：

- **認証API** (`/api/auth/`)
  - ユーザー登録・ログイン・ログアウト
  - プロフィール取得・認証状態確認
- **記録API** (`/api/records/`)
  - 記録の作成・取得・更新・削除
  - ホーム画面統計データ取得
  - ランキングデータ取得

詳細なAPI仕様は `backend/api_test_examples.md` を参照してください。

## 今後の拡張予定

- グラフ表示機能
- リマインダー機能
- データエクスポート機能
- プッシュ通知
