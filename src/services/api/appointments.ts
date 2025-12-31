import { supabase } from '../supabase';
import type {
  Appointment,
  AppointmentWithDetails,
  AppointmentFilters,
  PaginatedResponse,
} from '@/types';

// 予約一覧取得
export const getAppointments = async (
  salonId: string,
  filters: AppointmentFilters = {}
): Promise<PaginatedResponse<AppointmentWithDetails>> => {
  const {
    page = 1,
    pageSize = 20,
    stylistId,
    status,
    dateFrom,
    dateTo,
    sortBy = 'appointment_date',
    sortOrder = 'asc',
  } = filters;

  let query = supabase
    .from('appointments')
    .select(
      `
      *,
      customer:customers!inner(*),
      stylist:stylists(*)
    `,
      { count: 'exact' }
    )
    .eq('customer.salon_id', salonId);

  // スタイリストフィルター
  if (stylistId) {
    query = query.eq('stylist_id', stylistId);
  }

  // ステータスフィルター
  if (status) {
    query = query.eq('status', status);
  }

  // 日付範囲フィルター
  if (dateFrom) {
    query = query.gte('appointment_date', dateFrom);
  }
  if (dateTo) {
    query = query.lte('appointment_date', dateTo);
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

// 予約詳細取得
export const getAppointmentById = async (
  appointmentId: string
): Promise<AppointmentWithDetails | null> => {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      customer:customers(*),
      stylist:stylists(*)
    `)
    .eq('id', appointmentId)
    .single();

  if (error) throw error;
  return data;
};

// 予約作成
export const createAppointment = async (
  data: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>
): Promise<Appointment> => {
  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert({
      ...data,
      status: 'pending',
      reminder_sent: false,
    })
    .select()
    .single();

  if (error) throw error;
  return appointment;
};

// 予約更新
export const updateAppointment = async (
  appointmentId: string,
  data: Partial<Appointment>
): Promise<Appointment> => {
  const { data: appointment, error } = await supabase
    .from('appointments')
    .update(data)
    .eq('id', appointmentId)
    .select()
    .single();

  if (error) throw error;
  return appointment;
};

// 予約確定
export const confirmAppointment = async (
  appointmentId: string
): Promise<Appointment> => {
  return updateAppointment(appointmentId, { status: 'confirmed' });
};

// 予約キャンセル
export const cancelAppointment = async (
  appointmentId: string
): Promise<Appointment> => {
  return updateAppointment(appointmentId, { status: 'cancelled' });
};

// 予約完了（来店済み）
export const completeAppointment = async (
  appointmentId: string
): Promise<Appointment> => {
  return updateAppointment(appointmentId, { status: 'completed' });
};

// 無断キャンセル
export const markNoShow = async (appointmentId: string): Promise<Appointment> => {
  return updateAppointment(appointmentId, { status: 'no_show' });
};

// 本日の予約取得
export const getTodayAppointments = async (
  salonId: string,
  stylistId?: string
): Promise<AppointmentWithDetails[]> => {
  const today = new Date().toISOString().split('T')[0];

  let query = supabase
    .from('appointments')
    .select(`
      *,
      customer:customers!inner(*),
      stylist:stylists(*)
    `)
    .eq('customer.salon_id', salonId)
    .eq('appointment_date', today)
    .in('status', ['pending', 'confirmed'])
    .order('start_time', { ascending: true });

  if (stylistId) {
    query = query.eq('stylist_id', stylistId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
};

// スタイリストの空き時間確認
export const getStylistAvailability = async (
  stylistId: string,
  date: string
): Promise<{ start: string; end: string }[]> => {
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select('start_time, end_time')
    .eq('stylist_id', stylistId)
    .eq('appointment_date', date)
    .in('status', ['pending', 'confirmed'])
    .order('start_time', { ascending: true });

  if (error) throw error;

  // 営業時間（仮に9:00-19:00とする）
  const businessStart = '09:00';
  const businessEnd = '19:00';

  const bookedSlots = (appointments || []).map((a) => ({
    start: a.start_time,
    end: a.end_time,
  }));

  // 空き時間を計算
  const availableSlots: { start: string; end: string }[] = [];
  let currentStart = businessStart;

  for (const slot of bookedSlots) {
    if (currentStart < slot.start) {
      availableSlots.push({ start: currentStart, end: slot.start });
    }
    currentStart = slot.end > currentStart ? slot.end : currentStart;
  }

  if (currentStart < businessEnd) {
    availableSlots.push({ start: currentStart, end: businessEnd });
  }

  return availableSlots;
};
