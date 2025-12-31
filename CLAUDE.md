# Hair Style Change AI - 美容室向けスタイルシミュレーション＆カルテシステム

## プロジェクト概要

美容室のiPadで使用する、AIを活用したヘアスタイルシミュレーションと顧客カルテ管理の統合システム。
Pinterestからヘアスタイル画像を取得し、NANOBANANA Proを用いて顧客の写真に合成。
「なりたい自分」を視覚化し、美容師と顧客のコミュニケーションを革新する。

---

## 技術スタック

### フロントエンド
- **React** (Vite) - Web版開発
- **React Native / Expo** - モバイルアプリ化
- **TypeScript** - 型安全性確保
- **TailwindCSS** - スタイリング（React Native Paper移行考慮）
- **Zustand** - 状態管理（React Native互換）
- **React Query (TanStack Query)** - サーバー状態管理

### バックエンド
- **Supabase**
  - PostgreSQL データベース
  - Authentication（美容師/管理者認証）
  - Storage（画像保存）
  - Edge Functions（API処理）
  - Realtime（リアルタイム同期）

### AI/画像処理
- **NANOBANANA Pro** - ヘアスタイル合成AI
- **Pinterest API** - スタイル画像取得
- **顔認識API** - 顔検出・位置合わせ

### インフラ
- **Vercel** - Web版ホスティング
- **Expo EAS** - アプリビルド・配信

---

## システム構成

```
┌─────────────────────────────────────────────────────────────────┐
│                      美容室システム全体像                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐          ┌──────────────────┐            │
│  │  顧客向けiPad     │          │  美容師向けiPad   │            │
│  │  (Customer App)  │          │  (Stylist App)   │            │
│  │                  │          │                  │            │
│  │ ・スタイル閲覧    │          │ ・カルテ管理      │            │
│  │ ・シミュレーション │          │ ・施術記録       │            │
│  │ ・お気に入り保存  │          │ ・予約管理       │            │
│  │ ・過去履歴確認   │          │ ・統計・分析      │            │
│  └────────┬─────────┘          └────────┬─────────┘            │
│           │                             │                      │
│           └──────────┬──────────────────┘                      │
│                      ▼                                         │
│           ┌──────────────────┐                                 │
│           │    Supabase      │                                 │
│           │  ・PostgreSQL    │                                 │
│           │  ・Auth          │                                 │
│           │  ・Storage       │                                 │
│           │  ・Edge Functions│                                 │
│           └────────┬─────────┘                                 │
│                    │                                           │
│           ┌────────┴─────────┐                                 │
│           ▼                  ▼                                 │
│  ┌─────────────────┐  ┌─────────────────┐                     │
│  │  NANOBANANA Pro │  │  Pinterest API  │                     │
│  │  (AI合成)       │  │  (スタイル取得)  │                     │
│  └─────────────────┘  └─────────────────┘                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## データベース設計

### テーブル構成

```sql
-- 美容室情報
salons
├── id (UUID, PK)
├── name (美容室名)
├── address (住所)
├── phone (電話番号)
├── business_hours (営業時間 JSONB)
├── created_at
└── updated_at

-- 美容師（スタッフ）
stylists
├── id (UUID, PK)
├── salon_id (FK → salons)
├── auth_user_id (FK → auth.users)
├── name (氏名)
├── nickname (表示名)
├── role (owner/manager/stylist/assistant)
├── profile_image_url
├── specialties (得意分野 JSONB)
├── is_active
├── created_at
└── updated_at

-- 顧客
customers
├── id (UUID, PK)
├── salon_id (FK → salons)
├── customer_code (顧客番号)
├── first_name
├── last_name
├── first_name_kana
├── last_name_kana
├── gender (male/female/other)
├── birth_date
├── phone
├── email
├── line_id
├── address
├── occupation (職業)
├── referral_source (来店きっかけ)
├── notes (メモ)
├── profile_photo_url (基本顔写真)
├── created_at
└── updated_at

