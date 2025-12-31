import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

// 電話番号フォーマット
export const formatPhoneNumber = (phone: string | null | undefined): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

// 日付フォーマット
export const formatDate = (
  date: string | Date | null | undefined,
  formatStr: string = 'yyyy年M月d日'
): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr, { locale: ja });
};

// 時刻フォーマット
export const formatTime = (time: string | null | undefined): string => {
  if (!time) return '';
  // HH:mm:ss or HH:mm format
  const parts = time.split(':');
  return `${parts[0]}:${parts[1]}`;
};

// 日時フォーマット
export const formatDateTime = (
  dateTime: string | Date | null | undefined
): string => {
  if (!dateTime) return '';
  const d = typeof dateTime === 'string' ? parseISO(dateTime) : dateTime;
  return format(d, 'yyyy年M月d日 HH:mm', { locale: ja });
};

// 相対時間
export const formatRelativeTime = (
  date: string | Date | null | undefined
): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: ja });
};

// 金額フォーマット
export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount);
};

// パーセンテージフォーマット
export const formatPercentage = (
  value: number | null | undefined,
  decimals: number = 0
): string => {
  if (value === null || value === undefined) return '';
  return `${value.toFixed(decimals)}%`;
};

// 顧客名フォーマット
export const formatCustomerName = (
  lastName: string | null | undefined,
  firstName: string | null | undefined
): string => {
  const last = lastName ?? '';
  const first = firstName ?? '';
  return `${last} ${first}`.trim();
};

// 顧客名フォーマット（カナ）
export const formatCustomerNameKana = (
  lastNameKana: string | null | undefined,
  firstNameKana: string | null | undefined
): string => {
  const last = lastNameKana ?? '';
  const first = firstNameKana ?? '';
  return `${last} ${first}`.trim();
};

// 年齢計算
export const calculateAge = (birthDate: string | null | undefined): number | null => {
  if (!birthDate) return null;
  const birth = parseISO(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// 施術時間フォーマット
export const formatDuration = (minutes: number | null | undefined): string => {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes}分`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`;
};
