import { create } from 'zustand';
import type { Customer, CustomerWithDetails, CustomerFilters } from '@/types';

interface CustomerState {
  // 選択中の顧客
  selectedCustomer: CustomerWithDetails | null;

  // 検索フィルター
  filters: CustomerFilters;

  // 最近閲覧した顧客
  recentCustomers: Customer[];

  // Actions
  setSelectedCustomer: (customer: CustomerWithDetails | null) => void;
  setFilters: (filters: Partial<CustomerFilters>) => void;
  resetFilters: () => void;
  addRecentCustomer: (customer: Customer) => void;
  clearRecentCustomers: () => void;
}

const DEFAULT_FILTERS: CustomerFilters = {
  page: 1,
  pageSize: 20,
  sortBy: 'updated_at',
  sortOrder: 'desc',
};

const MAX_RECENT_CUSTOMERS = 10;

export const useCustomerStore = create<CustomerState>((set) => ({
  selectedCustomer: null,
  filters: DEFAULT_FILTERS,
  recentCustomers: [],

  setSelectedCustomer: (selectedCustomer) => set({ selectedCustomer }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  addRecentCustomer: (customer) =>
    set((state) => {
      const filtered = state.recentCustomers.filter((c) => c.id !== customer.id);
      return {
        recentCustomers: [customer, ...filtered].slice(0, MAX_RECENT_CUSTOMERS),
      };
    }),

  clearRecentCustomers: () => set({ recentCustomers: [] }),
}));
