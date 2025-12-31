import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores';
import { toast } from '@/stores/uiStore';
import * as appointmentsApi from '@/services/api/appointments';
import type { AppointmentFilters, AppointmentFormValues } from '@/types';

// Query Keys
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters: AppointmentFilters) => [...appointmentKeys.lists(), filters] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
  today: (stylistId?: string) => [...appointmentKeys.all, 'today', stylistId] as const,
  availability: (stylistId: string, date: string) =>
    [...appointmentKeys.all, 'availability', stylistId, date] as const,
};

// 予約一覧フック
export const useAppointments = (filters?: AppointmentFilters) => {
  const salon = useAuthStore((s) => s.salon);

  return useQuery({
    queryKey: appointmentKeys.list(filters || {}),
    queryFn: () => appointmentsApi.getAppointments(salon?.id || '', filters),
    enabled: !!salon?.id,
  });
};

// 予約詳細フック
export const useAppointment = (appointmentId: string) => {
  return useQuery({
    queryKey: appointmentKeys.detail(appointmentId),
    queryFn: () => appointmentsApi.getAppointmentById(appointmentId),
    enabled: !!appointmentId,
  });
};

// 本日の予約フック
export const useTodayAppointments = (stylistId?: string) => {
  const salon = useAuthStore((s) => s.salon);

  return useQuery({
    queryKey: appointmentKeys.today(stylistId),
    queryFn: () => appointmentsApi.getTodayAppointments(salon?.id || '', stylistId),
    enabled: !!salon?.id,
    refetchInterval: 60000, // 1分ごとに更新
  });
};

// スタイリスト空き時間フック
export const useStylistAvailability = (stylistId: string, date: string) => {
  return useQuery({
    queryKey: appointmentKeys.availability(stylistId, date),
    queryFn: () => appointmentsApi.getStylistAvailability(stylistId, date),
    enabled: !!stylistId && !!date,
  });
};

// 予約作成フック
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AppointmentFormValues) =>
      appointmentsApi.createAppointment({
        ...data,
        status: 'pending',
        reminder_sent: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() });
      toast.success('予約を作成しました');
    },
    onError: (error) => {
      toast.error('予約の作成に失敗しました', error instanceof Error ? error.message : undefined);
    },
  });
};

// 予約更新フック
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AppointmentFormValues> }) =>
      appointmentsApi.updateAppointment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() });
      toast.success('予約を更新しました');
    },
    onError: (error) => {
      toast.error('更新に失敗しました', error instanceof Error ? error.message : undefined);
    },
  });
};

// 予約確定フック
export const useConfirmAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => appointmentsApi.confirmAppointment(appointmentId),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() });
      toast.success('予約を確定しました');
    },
    onError: (error) => {
      toast.error('確定に失敗しました', error instanceof Error ? error.message : undefined);
    },
  });
};

// 予約キャンセルフック
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => appointmentsApi.cancelAppointment(appointmentId),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() });
      toast.success('予約をキャンセルしました');
    },
    onError: (error) => {
      toast.error('キャンセルに失敗しました', error instanceof Error ? error.message : undefined);
    },
  });
};

// 予約完了フック
export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => appointmentsApi.completeAppointment(appointmentId),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() });
      toast.success('予約を完了しました');
    },
    onError: (error) => {
      toast.error('完了処理に失敗しました', error instanceof Error ? error.message : undefined);
    },
  });
};
