// 性別
export const GENDER_OPTIONS = [
  { value: 'male', label: '男性' },
  { value: 'female', label: '女性' },
  { value: 'other', label: 'その他' },
] as const;

// 髪質
export const HAIR_TYPE_OPTIONS = [
  { value: 'straight', label: '直毛' },
  { value: 'wavy', label: '波状毛' },
  { value: 'curly', label: 'くせ毛' },
  { value: 'coily', label: '縮毛' },
] as const;

// 髪の太さ
export const HAIR_THICKNESS_OPTIONS = [
  { value: 'thin', label: '細い' },
  { value: 'normal', label: '普通' },
  { value: 'thick', label: '太い' },
] as const;

// 毛量
export const HAIR_VOLUME_OPTIONS = [
  { value: 'low', label: '少ない' },
  { value: 'normal', label: '普通' },
  { value: 'high', label: '多い' },
] as const;

// 頭皮タイプ
export const SCALP_TYPE_OPTIONS = [
  { value: 'dry', label: '乾燥肌' },
  { value: 'normal', label: '普通肌' },
  { value: 'oily', label: '脂性肌' },
] as const;

// 施術タイプ
export const SERVICE_TYPE_OPTIONS = [
  { value: 'cut', label: 'カット' },
  { value: 'color', label: 'カラー' },
  { value: 'perm', label: 'パーマ' },
  { value: 'treatment', label: 'トリートメント' },
  { value: 'spa', label: 'ヘッドスパ' },
  { value: 'other', label: 'その他' },
] as const;

// 予約ステータス
export const APPOINTMENT_STATUS_OPTIONS = [
  { value: 'pending', label: '未確定' },
  { value: 'confirmed', label: '確定' },
  { value: 'completed', label: '完了' },
  { value: 'cancelled', label: 'キャンセル' },
  { value: 'no_show', label: '無断キャンセル' },
] as const;

// 来店ステータス
export const VISIT_STATUS_OPTIONS = [
  { value: 'reserved', label: '予約済み' },
  { value: 'in_progress', label: '施術中' },
  { value: 'completed', label: '完了' },
  { value: 'cancelled', label: 'キャンセル' },
] as const;

// 会員ランク
export const MEMBER_RANK_OPTIONS = [
  { value: 'bronze', label: 'ブロンズ' },
  { value: 'silver', label: 'シルバー' },
  { value: 'gold', label: 'ゴールド' },
  { value: 'platinum', label: 'プラチナ' },
] as const;

// 髪の長さ
export const HAIR_LENGTH_OPTIONS = [
  { value: 'short', label: 'ショート' },
  { value: 'medium', label: 'ミディアム' },
  { value: 'long', label: 'ロング' },
] as const;

// 写真タイプ
export const PHOTO_TYPE_OPTIONS = [
  { value: 'before', label: 'ビフォー' },
  { value: 'after', label: 'アフター' },
  { value: 'process', label: '施術中' },
] as const;

// 写真アングル
export const PHOTO_ANGLE_OPTIONS = [
  { value: 'front', label: '正面' },
  { value: 'side_left', label: '左側面' },
  { value: 'side_right', label: '右側面' },
  { value: 'back', label: '背面' },
] as const;

// スタイリスト役割
export const STYLIST_ROLE_OPTIONS = [
  { value: 'owner', label: 'オーナー' },
  { value: 'manager', label: '店長' },
  { value: 'stylist', label: 'スタイリスト' },
  { value: 'assistant', label: 'アシスタント' },
] as const;

// ダメージレベル
export const DAMAGE_LEVEL_OPTIONS = [
  { value: 1, label: 'レベル1（健康）' },
  { value: 2, label: 'レベル2（やや健康）' },
  { value: 3, label: 'レベル3（普通）' },
  { value: 4, label: 'レベル4（ダメージあり）' },
  { value: 5, label: 'レベル5（ダメージ大）' },
] as const;

// よくあるアレルギー項目
export const COMMON_ALLERGIES = [
  'ジアミン',
  'パラベン',
  'ラテックス',
  '香料',
  'アルコール',
] as const;

// 来店きっかけ
export const REFERRAL_SOURCE_OPTIONS = [
  { value: 'website', label: 'ホームページ' },
  { value: 'hotpepper', label: 'ホットペッパー' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'referral', label: '紹介' },
  { value: 'walk_in', label: '飛び込み' },
  { value: 'other', label: 'その他' },
] as const;

// 支払い方法
export const PAYMENT_METHOD_OPTIONS = [
  { value: 'cash', label: '現金' },
  { value: 'credit_card', label: 'クレジットカード' },
  { value: 'qr_payment', label: 'QR決済' },
  { value: 'electronic_money', label: '電子マネー' },
] as const;