-- 髪質・頭皮情報
customer_hair_profiles
├── id (UUID, PK)
├── customer_id (FK → customers)
├── hair_type (直毛/くせ毛/波状毛/縮毛)
├── hair_thickness (細い/普通/太い)
├── hair_volume (少ない/普通/多い)
├── hair_damage_level (1-5)
├── scalp_type (乾燥/普通/脂性)
├── scalp_sensitivity (敏感度 1-5)
├── gray_hair_percentage (白髪率 %)
├── allergies (アレルギー情報 JSONB)
├── previous_chemical_treatments (過去の施術履歴 JSONB)
├── notes
├── updated_at
└── updated_by (FK → stylists)

-- 来店・施術記録
visits
├── id (UUID, PK)
├── customer_id (FK → customers)
├── stylist_id (FK → stylists)
├── visit_date
├── check_in_time
├── check_out_time
├── status (reserved/in_progress/completed/cancelled)
├── total_amount
├── payment_method
├── notes
├── created_at
└── updated_at

-- 施術詳細
visit_services
├── id (UUID, PK)
├── visit_id (FK → visits)
├── service_type (cut/color/perm/treatment/spa/other)
├── service_name
├── price
├── duration_minutes
├── details (JSONB - カラー剤、パーマ液などの詳細)
├── notes
└── created_at

-- ビフォーアフター写真
visit_photos
├── id (UUID, PK)
├── visit_id (FK → visits)
├── photo_type (before/after/process)
├── photo_url
├── angle (front/side_left/side_right/back)
├── notes
└── created_at

-- ヘアスタイル画像（Pinterest等から取得）
hair_styles
├── id (UUID, PK)
├── salon_id (FK → salons)
├── source (pinterest/original/stock)
├── source_url (元URL)
├── image_url (保存後URL)
├── title
├── description
├── tags (JSONB - ショート, ボブ, レイヤー等)
├── hair_length (short/medium/long)
├── hair_color (JSONB - 色情報)
├── face_shape_compatibility (似合う顔型 JSONB)
├── gender_target (male/female/unisex)
├── is_active
├── view_count
├── favorite_count
├── created_at
└── updated_at

-- 顧客のお気に入りスタイル
customer_favorite_styles
├── id (UUID, PK)
├── customer_id (FK → customers)
├── hair_style_id (FK → hair_styles)
├── notes
└── created_at

-- スタイルシミュレーション結果
style_simulations
├── id (UUID, PK)
├── customer_id (FK → customers)
├── hair_style_id (FK → hair_styles)
├── original_photo_url (元の顧客写真)
├── simulated_photo_url (合成結果)
├── is_liked (顧客の反応)
├── stylist_notes (美容師コメント)
├── created_at
└── created_by (FK → stylists)

-- 予約
appointments
├── id (UUID, PK)
├── customer_id (FK → customers)
├── stylist_id (FK → stylists)
├── appointment_date
├── start_time
├── end_time
├── services (予定施術 JSONB)
├── status (pending/confirmed/completed/cancelled/no_show)
├── reminder_sent
├── notes
├── created_at
└── updated_at

-- ポイント・会員ランク
customer_points
├── id (UUID, PK)
├── customer_id (FK → customers)
├── points_balance
├── lifetime_points
├── member_rank (bronze/silver/gold/platinum)
├── updated_at

