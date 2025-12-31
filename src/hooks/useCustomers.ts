import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, useCustomerStore } from '@/stores';
import { toast } from '@/stores/uiStore';
import * as customersApi from '@/services/api/customers';
import type { Customer, CustomerFilters, CustomerFormValues, HairProfileFormValues } from '@/types';

// Query Keys
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters: CustomerFilters) => [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  search: (query: string) => [...customerKeys.all, 'search', query] as const,
};

// 顧客一覧フック
export const useCustomers = (filters?: CustomerFilters) => {
  const salon = useAuthStore((s) => s.salon);
  const storeFilters = useCustomerStore((s) => s.filters);
  const mergedFilters = { ...storeFilters, ...filters };

  return useQuery({
    queryKey: customerKeys.list(mergedFilters),
    queryFn: () => customersApi.getCustomers(salon?.id || '', mergedFilters),
    enabled: !!salon?.id,
  });
};

// 顧客詳細フック
export const useCustomer = (customerId: string) => {
  const { addRecentCustomer } = useCustomerStore();

  return useQuery({
    queryKey: customerKeys.detail(customerId),
    queryFn: async () => {
      const customer = await customersApi.getCustomerById(customerId);
      if (customer) {
        addRecentCustomer(customer);
      }
      return customer;
    },
    enabled: !!customerId,
  });
};

// 顧客検索フック
export const useCustomerSearch = (query: string) => {
  const salon = useAuthStore((s) => s.salon);

  return useQuery({
    queryKey: customerKeys.search(query),
    queryFn: () => customersApi.searchCustomers(salon?.id || '', query),
    enabled: !!salon?.id && query.length >= 2,
  });
};

// 顧客作成フック
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const salon = useAuthStore((s) => s.salon);

  return useMutation({
    mutationFn: (data: CustomerFormValues) =>
      customersApi.createCustomer(salon?.id || '', data as Omit<Customer, 'id' | 'salon_id' | 'created_at' | 'updated_at'>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success('顧客を登録しました');
    },
    onError: (error) => {
      toast.error('登録に失敗しました', error instanceof Error ? error.message : undefined);
    },
  });
};

// 顧客更新フック
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerFormValues> }) =>
      customersApi.updateCustomer(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success('顧客情報を更新しました');
    },
    onError: (error) => {
      toast.error('更新に失敗しました', error instanceof Error ? error.message : undefined);
    },
  });
};

// 顧客削除フック
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId: string) => customersApi.deleteCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      toast.success('顧客を削除しました');
    },
    onError: (error) => {
      toast.error('削除に失敗しました', error instanceof Error ? error.message : undefined);
    },
  });
};

// 髪質プロファイル更新フック
export const useUpdateHairProfile = () => {
  const queryClient = useQueryClient();
  const stylist = useAuthStore((s) => s.stylist);

  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: string; data: HairProfileFormValues }) =>
      customersApi.updateHairProfile(customerId, {
        hair_type: data.hair_type as 'straight' | 'wavy' | 'curly' | 'coily' | undefined,
        hair_thickness: data.hair_thickness as 'thin' | 'normal' | 'thick' | undefined,
        hair_volume: data.hair_volume as 'low' | 'normal' | 'high' | undefined,
        hair_damage_level: data.hair_damage_level,
        scalp_type: data.scalp_type as 'dry' | 'normal' | 'oily' | undefined,
        scalp_sensitivity: data.scalp_sensitivity,
        gray_hair_percentage: data.gray_hair_percentage,
        allergies: data.has_allergy
          ? {
              has_allergy: true,
              items: data.allergy_items || [],
              notes: data.allergy_notes,
            }
          : { has_allergy: false, items: [] },
        notes: data.notes,
      }, stylist?.id || ''),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(customerId) });
      toast.success('髪質情報を更新しました');
    },
    onError: (error) => {
      toast.error('更新に失敗しました', error instanceof Error ? error.message : undefined);
    },
  });
};
