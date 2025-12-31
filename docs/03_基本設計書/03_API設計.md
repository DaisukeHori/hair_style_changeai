# 第3章 API設計

## 3.1 API設計方針

### 3.1.1 設計原則

| 原則 | 説明 |
|------|------|
| RESTful | リソース指向のURL設計 |
| JSON | リクエスト/レスポンスはJSON形式 |
| ステートレス | セッション情報はJWTで管理 |
| バージョニング | URLにバージョンを含めない（Supabase管理） |
| エラーハンドリング | 統一されたエラーレスポンス形式 |

### 3.1.2 API構成

```
API構成図
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────┐
│                    Supabase APIs                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   PostgREST     │  │   Auth API      │                  │
│  │  (自動生成REST) │  │  (認証)         │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  Storage API    │  │  Realtime       │                  │
│  │  (ファイル)     │  │  (WebSocket)    │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                Edge Functions                        │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐         │   │
│  │  │ pinterest │ │ simulate  │ │ analytics │ ...     │   │
│  │  └───────────┘ └───────────┘ └───────────┘         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3.2 PostgREST API（自動生成）

### 3.2.1 エンドポイント一覧

| リソース | メソッド | エンドポイント | 説明 |
|---------|---------|---------------|------|
| 顧客 | GET | /rest/v1/customers | 顧客一覧取得 |
| 顧客 | GET | /rest/v1/customers?id=eq.{id} | 顧客詳細取得 |
| 顧客 | POST | /rest/v1/customers | 顧客登録 |
| 顧客 | PATCH | /rest/v1/customers?id=eq.{id} | 顧客更新 |
| 顧客 | DELETE | /rest/v1/customers?id=eq.{id} | 顧客削除 |
| スタイル | GET | /rest/v1/hair_styles | スタイル一覧 |
| 施術記録 | GET | /rest/v1/visits | 施術記録一覧 |
| 予約 | GET | /rest/v1/appointments | 予約一覧 |

### 3.2.2 クエリパラメータ

```
PostgREST クエリパラメータ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【フィルタリング】
?column=eq.value        # 等価
?column=neq.value       # 不等価
?column=gt.value        # より大きい
?column=gte.value       # 以上
?column=lt.value        # より小さい
?column=lte.value       # 以下
?column=like.*pattern*  # LIKE検索
?column=ilike.*pattern* # ILIKE検索（大文字小文字無視）
?column=in.(a,b,c)      # IN句
?column=is.null         # NULL判定

【ソート】
?order=column.asc       # 昇順
?order=column.desc      # 降順
?order=col1.desc,col2   # 複数カラム

【ページネーション】
?limit=20               # 取得件数
?offset=40              # オフセット

【リレーション】
?select=*,stylists(*)   # JOINして取得
?select=id,name,visits(id,visit_date)  # 特定カラムのみ
```

### 3.2.3 リクエスト/レスポンス例

**顧客検索**:
```http
GET /rest/v1/customers
    ?salon_id=eq.{salon_id}
    &or=(last_name_kana.ilike.*ヤマダ*,first_name_kana.ilike.*ヤマダ*,phone.ilike.*090*)
    &order=last_visit_date.desc
    &limit=20
    &select=id,first_name,last_name,phone,last_visit_date,visit_count

Authorization: Bearer {jwt_token}
```

**レスポンス**:
```json
[
  {
    "id": "uuid-1",
    "first_name": "花子",
    "last_name": "山田",
    "phone": "090-1234-5678",
    "last_visit_date": "2024-01-10",
    "visit_count": 15
  },
  ...
]
```

**顧客詳細（リレーション含む）**:
```http
GET /rest/v1/customers
    ?id=eq.{customer_id}
    &select=*,
            customer_hair_profiles(*),
            visits(id,visit_date,status,stylists(name),visit_services(*)),
            style_simulations(id,simulated_photo_url,hair_styles(title))
```

---

## 3.3 Edge Functions API

### 3.3.1 Pinterest連携

**スタイル検索**:
```
POST /functions/v1/pinterest-search
```

```typescript
// Request
{
  "query": "韓国風 ミディアム ヘアスタイル",
  "page_size": 25,
  "bookmark": null
}

// Response
{
  "items": [
    {
      "pin_id": "123456",
      "title": "韓国風レイヤーカット",
      "image_url": "https://...",
      "source_url": "https://pinterest.com/pin/..."
    }
  ],
  "bookmark": "next_page_token",
  "has_more": true
}
```

**画像取り込み**:
```
POST /functions/v1/pinterest-import
```

```typescript
// Request
{
  "pin_id": "123456",
  "metadata": {
    "title": "韓国風レイヤーカット",
    "tags": ["韓国風", "ミディアム", "レイヤー"],
    "hair_length": "medium",
    "gender_target": "female"
  }
}

// Response
{
  "id": "hair_style_uuid",
  "image_url": "https://storage.supabase.co/...",
  "thumbnail_url": "https://storage.supabase.co/...",
  "created_at": "2024-01-15T10:00:00Z"
}
```

### 3.3.2 シミュレーション

**シミュレーション実行**:
```
POST /functions/v1/simulation-create
```

```typescript
// Request
{
  "customer_id": "customer_uuid",
  "customer_photo_url": "https://storage.supabase.co/.../customer.jpg",
  "hair_style_id": "style_uuid",
  "options": {
    "preserve_hair_color": false
  }
}