-- ポイント履歴
point_transactions
├── id (UUID, PK)
├── customer_id (FK → customers)
├── visit_id (FK → visits, nullable)
├── transaction_type (earn/redeem/expire/adjustment)
├── points
├── description
├── created_at
```

---

## 機能仕様

### 1. 顧客向けiPadアプリ (Customer App)

#### 1.1 スタイル閲覧・検索
- **カテゴリ別表示**: ショート/ミディアム/ロング、カラー別
- **AIおすすめ**: 顔型・髪質に合ったスタイル提案
- **トレンド表示**: 人気スタイルランキング
- **検索・フィルター**: タグ、長さ、色で絞り込み

#### 1.2 スタイルシミュレーション
- **写真撮影**: iPadカメラで顔写真撮影
- **既存写真選択**: 過去の写真から選択
- **スタイル適用**: 選んだスタイルをAI合成
- **比較表示**: ビフォーアフター並列表示
- **保存・共有**: 結果をカルテに保存

#### 1.3 マイページ
- **施術履歴**: 過去の来店・施術記録閲覧
- **お気に入り**: 保存したスタイル一覧
- **シミュレーション履歴**: 過去の試着結果
- **次回予約確認**: 予約日時・内容表示
- **ポイント確認**: 現在のポイント・ランク

#### 1.4 カウンセリングシート（来店時入力）
- 今日の気分・なりたいイメージ
- 気になる部分・悩み
- 前回からの変化
- スタイリングの頻度
- 使用しているヘアケア製品

### 2. 美容師向けiPadアプリ (Stylist App)

#### 2.1 顧客カルテ管理
- **顧客検索**: 名前、電話番号、顧客番号で検索
- **新規登録**: 初来店顧客のカルテ作成
- **カルテ詳細表示**:
  - 基本情報
  - 髪質・頭皮プロファイル
  - 施術履歴（時系列）
  - アレルギー・注意事項（目立つ表示）
  - お気に入りスタイル
  - シミュレーション履歴
  - ビフォーアフター写真

#### 2.2 施術記録入力
- **チェックイン**: 来店確認
- **施術内容入力**:
  - カット詳細（長さ、レイヤー、スタイル名）
  - カラー詳細（メーカー、色番号、放置時間、配合比率）
  - パーマ詳細（ロッド、薬剤、放置時間）
  - トリートメント詳細
- **写真撮影**: ビフォー/プロセス/アフター
- **次回提案**: おすすめ施術・来店時期
- **会計処理**: 金額入力、ポイント付与

#### 2.3 スタイル提案ツール
- **シミュレーション実行**: 顧客写真にスタイル適用
- **提案リスト作成**: 複数スタイルをまとめて提案
- **カウンセリングメモ**: 会話内容の記録

#### 2.4 予約管理
- **予約一覧**: 日別/週別カレンダー表示
- **予約詳細**: 顧客情報、予定施術、所要時間
- **予約変更・キャンセル**: ステータス管理
- **空き状況確認**: スタイリスト別空き表示

#### 2.5 ダッシュボード・統計
- **本日の予約一覧**
- **売上サマリー**: 日/週/月別
- **顧客統計**: 新規/リピート率、来店頻度
- **人気スタイル**: シミュレーション・施術データ分析

### 3. 管理者機能（Web版追加）

#### 3.1 スタッフ管理
- スタッフ登録・編集・権限設定
- シフト管理

#### 3.2 メニュー・価格管理
- 施術メニュー設定
- 価格改定

#### 3.3 スタイル画像管理
- Pinterest連携設定
- 画像の承認・非公開設定
- タグ・カテゴリ管理

#### 3.4 レポート・分析
- 売上レポート
- 顧客分析
- スタッフ別実績

---

## API設計

### Supabase Edge Functions

```
/functions
├── /pinterest
│   ├── search-styles    # Pinterestスタイル検索
│   └── import-image     # 画像取り込み
├── /simulation
│   ├── create           # シミュレーション実行
│   └── get-result       # 結果取得
├── /customers
│   ├── search           # 顧客検索
│   └── merge            # 重複顧客統合
├── /analytics
│   ├── dashboard        # ダッシュボードデータ
│   └── reports          # レポート生成
└── /notifications
    └── send-reminder    # リマインダー送信
```

---

## 画面設計（主要画面）

### 顧客向けアプリ

```
[ホーム]
├── おすすめスタイル（AIレコメンド）
├── トレンドスタイル
├── カテゴリ（ショート/ミディアム/ロング）
└── 検索バー

