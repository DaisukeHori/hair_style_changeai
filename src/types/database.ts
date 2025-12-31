// Supabaseデータベース型定義
export interface Database {
  public: {
    Tables: {
      salons: {
        Row: Salon;
        Insert: Omit<Salon, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Salon, 'id'>>;
      };
      stylists: {
        Row: Stylist;
        Insert: Omit<Stylist, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Stylist, 'id'>>;
      };
      customers: {
        Row: Customer;
        Insert: Omit<Customer, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Customer, 'id'>>;
      };
      customer_hair_profiles: {
        Row: CustomerHairProfile;
        Insert: Omit<CustomerHairProfile, 'id'>;
        Update: Partial<Omit<CustomerHairProfile, 'id'>>;
      };
      visits: {
        Row: Visit;
        Insert: Omit<Visit, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Visit, 'id'>>;
      };
      visit_services: {
        Row: VisitService;
        Insert: Omit<VisitService, 'id' | 'created_at'>;
        Update: Partial<Omit<VisitService, 'id'>>;
      };
      visit_photos: {
        Row: VisitPhoto;
        Insert: Omit<VisitPhoto, 'id' | 'created_at'>;
        Update: Partial<Omit<VisitPhoto, 'id'>>;
      };
      hair_styles: {
        Row: HairStyle;
        Insert: Omit<HairStyle, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<HairStyle, 'id'>>;
      };
      customer_favorite_styles: {
        Row: CustomerFavoriteStyle;
        Insert: Omit<CustomerFavoriteStyle, 'id' | 'created_at'>;
        Update: Partial<Omit<CustomerFavoriteStyle, 'id'>>;
      };
      style_simulations: {
        Row: StyleSimulation;
        Insert: Omit<StyleSimulation, 'id' | 'created_at'>;
        Update: Partial<Omit<StyleSimulation, 'id'>>;
      };
      appointments: {
        Row: Appointment;
        Insert: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Appointment, 'id'>>;
      };
      customer_points: {
        Row: CustomerPoints;
        Insert: Omit<CustomerPoints, 'id'>;
        Update: Partial<Omit<CustomerPoints, 'id'>>;
      };
      point_transactions: {
        Row: PointTransaction;
        Insert: Omit<PointTransaction, 'id' | 'created_at'>;
        Update: Partial<Omit<PointTransaction, 'id'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      stylist_role: StylistRole;
      gender: Gender;
      hair_type: HairType;
      hair_thickness: HairThickness;
      hair_volume: HairVolume;
      scalp_type: ScalpType;
      visit_status: VisitStatus;
      service_type: ServiceType;
      photo_type: PhotoType;
      photo_angle: PhotoAngle;
      style_source: StyleSource;
      hair_length: HairLength;
      gender_target: GenderTarget;
      appointment_status: AppointmentStatus;
      member_rank: MemberRank;
      transaction_type: TransactionType;
    };
  };
}

// Enums
export type StylistRole = 'owner' | 'manager' | 'stylist' | 'assistant';
export type Gender = 'male' | 'female' | 'other';
export type HairType = 'straight' | 'wavy' | 'curly' | 'coily';
export type HairThickness = 'thin' | 'normal' | 'thick';
export type HairVolume = 'low' | 'normal' | 'high';
export type ScalpType = 'dry' | 'normal' | 'oily';
export type VisitStatus = 'reserved' | 'in_progress' | 'completed' | 'cancelled';
export type ServiceType = 'cut' | 'color' | 'perm' | 'treatment' | 'spa' | 'other';
export type PhotoType = 'before' | 'after' | 'process';
export type PhotoAngle = 'front' | 'side_left' | 'side_right' | 'back';
export type StyleSource = 'pinterest' | 'original' | 'stock';
export type HairLength = 'short' | 'medium' | 'long';
export type GenderTarget = 'male' | 'female' | 'unisex';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type MemberRank = 'bronze' | 'silver' | 'gold' | 'platinum';
export type TransactionType = 'earn' | 'redeem' | 'expire' | 'adjustment';

// Entity Types
export interface Salon {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  business_hours: BusinessHours | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  closed?: boolean;
}

export interface Stylist {
  id: string;
  salon_id: string;
  auth_user_id: string;
  name: string;
  nickname: string | null;
  role: StylistRole;
  profile_image_url: string | null;
  specialties: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  salon_id: string;
  customer_code: string | null;
  first_name: string;
  last_name: string;
  first_name_kana: string | null;
  last_name_kana: string | null;
  gender: Gender | null;
  birth_date: string | null;
  phone: string | null;
  email: string | null;
  line_id: string | null;
  address: string | null;
  occupation: string | null;
  referral_source: string | null;
  notes: string | null;
  profile_photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerHairProfile {
  id: string;
  customer_id: string;
  hair_type: HairType | null;
  hair_thickness: HairThickness | null;
  hair_volume: HairVolume | null;
  hair_damage_level: number | null;
  scalp_type: ScalpType | null;
  scalp_sensitivity: number | null;
  gray_hair_percentage: number | null;
  allergies: AllergyInfo | null;
  previous_chemical_treatments: ChemicalTreatment[] | null;
  notes: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface AllergyInfo {
  has_allergy: boolean;
  items: string[];
  notes?: string;
}

export interface ChemicalTreatment {
  type: string;
  date: string;
  product?: string;
  notes?: string;
}

export interface Visit {
  id: string;
  customer_id: string;
  stylist_id: string;
  visit_date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: VisitStatus;
  total_amount: number | null;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface VisitService {
  id: string;
  visit_id: string;
  service_type: ServiceType;
  service_name: string;
  price: number | null;
  duration_minutes: number | null;
  details: ServiceDetails | null;
  notes: string | null;
  created_at: string;
}

export interface ServiceDetails {
  color?: ColorDetails;
  perm?: PermDetails;
  treatment?: TreatmentDetails;
  cut?: CutDetails;
}

export interface ColorDetails {
  manufacturer: string;
  color_number: string;
  mix_ratio?: string;
  processing_time: number;
  developer_volume?: string;
}

export interface PermDetails {
  rod_size: string;
  solution: string;
  processing_time: number;
  technique?: string;
}

export interface TreatmentDetails {
  product_name: string;
  processing_time: number;
}

export interface CutDetails {
  length: string;
  style_name?: string;
  layers?: boolean;
  bangs?: string;
}

export interface VisitPhoto {
  id: string;
  visit_id: string;
  photo_type: PhotoType;
  photo_url: string;
  angle: PhotoAngle | null;
  notes: string | null;
  created_at: string;
}

export interface HairStyle {
  id: string;
  salon_id: string | null;
  source: StyleSource;
  source_url: string | null;
  image_url: string;
  title: string | null;
  description: string | null;
  tags: string[] | null;
  hair_length: HairLength | null;
  hair_color: HairColorInfo | null;
  face_shape_compatibility: string[] | null;
  gender_target: GenderTarget;
  is_active: boolean;
  view_count: number;
  favorite_count: number;
  created_at: string;
  updated_at: string;
}

export interface HairColorInfo {
  base_color: string;
  highlight?: string;
  lowlight?: string;
  technique?: string;
}

export interface CustomerFavoriteStyle {
  id: string;
  customer_id: string;
  hair_style_id: string;
  notes: string | null;
  created_at: string;
}

export interface StyleSimulation {
  id: string;
  customer_id: string;
  hair_style_id: string;
  original_photo_url: string;
  simulated_photo_url: string;
  is_liked: boolean | null;
  stylist_notes: string | null;
  created_at: string;
  created_by: string | null;
}

export interface Appointment {
  id: string;
  customer_id: string;
  stylist_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  services: AppointmentService[] | null;
  status: AppointmentStatus;
  reminder_sent: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AppointmentService {
  service_type: ServiceType;
  service_name: string;
  estimated_duration: number;
  estimated_price?: number;
}

export interface CustomerPoints {
  id: string;
  customer_id: string;
  points_balance: number;
  lifetime_points: number;
  member_rank: MemberRank;
  updated_at: string;
}

export interface PointTransaction {
  id: string;
  customer_id: string;
  visit_id: string | null;
  transaction_type: TransactionType;
  points: number;
  description: string | null;
  created_at: string;
}

// リレーション付きの型
export interface CustomerWithProfile extends Customer {
  hair_profile?: CustomerHairProfile;
}

export interface CustomerWithDetails extends Customer {
  hair_profile?: CustomerHairProfile;
  visits?: Visit[];
  favorite_styles?: (CustomerFavoriteStyle & { hair_style: HairStyle })[];
  simulations?: StyleSimulation[];
  points?: CustomerPoints;
}

export interface VisitWithDetails extends Visit {
  customer?: Customer;
  stylist?: Stylist;
  services?: VisitService[];
  photos?: VisitPhoto[];
}

export interface AppointmentWithDetails extends Appointment {
  customer?: Customer;
  stylist?: Stylist;
}
