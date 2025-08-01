# 満足度記録アプリ開発ガイド

## プロジェクト構成

```
src/
├── app/                     # Next.js App Router
│   ├── auth/               # 認証関連ページ
│   │   ├── login/          # ログインページ
│   │   └── register/       # ユーザー登録ページ
│   ├── records/            # 記録関連ページ
│   │   ├── [id]/          # 記録詳細・編集ページ
│   │   ├── new/           # 新規記録作成ページ
│   │   └── page.tsx       # 記録一覧ページ
│   ├── ranking/           # ランキングページ
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx          # ホームページ
│   └── globals.css       # グローバルスタイル
├── components/            # 再利用可能なコンポーネント
│   ├── ui/               # 基本UIコンポーネント
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── textarea.tsx
│   ├── layout/           # レイアウトコンポーネント
│   │   ├── footer-navigation.tsx
│   │   └── page-header.tsx
│   └── features/         # 機能別コンポーネント
│       ├── satisfaction-selector.tsx
│       └── satisfaction-display.tsx
├── lib/                  # ユーティリティ関数
│   ├── api.ts           # API関連
│   └── utils.ts         # 汎用ユーティリティ
└── types/               # TypeScript型定義
    └── index.ts
```

## 実装済み機能

### 🔐 認証システム
- ユーザー登録（/auth/register）
- ログイン（/auth/login）
- ログアウト機能
- JWT認証によるセキュアな認証

### 📝 満足度記録機能
- 新規記録作成（/records/new）
- 記録一覧表示（/records）
- 記録詳細表示（/records/[id]）
- 記録編集（/records/[id]/edit）
- 記録削除
- 満足度レベル選択（0-5の6段階）

### 🏠 ホーム画面機能
- 平均満足度に基づく画像表示
- 昨日の満足度表示
- 連続記録日数表示
- 満足度レベル説明

### 🏆 ランキング機能
- 全ユーザーランキング（/ranking）
- 総満足度ポイントによる順位表示
- 上位5位の表示

### 🎨 UIデザイン
- オレンジ基調のカラーテーマ
- レスポンシブデザイン
- フッターナビゲーション
- 直感的なユーザーインターフェース

## 技術スタック

- **フロントエンド**: Next.js 15 + TypeScript
- **スタイリング**: Tailwind CSS
- **アイコン**: Lucide React
- **状態管理**: React Hooks
- **認証**: JWT（ローカルストレージ）

## 開発環境セットアップ

1. **依存関係のインストール**
   ```bash
   npm install
   ```

2. **環境変数の設定**
   `.env.local`ファイルを作成し、DjangoバックエンドのURLを設定：
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   ```

3. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

4. **満足度画像の準備**
   `public/images/`ディレクトリに以下の画像ファイルを配置：
   - fig0.jpg（満足度0）
   - fig1.jpg（満足度1）
   - fig2.jpg（満足度2）
   - fig3.jpg（満足度3）
   - fig4.jpg（満足度4）
   - fig5.jpg（満足度5）

## APIエンドポイント

フロントエンドは以下のDjango REST APIエンドポイントと連携：

- `POST /api/v1/users/register/` - ユーザー登録
- `POST /api/v1/users/login/` - ログイン
- `GET /api/v1/records/` - 記録一覧取得
- `GET /api/v1/records/{id}/` - 記録詳細取得
- `POST /api/v1/records/` - 記録作成
- `PUT /api/v1/records/{id}/` - 記録更新
- `DELETE /api/v1/records/{id}/` - 記録削除
- `GET /api/v1/home-data/` - ホーム画面データ取得
- `GET /api/v1/ranking/` - ランキングデータ取得

## デモモード

バックエンドAPIが利用できない場合、フロントエンドはデモ用のダミーデータを表示します。これにより、バックエンドの開発と並行してフロントエンドの動作確認が可能です。

## 今後の拡張予定

- [ ] グラフ表示機能
- [ ] リマインダー機能
- [ ] データエクスポート機能
- [ ] プッシュ通知
- [ ] ダークモード対応
- [ ] PWA対応
- [ ] ユーザープロフィール機能

## デプロイメント

### Vercelでのデプロイ
1. GitHubリポジトリをVercelに接続
2. 環境変数`NEXT_PUBLIC_API_BASE_URL`を本番APIのURLに設定
3. 自動デプロイの設定

### その他のクラウドサービス
- Netlify
- AWS Amplify
- Google Cloud Platform

## トラブルシューティング

### よくある問題

1. **画像が表示されない**
   - `public/images/`ディレクトリに適切な画像ファイルが配置されているか確認
   - ファイル名が`fig0.jpg`から`fig5.jpg`の形式になっているか確認

2. **API接続エラー**
   - `.env.local`ファイルの`NEXT_PUBLIC_API_BASE_URL`が正しく設定されているか確認
   - Djangoバックエンドが起動しているか確認
   - CORS設定が適切に行われているか確認

3. **認証エラー**
   - ローカルストレージのトークンが有効か確認
   - トークンの有効期限が切れていないか確認

## 開発のベストプラクティス

1. **コンポーネント設計**
   - 単一責任の原則に従う
   - 再利用可能なコンポーネントの作成
   - プロップの型定義を明確にする

2. **エラーハンドリング**
   - 適切なエラーメッセージの表示
   - ユーザーフレンドリーなエラー処理
   - デモデータでのフォールバック

3. **パフォーマンス**
   - 適切な画像最適化
   - 必要な場合のみAPIコールを実行
   - ローディング状態の適切な表示

4. **アクセシビリティ**
   - セマンティックなHTML構造
   - キーボードナビゲーション対応
   - 適切なARIAラベル