[スタイル詳細]
├── スタイル画像（複数角度）
├── スタイル情報（長さ、カラー、特徴）
├── 「試着してみる」ボタン
├── お気に入り追加
└── 似たスタイル

[シミュレーション]
├── 写真選択/撮影
├── スタイル選択
├── 合成プレビュー
├── ビフォーアフター切替
├── 保存/共有
└── 「このスタイルで予約」

[マイページ]
├── プロフィール
├── 施術履歴
├── お気に入りスタイル
├── シミュレーション履歴
├── 予約確認
└── ポイント・クーポン
```

### 美容師向けアプリ

```
[ホーム/ダッシュボード]
├── 本日の予約一覧
├── 次の顧客情報（カルテサマリー）
├── 売上サマリー
└── 通知・アラート

[顧客検索]
├── 検索バー（名前/電話/番号）
├── 最近の顧客
├── 本日来店予定
└── 新規登録ボタン

[カルテ詳細]
├── 基本情報タブ
├── 髪質プロファイルタブ
├── 施術履歴タブ（タイムライン表示）
├── 写真タブ（ビフォーアフター一覧）
├── シミュレーションタブ
└── メモ・注意事項

[施術入力]
├── 施術選択（カット/カラー/パーマ等）
├── 詳細入力フォーム
├── 写真撮影
├── 担当者選択
├── 次回提案入力
└── 完了・会計へ

[スタイル提案]
├── スタイル検索
├── 顧客写真選択
├── シミュレーション実行
├── 結果一覧
└── 提案シート作成

[予約管理]
├── カレンダー表示
├── 予約詳細
├── 新規予約作成
└── 変更・キャンセル
```

---

## 開発フェーズ

### Phase 1: MVP（最小限の実用製品）
1. Supabase環境構築・認証設定
2. 基本データベース構築
3. 顧客カルテCRUD
4. スタイル画像管理
5. 基本的なシミュレーション機能

### Phase 2: コア機能
1. Pinterest連携
2. NANOBANANA Pro統合
3. 施術記録機能
4. ビフォーアフター写真管理
5. 予約管理基本機能

### Phase 3: UX強化
1. AIスタイルレコメンド
2. カウンセリングシート
3. ポイント・会員ランク
4. 通知・リマインダー

### Phase 4: 分析・拡張
1. ダッシュボード・統計
2. レポート機能
3. LINE連携
4. Expo アプリビルド

---

## ディレクトリ構造

```
hair_style_changeai/
├── CLAUDE.md
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── .env.example
├── .env.local
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   │
│   ├── components/           # UIコンポーネント
│   │   ├── common/           # 共通コンポーネント
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Loading.tsx
│   │   ├── customer/         # 顧客向けコンポーネント
│   │   │   ├── StyleCard.tsx
│   │   │   ├── StyleGrid.tsx
│   │   │   ├── SimulationView.tsx
│   │   │   └── BeforeAfter.tsx
│   │   ├── stylist/          # 美容師向けコンポーネント
│   │   │   ├── CustomerCard.tsx
│   │   │   ├── KarteView.tsx
│   │   │   ├── ServiceForm.tsx
│   │   │   └── PhotoCapture.tsx
│   │   └── layout/           # レイアウト
│   │       ├── CustomerLayout.tsx
│   │       └── StylistLayout.tsx
│   │
│   ├── pages/                # ページコンポーネント
│   │   ├── customer/         # 顧客向けページ
│   │   │   ├── Home.tsx
│   │   │   ├── StyleDetail.tsx
│   │   │   ├── Simulation.tsx
│   │   │   └── MyPage.tsx
│   │   └── stylist/          # 美容師向けページ
│   │       ├── Dashboard.tsx
│   │       ├── CustomerSearch.tsx
│   │       ├── CustomerKarte.tsx
│   │       ├── ServiceInput.tsx
│   │       ├── StyleProposal.tsx
│   │       └── Appointments.tsx
│   │
│   ├── hooks/                # カスタムフック
│   │   ├── useAuth.ts
│   │   ├── useCustomer.ts
│   │   ├── useStyles.ts
│   │   ├── useSimulation.ts
│   │   └── useAppointments.ts
│   │
│   ├── stores/               # 状態管理 (Zustand)
│   │   ├── authStore.ts
│   │   ├── customerStore.ts
│   │   └── uiStore.ts
│   │
│   ├── services/             # API・外部サービス
│   │   ├── supabase.ts       # Supabaseクライアント
│   │   ├── pinterest.ts      # Pinterest API
│   │   ├── nanobanana.ts     # NANOBANANA Pro
│   │   └── api/
│   │       ├── customers.ts
│   │       ├── styles.ts
│   │       ├── visits.ts
│   │       └── appointments.ts
│   │
│   ├── types/                # 型定義
│   │   ├── database.ts       # Supabase生成型
│   │   ├── customer.ts
│   │   ├── style.ts
│   │   └── visit.ts
│   │
│   └── utils/                # ユーティリティ
│       ├── format.ts         # フォーマット関数
│       ├── validation.ts     # バリデーション
│       └── constants.ts      # 定数
│
├── supabase/
│   ├── config.toml
│   ├── migrations/           # DBマイグレーション
│   │   ├── 001_initial_schema.sql
│   │   └── ...
│   ├── functions/            # Edge Functions
│   │   ├── pinterest-search/
│   │   ├── simulation-create/
│   │   └── ...
│   └── seed.sql              # シードデータ
│
└── public/
    ├── favicon.ico
    └── assets/
