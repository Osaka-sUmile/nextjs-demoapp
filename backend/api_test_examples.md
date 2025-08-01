# 満足度記録アプリ API テスト例

## 1. ユーザー登録
POST http://localhost:8000/api/auth/register/
Content-Type: application/json

{
  "email": "test@example.com",
  "username": "testuser",
  "password": "testpass123",
  "password_confirm": "testpass123"
}

## 2. ログイン
POST http://localhost:8000/api/auth/login/
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "testpass123"
}

## 3. 認証状態確認
GET http://localhost:8000/api/auth/check-auth/

## 4. プロフィール取得
GET http://localhost:8000/api/auth/profile/

## 5. 記録作成
POST http://localhost:8000/api/records/
Content-Type: application/json

{
  "satisfaction_level": 5,
  "memo": "今日は良い一日でした",
  "date": "2025-07-31"
}

## 6. 記録一覧取得
GET http://localhost:8000/api/records/

## 7. ホーム統計取得
GET http://localhost:8000/api/records/home-stats/

## 8. ランキング取得
GET http://localhost:8000/api/records/ranking/

## 9. 記録更新
PUT http://localhost:8000/api/records/1/
Content-Type: application/json

{
  "satisfaction_level": 6,
  "memo": "更新されたメモ",
  "date": "2025-07-31"
}

## 10. 記録削除
DELETE http://localhost:8000/api/records/1/

## 11. ログアウト
POST http://localhost:8000/api/auth/logout/
