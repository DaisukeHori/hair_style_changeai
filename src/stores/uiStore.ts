import { create } from 'zustand';
import type { ToastMessage, ModalState } from '@/types';

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;

  // Toast
  toasts: ToastMessage[];

  // Modal
  modal: ModalState;

  // Loading
  globalLoading: boolean;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  openModal: (type: string, data?: unknown) => void;
  closeModal: () => void;

  setGlobalLoading: (loading: boolean) => void;
}

let toastIdCounter = 0;

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isSidebarCollapsed: false,
  toasts: [],
  modal: { isOpen: false },
  globalLoading: false,

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),

  setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),

  addToast: (toast) => {
    const id = `toast-${++toastIdCounter}`;
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto remove
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newToast.duration);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),

  openModal: (type, data) =>
    set({
      modal: { isOpen: true, type, data },
    }),

  closeModal: () =>
    set({
      modal: { isOpen: false },
    }),

  setGlobalLoading: (globalLoading) => set({ globalLoading }),
}));

// トースト用ヘルパー関数
export const toast = {
  success: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'success', title, message }),
  error: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'error', title, message }),
  warning: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'warning', title, message }),
  info: (title: string, message?: string) =>
    useUIStore.getState().addToast({ type: 'info', title, message }),
};