```

---

## 環境変数

```env
# Supabase
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# NANOBANANA Pro
VITE_NANOBANANA_API_KEY=your-api-key
VITE_NANOBANANA_API_URL=https://api.nanobanana.pro

# Pinterest (Server-side only)
PINTEREST_CLIENT_ID=your-client-id
PINTEREST_CLIENT_SECRET=your-client-secret

# App Config
VITE_APP_MODE=customer|stylist
```

---

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 型チェック
npm run typecheck

# Lint
npm run lint

# Supabase ローカル起動
npx supabase start

# マイグレーション実行
npx supabase db push

# Edge Function デプロイ
npx supabase functions deploy

# Expo（将来）
npx expo start
```

---

## セキュリティ考慮事項

1. **認証**: Supabase Authで美容師ログイン必須
2. **RLS**: Row Level Securityで店舗別データ分離
3. **画像**: プライベートStorage + 署名付きURL
4. **顧客データ**: 個人情報保護法準拠
5. **通信**: HTTPS必須

---

## React Native移行時の注意点

- `tailwindcss` → `nativewind` or `react-native-paper`
- `react-router-dom` → `expo-router` or `react-navigation`
- Web API → Expo SDK（カメラ、ストレージ等）
- CSS → StyleSheet
- コンポーネントを最初からプラットフォーム非依存に設計

---

## 次のステップ

1. [ ] プロジェクト初期化（Vite + React + TypeScript）
2. [ ] TailwindCSS設定
3. [ ] Supabase プロジェクト作成・接続
4. [ ] 基本テーブル作成（マイグレーション）
5. [ ] 認証機能実装
6. [ ] 顧客カルテCRUD実装
7. [ ] スタイル画像管理実装
8. [ ] シミュレーション機能統合

---

## 備考・アイデアメモ

- **顔型診断AI**: 顔写真から顔型を自動判定し、似合うスタイルをフィルタリング
- **髪色シミュレーション**: ヘアスタイルだけでなくカラーも変更可能に
- **AR機能**: 将来的にリアルタイムAR試着
- **音声メモ**: 美容師が施術中にハンズフリーで記録
- **多言語対応**: インバウンド顧客向け
- **オンラインカウンセリング**: 来店前にLINE等でスタイル相談
