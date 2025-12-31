import { supabase } from '../supabase';
import type {
  Visit,
  VisitWithDetails,
  VisitService,
  VisitPhoto,
  PaginationParams,
} from '@/types';

// 来店記録一覧取得
export const getVisits = async (
  customerId: string,
  params: PaginationParams = {}
): Promise<VisitWithDetails[]> => {
  const { page = 1, pageSize = 10 } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from('visits')
    .select(`
      *,
      stylist:stylists(*),
      services:visit_services(*),
      photos:visit_photos(*)
    `)
    .eq('customer_id', customerId)
    .order('visit_date', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return data || [];
};

// 来店記録詳細取得
export const getVisitById = async (visitId: string): Promise<VisitWithDetails | null> => {
  const { data, error } = await supabase
    .from('visits')
    .select(`
      *,
      customer:customers(*),
      stylist:stylists(*),
      services:visit_services(*),
      photos:visit_photos(*)
    `)
    .eq('id', visitId)
    .single();

  if (error) throw error;
  return data;
};

// 来店記録作成
export const createVisit = async (
  data: Omit<Visit, 'id' | 'created_at' | 'updated_at'>
): Promise<Visit> => {
  const { data: visit, error } = await supabase
    .from('visits')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return visit;
};

// 来店記録更新
export const updateVisit = async (
  visitId: string,
  data: Partial<Visit>
): Promise<Visit> => {
  const { data: visit, error } = await supabase
    .from('visits')
    .update(data)
    .eq('id', visitId)
    .select()
    .single();

  if (error) throw error;
  return visit;
};

// チェックイン
export const checkIn = async (visitId: string): Promise<Visit> => {
  return updateVisit(visitId, {
    status: 'in_progress',
    check_in_time: new Date().toISOString().split('T')[1].substring(0, 8),
  });
};

// チェックアウト
export const checkOut = async (
  visitId: string,
  totalAmount?: number,
  paymentMethod?: string
): Promise<Visit> => {
  return updateVisit(visitId, {
    status: 'completed',
    check_out_time: new Date().toISOString().split('T')[1].substring(0, 8),
    total_amount: totalAmount,
    payment_method: paymentMethod,
  });
};

// 施術追加
export const addVisitService = async (
  data: Omit<VisitService, 'id' | 'created_at'>
): Promise<VisitService> => {
  const { data: service, error } = await supabase
    .from('visit_services')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return service;
};

// 施術更新
export const updateVisitService = async (
  serviceId: string,
  data: Partial<VisitService>
): Promise<VisitService> => {
  const { data: service, error } = await supabase
    .from('visit_services')
    .update(data)
    .eq('id', serviceId)
    .select()
    .single();

  if (error) throw error;
  return service;
};

// 施術削除
export const deleteVisitService = async (serviceId: string): Promise<void> => {
  const { error } = await supabase
    .from('visit_services')
    .delete()
    .eq('id', serviceId);

  if (error) throw error;
};

// 写真追加
export const addVisitPhoto = async (
  data: Omit<VisitPhoto, 'id' | 'created_at'>
): Promise<VisitPhoto> => {
  const { data: photo, error } = await supabase
    .from('visit_photos')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return photo;
};

// 写真削除
export const deleteVisitPhoto = async (photoId: string): Promise<void> => {
  const { error } = await supabase
    .from('visit_photos')
    .delete()
    .eq('id', photoId);

  if (error) throw error;
};

// 本日の来店一覧取得
export const getTodayVisits = async (salonId: string): Promise<VisitWithDetails[]> => {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('visits')
    .select(`
      *,
      customer:customers(*),
      stylist:stylists(*)
    `)
    .eq('visit_date', today)
    .in('status', ['reserved', 'in_progress'])
    .order('check_in_time', { ascending: true });

  if (error) throw error;

  // salon_idでフィルタリング（customersテーブルのsalon_id）
  return (data || []).filter(
    (visit) => visit.customer?.salon_id === salonId
  );
};