// Response
{
  "simulation_id": "simulation_uuid",
  "status": "processing",
  "estimated_seconds": 5
}

// Webhook/ポーリング後の結果
{
  "simulation_id": "simulation_uuid",
  "status": "completed",
  "result": {
    "original_photo_url": "https://...",
    "simulated_photo_url": "https://...",
    "created_at": "2024-01-15T10:00:05Z"
  }
}
```

### 3.3.3 分析・レポート

**ダッシュボードデータ**:
```
GET /functions/v1/analytics-dashboard
```

```typescript
// Response
{
  "today": {
    "appointments": 8,
    "completed": 3,
    "revenue": 48000
  },
  "week": {
    "revenue": 186000,
    "customers": {
      "new": 5,
      "returning": 23
    }
  },
  "popular_styles": [
    {
      "id": "style_uuid",
      "title": "レイヤーボブ",
      "simulation_count": 45
    }
  ],
  "next_appointment": {
    "id": "appointment_uuid",
    "customer": {
      "id": "customer_uuid",
      "name": "山田 花子",
      "has_allergy": true,
      "last_visit_days_ago": 60
    },
    "start_time": "10:30",
    "services": ["カット", "カラー"]
  }
}
```

---

## 3.4 Auth API

### 3.4.1 認証エンドポイント

**ログイン**:
```
POST /auth/v1/token?grant_type=password
```

```typescript
// Request
{
  "email": "stylist@example.com",
  "password": "password123"
}

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token_here",
  "user": {
    "id": "user_uuid",
    "email": "stylist@example.com",
    "app_metadata": {},
    "user_metadata": {}
  }
}
```

**トークンリフレッシュ**:
```
POST /auth/v1/token?grant_type=refresh_token
```

```typescript
// Request
{
  "refresh_token": "refresh_token_here"
}
```

**ログアウト**:
```
POST /auth/v1/logout
Authorization: Bearer {access_token}
```

---

## 3.5 Storage API

### 3.5.1 ファイルアップロード

**画像アップロード**:
```
POST /storage/v1/object/{bucket}/{path}
Authorization: Bearer {jwt_token}
Content-Type: image/jpeg
```

**署名付きURL取得**:
```
POST /storage/v1/object/sign/{bucket}/{path}
Authorization: Bearer {jwt_token}

// Request
{
  "expiresIn": 3600
}

// Response
{
  "signedURL": "https://...?token=..."
}
```

### 3.5.2 バケット構成

```
Storage バケット構成
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【customer-photos】
├── {salon_id}/
│   └── {customer_id}/
│       ├── profile.jpg
│       └── simulation/
│           └── {timestamp}.jpg

【visit-photos】
├── {salon_id}/
│   └── {visit_id}/
│       ├── before_front.jpg
│       ├── before_side.jpg
│       ├── after_front.jpg
│       └── after_side.jpg

【hair-styles】
├── shared/
│   └── {style_id}.jpg
└── {salon_id}/
    └── {style_id}.jpg

【simulation-results】
├── {simulation_id}.png
└── (有効期限: 24時間後に自動削除)
```

---

## 3.6 エラーハンドリング

### 3.6.1 エラーレスポンス形式

```typescript
// 標準エラーレスポンス
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {
      // 追加情報
    }
  }
}
```

### 3.6.2 エラーコード一覧

| HTTPステータス | コード | 説明 |
|---------------|--------|------|
| 400 | VALIDATION_ERROR | バリデーションエラー |
| 401 | UNAUTHORIZED | 認証エラー |
| 403 | FORBIDDEN | 権限エラー |
| 404 | NOT_FOUND | リソースが見つからない |
| 409 | CONFLICT | 競合エラー |
| 422 | UNPROCESSABLE | 処理不可 |
| 429 | RATE_LIMITED | レート制限 |
| 500 | INTERNAL_ERROR | サーバーエラー |

### 3.6.3 カスタムエラーコード

| コード | 説明 | 対処 |
|--------|------|------|
| FACE_NOT_DETECTED | 顔検出失敗 | 写真を撮り直す |
| SIMULATION_FAILED | シミュレーション失敗 | リトライ |
| PINTEREST_RATE_LIMITED | Pinterest制限 | 待機後リトライ |
| STORAGE_QUOTA_EXCEEDED | ストレージ上限 | プラン確認 |

---

## 3.7 リアルタイムAPI

### 3.7.1 サブスクリプション

```typescript
// 予約の変更をリアルタイム監視
const channel = supabase
  .channel('appointments-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'appointments',
      filter: `salon_id=eq.${salonId}`
    },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

### 3.7.2 イベント種別

| イベント | 説明 |
|---------|------|
| INSERT | 新規レコード作成 |
| UPDATE | レコード更新 |
| DELETE | レコード削除 |
| * | すべてのイベント |
