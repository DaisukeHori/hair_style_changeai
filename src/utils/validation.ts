import { z } from 'zod';

// 電話番号バリデーション
export const phoneSchema = z
  .string()
  .regex(/^[0-9-]*$/, '電話番号は数字とハイフンのみ入力可能です')
  .refine(
    (val) => {
      if (!val) return true;
      const digits = val.replace(/-/g, '');
      return digits.length === 10 || digits.length === 11;
    },
    { message: '電話番号は10桁または11桁で入力してください' }
  )
  .optional()
  .or(z.literal(''));

// メールアドレスバリデーション
export const emailSchema = z
  .string()
  .email('有効なメールアドレスを入力してください')
  .optional()
  .or(z.literal(''));

// 顧客フォームスキーマ
export const customerFormSchema = z.object({
  last_name: z.string().min(1, '姓を入力してください'),
  first_name: z.string().min(1, '名を入力してください'),
  last_name_kana: z.string().optional(),
  first_name_kana: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  birth_date: z.string().optional(),
  phone: phoneSchema,
  email: emailSchema,
  line_id: z.string().optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
  referral_source: z.string().optional(),
  notes: z.string().optional(),
});

// 髪質プロファイルスキーマ
export const hairProfileFormSchema = z.object({
  hair_type: z.enum(['straight', 'wavy', 'curly', 'coily']).optional(),
  hair_thickness: z.enum(['thin', 'normal', 'thick']).optional(),
  hair_volume: z.enum(['low', 'normal', 'high']).optional(),
  hair_damage_level: z.number().min(1).max(5).optional(),
  scalp_type: z.enum(['dry', 'normal', 'oily']).optional(),
  scalp_sensitivity: z.number().min(1).max(5).optional(),
  gray_hair_percentage: z.number().min(0).max(100).optional(),
  has_allergy: z.boolean().optional(),
  allergy_items: z.array(z.string()).optional(),
  allergy_notes: z.string().optional(),
  notes: z.string().optional(),
});

// 予約フォームスキーマ
export const appointmentFormSchema = z.object({
  customer_id: z.string().min(1, '顧客を選択してください'),
  stylist_id: z.string().min(1, 'スタイリストを選択してください'),
  appointment_date: z.string().min(1, '日付を選択してください'),
  start_time: z.string().min(1, '開始時刻を選択してください'),
  end_time: z.string().min(1, '終了時刻を選択してください'),
  services: z
    .array(
      z.object({
        service_type: z.string(),
        service_name: z.string(),
        estimated_duration: z.number(),
        estimated_price: z.number().optional(),
      })
    )
    .optional(),
  notes: z.string().optional(),
});

// 施術記録スキーマ
export const visitServiceFormSchema = z.object({
  service_type: z.enum(['cut', 'color', 'perm', 'treatment', 'spa', 'other']),
  service_name: z.string().min(1, '施術名を入力してください'),
  price: z.number().min(0).optional(),
  duration_minutes: z.number().min(1).optional(),
  notes: z.string().optional(),
  details: z.record(z.unknown()).optional(),
});

// 型推論
export type CustomerFormValues = z.infer<typeof customerFormSchema>;
export type HairProfileFormValues = z.infer<typeof hairProfileFormSchema>;
export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
export type VisitServiceFormValues = z.infer<typeof visitServiceFormSchema>;
