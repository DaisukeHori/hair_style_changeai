import { supabase } from '../supabase';
import type {
  Customer,
  CustomerWithDetails,
  CustomerHairProfile,
  CustomerFilters,
  PaginatedResponse,
} from '@/types';

// 顧客一覧取得
export const getCustomers = async (
  salonId: string,
  filters: CustomerFilters = {}
): Promise<PaginatedResponse<Customer>> => {
  const {
    page = 1,
    pageSize = 20,
    search,
    gender,
    hasAllergy,
    sortBy = 'updated_at',
    sortOrder = 'desc',
  } = filters;

  let query = supabase
    .from('customers')
    .select('*', { count: 'exact' })
    .eq('salon_id', salonId);

  // 検索
  if (search) {
    query = query.or(
      `last_name.ilike.%${search}%,first_name.ilike.%${search}%,last_name_kana.ilike.%${search}%,first_name_kana.ilike.%${search}%,phone.ilike.%${search}%`
    );
  }

  // 性別フィルター
  if (gender) {
    query = query.eq('gender', gender);
  }

  // ソート
  query = query.order(sortBy, { ascending: sortOrder === 'asc' });

  // ページネーション
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  // アレルギーフィルター（髪質プロファイルとのJOINが必要な場合）
  let filteredData = data || [];
  if (hasAllergy !== undefined && filteredData.length > 0) {
    const customerIds = filteredData.map((c) => c.id);
    const { data: profiles } = await supabase
      .from('customer_hair_profiles')
      .select('customer_id, allergies')
      .in('customer_id', customerIds);

    if (profiles) {
      const allergyCustomerIds = new Set(
        profiles
          .filter((p) => hasAllergy ? p.allergies?.has_allergy : !p.allergies?.has_allergy)
          .map((p) => p.customer_id)
      );
      filteredData = filteredData.filter((c) =>
        hasAllergy
          ? allergyCustomerIds.has(c.id)
          : !allergyCustomerIds.has(c.id) || allergyCustomerIds.has(c.id)
      );
    }
  }

  return {
    data: filteredData,
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
};

// 顧客詳細取得
export const getCustomerById = async (
  customerId: string
): Promise<CustomerWithDetails | null> => {
  const { data: customer, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single();

  if (error) throw error;
  if (!customer) return null;

  // 髪質プロファイル取得
  const { data: hairProfile } = await supabase
    .from('customer_hair_profiles')
    .select('*')
    .eq('customer_id', customerId)
    .single();

  // 来店履歴取得（最新10件）
  const { data: visits } = await supabase
    .from('visits')
    .select('*')
    .eq('customer_id', customerId)
    .order('visit_date', { ascending: false })
    .limit(10);

  // お気に入りスタイル取得
  const { data: favoriteStyles } = await supabase
    .from('customer_favorite_styles')
    .select(`
      *,
      hair_style:hair_styles(*)
    `)
    .eq('customer_id', customerId);

  // シミュレーション履歴取得
  const { data: simulations } = await supabase
    .from('style_simulations')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(10);

  // ポイント情報取得
  const { data: points } = await supabase
    .from('customer_points')
    .select('*')
    .eq('customer_id', customerId)
    .single();

  return {
    ...customer,
    hair_profile: hairProfile || undefined,
    visits: visits || [],
    favorite_styles: favoriteStyles || [],
    simulations: simulations || [],
    points: points || undefined,
  };
};

// 顧客作成
export const createCustomer = async (
  salonId: string,
  data: Omit<Customer, 'id' | 'salon_id' | 'created_at' | 'updated_at'>
): Promise<Customer> => {
  const { data: customer, error } = await supabase
    .from('customers')
    .insert({
      ...data,
      salon_id: salonId,
    })
    .select()
    .single();

  if (error) throw error;
  return customer;
};

// 顧客更新
export const updateCustomer = async (
  customerId: string,
  data: Partial<Customer>
): Promise<Customer> => {
  const { data: customer, error } = await supabase
    .from('customers')
    .update(data)
    .eq('id', customerId)
    .select()
    .single();

  if (error) throw error;
  return customer;
};

// 顧客削除
export const deleteCustomer = async (customerId: string): Promise<void> => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', customerId);

  if (error) throw error;
};

// 髪質プロファイル更新
export const updateHairProfile = async (
  customerId: string,
  data: Partial<CustomerHairProfile>,
  updatedBy: string
): Promise<CustomerHairProfile> => {
  const { data: existing } = await supabase
    .from('customer_hair_profiles')
    .select('id')
    .eq('customer_id', customerId)
    .single();

  if (existing) {
    const { data: profile, error } = await supabase
      .from('customer_hair_profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy,
      })
      .eq('customer_id', customerId)
      .select()
      .single();

    if (error) throw error;
    return profile;
  } else {
    const { data: profile, error } = await supabase
      .from('customer_hair_profiles')
      .insert({
        ...data,
        customer_id: customerId,
        updated_by: updatedBy,
      })
      .select()
      .single();

    if (error) throw error;
    return profile;
  }
};

// 顧客検索（簡易）
export const searchCustomers = async (
  salonId: string,
  query: string,
  limit: number = 10
): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('salon_id', salonId)
    .or(
      `last_name.ilike.%${query}%,first_name.ilike.%${query}%,phone.ilike.%${query}%`
    )
    .limit(limit);

  if (error) throw error;
  return data || [];
};
