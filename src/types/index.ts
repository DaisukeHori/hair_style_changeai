// Database Types
export * from './database';

// Common Types
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Filter Types
export interface CustomerFilters extends PaginationParams, SortParams {
  search?: string;
  gender?: string;
  hasAllergy?: boolean;
  lastVisitFrom?: string;
  lastVisitTo?: string;
}

export interface StyleFilters extends PaginationParams, SortParams {
  search?: string;
  hairLength?: string;
  genderTarget?: string;
  tags?: string[];
}

export interface AppointmentFilters extends PaginationParams, SortParams {
  stylistId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Form Types
export interface CustomerFormData {
  first_name: string;
  last_name: string;
  first_name_kana?: string;
  last_name_kana?: string;
  gender?: string;
  birth_date?: string;
  phone?: string;
  email?: string;
  line_id?: string;
  address?: string;
  occupation?: string;
  referral_source?: string;
  notes?: string;
}

export interface HairProfileFormData {
  hair_type?: string;
  hair_thickness?: string;
  hair_volume?: string;
  hair_damage_level?: number;
  scalp_type?: string;
  scalp_sensitivity?: number;
  gray_hair_percentage?: number;
  has_allergy?: boolean;
  allergy_items?: string[];
  allergy_notes?: string;
  notes?: string;
}

export interface VisitFormData {
  customer_id: string;
  stylist_id: string;
  visit_date: string;
  notes?: string;
}

export interface ServiceFormData {
  service_type: string;
  service_name: string;
  price?: number;
  duration_minutes?: number;
  details?: Record<string, unknown>;
  notes?: string;
}

export interface AppointmentFormData {
  customer_id: string;
  stylist_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  services?: Array<{
    service_type: string;
    service_name: string;
    estimated_duration: number;
    estimated_price?: number;
  }>;
  notes?: string;
}

// UI Types
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  type?: string;
  data?: unknown;
}

// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  stylist?: import('./database').Stylist;
}
