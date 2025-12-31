import { supabase } from '../supabase';
import type {
  HairStyle,
  CustomerFavoriteStyle,
  StyleFilters,
  PaginatedResponse,
} from '@/types';

// スタイル一覧取得
export const getStyles = async (
  filters: StyleFilters = {}
): Promise<PaginatedResponse<HairStyle>> => {
  const {
    page = 1,
    pageSize = 20,
    search,
    hairLength,
    genderTarget,
    tags,
    sortBy = 'created_at',
    sortOrder = 'desc',
  } = filters;

  let query = supabase
    .from('hair_styles')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  // 検索
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // 髪の長さフィルター
  if (hairLength) {
    query = query.eq('hair_length', hairLength);
  }

  // 性別ターゲットフィルター
  if (genderTarget) {
    query = query.eq('gender_target', genderTarget);
  }

  // タグフィルター
  if (tags && tags.length > 0) {
    query = query.contains('tags', tags);
  }

  // ソート
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // ページネーション
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data || [],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
};

// スタイル詳細取得
export const getStyleById = async (styleId: string): Promise<HairStyle | null> => {
  const { data, error } = await supabase
    .from('hair_styles')
    .select('*')
    .eq('id', styleId)
    .single();

  if (error) throw error;
  return data;
};

// 人気スタイル取得
export const getPopularStyles = async (limit: number = 10): Promise<HairStyle[]> => {
  const { data, error } = await supabase
    .from('hair_styles')
    .select('*')
    .eq('is_active', true)
    .order('favorite_count', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

// おすすめスタイル取得（顧客属性に基づく）
export const getRecommendedStyles = async (
  customerId: string,
  limit: number = 10
): Promise<HairStyle[]> => {
  // 顧客の髪質プロファイルを取得
  const { data: profile } = await supabase
    .from('customer_hair_profiles')
    .select('*')
    .eq('customer_id', customerId)
    .single();

  // 顧客の基本情報を取得
  const { data: customer } = await supabase
    .from('customers')
    .select('gender')
    .eq('id', customerId)
    .single();

  let query = supabase
    .from('hair_styles')
    .select('*')
    .eq('is_active', true);

  // 性別に基づくフィルター
  if (customer?.gender) {
    query = query.or(`gender_target.eq.${customer.gender},gender_target.eq.unisex`);
  }

  query = query.order('favorite_count', { ascending: false }).limit(limit);

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

// お気に入り追加
export const addFavoriteStyle = async (
  customerId: string,
  styleId: string,
  notes?: string
): Promise<CustomerFavoriteStyle> => {
  const { data, error } = await supabase
    .from('customer_favorite_styles')
    .insert({
      customer_id: customerId,
      hair_style_id: styleId,
      notes,
    })
    .select()
    .single();

  if (error) throw error;

  // お気に入り数を更新
  await supabase.rpc('increment_favorite_count', { style_id: styleId });

  return data;
};

// お気に入り削除
export const removeFavoriteStyle = async (
  customerId: string,
  styleId: string
): Promise<void> => {
  const { error } = await supabase
    .from('customer_favorite_styles')
    .delete()
    .eq('customer_id', customerId)
    .eq('hair_style_id', styleId);

  if (error) throw error;

  // お気に入り数を更新
  await supabase.rpc('decrement_favorite_count', { style_id: styleId });
};

// 顧客のお気に入りスタイル取得
export const getCustomerFavoriteStyles = async (
  customerId: string
): Promise<(CustomerFavoriteStyle & { hair_style: HairStyle })[]> => {
  const { data, error } = await supabase
    .from('customer_favorite_styles')
    .select(`
      *,
      hair_style:hair_styles(*)
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// 閲覧数をインクリメント
export const incrementViewCount = async (styleId: string): Promise<void> => {
  await supabase.rpc('increment_view_count', { style_id: styleId });
};
