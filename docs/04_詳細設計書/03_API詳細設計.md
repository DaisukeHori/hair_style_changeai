# 第3章 API詳細設計

## 3.1 APIクライアント設計

### 3.1.1 Supabaseクライアント

```typescript
// src/services/supabase.ts

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// 型付きクエリヘルパー
export type Tables = Database['public']['Tables'];
export type Customer = Tables['customers']['Row'];
export type Stylist = Tables['stylists']['Row'];
export type HairStyle = Tables['hair_styles']['Row'];
export type Visit = Tables['visits']['Row'];
```

### 3.1.2 APIサービス基底クラス

```typescript
// src/services/api/base.ts

import { supabase } from '@/services/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromPostgrestError(error: PostgrestError): ApiError {
    return new ApiError(
      error.message,
      error.code,
      error.details
    );
  }
}

export const handleResponse = <T>(
  data: T | null,
  error: PostgrestError | null
): T => {
  if (error) {
    throw ApiError.fromPostgrestError(error);
  }
  if (data === null) {
    throw new ApiError('Data not found', 'NOT_FOUND');
  }
  return data;
};
```

---

## 3.2 顧客API

### 3.2.1 顧客CRUD

```typescript
// src/services/api/customers.ts

import { supabase } from '@/services/supabase';
import { handleResponse, ApiError } from './base';
import type { Customer, CustomerFilters, CreateCustomerInput } from '@/types/customer';

/**
 * 顧客一覧取得
 */
export const getCustomers = async (
  filters: CustomerFilters
): Promise<{ data: Customer[]; count: number }> => {
  let query = supabase
    .from('customers')
    .select('*, customer_hair_profiles(*)', { count: 'exact' });

  // フィルタリング
  if (filters.search) {
    query = query.or(
      `last_name.ilike.%${filters.search}%,first_name.ilike.%${filters.search}%,last_name_kana.ilike.%${filters.search}%,first_name_kana.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
    );
  }

  if (filters.stylistId) {
    // 担当者で絞り込み（最終施術の担当者）
    query = query.eq('visits.stylist_id', filters.stylistId);
  }

  // ソート
  const sortColumn = filters.sortBy || 'last_visit_date';
  const sortOrder = filters.sortOrder || 'desc';
  query = query.order(sortColumn, { ascending: sortOrder === 'asc', nullsFirst: false });

  // ページネーション
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  return {
    data: handleResponse(data, error),
    count: count || 0,
  };
};

/**
 * 顧客詳細取得
 */
export const getCustomer = async (id: string): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .select(`
      *,
      customer_hair_profiles(*),
      visits(
        id,
        visit_date,
        status,
        total_amount,
        stylists(id, name),
        visit_services(*)
      ),
      style_simulations(
        id,
        simulated_photo_url,
        created_at,
        hair_styles(id, title, thumbnail_url)
      ),
      customer_favorite_styles(
        hair_styles(id, title, thumbnail_url)
      )
    `)
    .eq('id', id)
    .order('visit_date', { foreignTable: 'visits', ascending: false })
    .single();

  return handleResponse(data, error);
};

/**
 * 顧客登録
 */
export const createCustomer = async (
  input: CreateCustomerInput
): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .insert(input)
    .select()
    .single();

  return handleResponse(data, error);
};

/**
 * 顧客更新
 */
export const updateCustomer = async (
  id: string,
  input: Partial<Customer>
): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  return handleResponse(data, error);
};

/**
 * 顧客削除
 */
export const deleteCustomer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) {
    throw ApiError.fromPostgrestError(error);
  }
};
```

### 3.2.2 髪質プロファイルAPI

```typescript
// src/services/api/hairProfiles.ts

import { supabase } from '@/services/supabase';
import { handleResponse } from './base';
import type { HairProfile, UpdateHairProfileInput } from '@/types/customer';

/**
 * 髪質プロファイル更新
 */
export const updateHairProfile = async (
  customerId: string,
  input: UpdateHairProfileInput
): Promise<HairProfile> => {
  // upsert を使用（存在しない場合は作成）
  const { data, error } = await supabase
    .from('customer_hair_profiles')
    .upsert({
      customer_id: customerId,
      ...input,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  return handleResponse(data, error);
};
```

---

## 3.3 スタイルAPI

### 3.3.1 スタイルCRUD

```typescript
// src/services/api/styles.ts

import { supabase } from '@/services/supabase';
import { handleResponse } from './base';
import type { HairStyle, StyleFilters } from '@/types/style';

/**
 * スタイル一覧取得
 */
export const getStyles = async (
  filters: StyleFilters
): Promise<HairStyle[]> => {
  let query = supabase
    .from('hair_styles')
    .select('*')
    .eq('is_active', true);

  // フィルタリング
  if (filters.hairLength) {
    query = query.eq('hair_length', filters.hairLength);
  }

  if (filters.genderTarget) {
    query = query.in('gender_target', [filters.genderTarget, 'unisex']);
  }

  if (filters.tags && filters.tags.length > 0) {
    query = query.contains('tags', filters.tags);
  }

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  // ソート
  if (filters.sortBy === 'popular') {
    query = query.order('simulation_count', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  // ページネーション
  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
  }

  const { data, error } = await query;

  return handleResponse(data, error);
};

/**
 * スタイル詳細取得
 */
export const getStyle = async (id: string): Promise<HairStyle> => {
  const { data, error } = await supabase
    .from('hair_styles')
    .select('*')
    .eq('id', id)
    .single();

  // 閲覧数をインクリメント（非同期）
  supabase.rpc('increment_view_count', { style_id: id });

  return handleResponse(data, error);
};

/**
 * お気に入り追加
 */
export const addFavorite = async (
  customerId: string,
  styleId: string
): Promise<void> => {
  const { error } = await supabase
    .from('customer_favorite_styles')
    .insert({
      customer_id: customerId,
      hair_style_id: styleId,
    });

  if (error && error.code !== '23505') { // 重複エラー以外
    throw error;
  }
};

/**
 * お気に入り削除
 */
export const removeFavorite = async (
  customerId: string,
  styleId: string
): Promise<void> => {
  const { error } = await supabase
    .from('customer_favorite_styles')
    .delete()
    .eq('customer_id', customerId)
    .eq('hair_style_id', styleId);

  if (error) {
    throw error;
  }
};
```

---

## 3.4 シミュレーションAPI

### 3.4.1 Edge Function呼び出し

```typescript
// src/services/api/simulation.ts

import { supabase } from '@/services/supabase';
import type { SimulationRequest, SimulationResponse, SimulationStatus } from '@/types/simulation';

/**
 * シミュレーション作成
 */
export const createSimulation = async (
  request: SimulationRequest
): Promise<SimulationResponse> => {
  const { data, error } = await supabase.functions.invoke<SimulationResponse>(
    'simulation-create',
    {
      body: request,
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  return data!;
};

/**
 * シミュレーション状態取得
 */
export const getSimulationStatus = async (
  simulationId: string
): Promise<SimulationStatus> => {
  const { data, error } = await supabase.functions.invoke<SimulationStatus>(
    'simulation-status',
    {
      body: { simulation_id: simulationId },
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  return data!;
};

/**
 * 顧客のシミュレーション履歴取得
 */
export const getSimulationsByCustomer = async (
  customerId: string
): Promise<SimulationResult[]> => {
  const { data, error } = await supabase
    .from('style_simulations')
    .select(`
      *,
      hair_styles(id, title, thumbnail_url)
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
};
```

---

## 3.5 施術記録API

### 3.5.1 施術記録CRUD

```typescript
// src/services/api/visits.ts

import { supabase } from '@/services/supabase';
import { handleResponse } from './base';
import type { Visit, CreateVisitInput, VisitService } from '@/types/visit';

/**
 * 施術記録一覧取得
 */
export const getVisitsByCustomer = async (
  customerId: string
): Promise<Visit[]> => {
  const { data, error } = await supabase
    .from('visits')
    .select(`
      *,
      stylists(id, name),
      visit_services(*),
      visit_photos(*)
    `)
    .eq('customer_id', customerId)
    .order('visit_date', { ascending: false });

  return handleResponse(data, error);
};

/**
 * 施術記録詳細取得
 */
export const getVisit = async (id: string): Promise<Visit> => {
  const { data, error } = await supabase
    .from('visits')
    .select(`
      *,
      customers(id, first_name, last_name, profile_photo_url),
      stylists(id, name),
      visit_services(*),
      visit_photos(*)
    `)
    .eq('id', id)
    .single();

  return handleResponse(data, error);
};

/**
 * 施術記録作成
 */
export const createVisit = async (
  input: CreateVisitInput
): Promise<Visit> => {
  // トランザクション的に処理
  const { services, photos, ...visitData } = input;

  // 1. Visit作成
  const { data: visit, error: visitError } = await supabase
    .from('visits')
    .insert(visitData)
    .select()
    .single();

  if (visitError) throw visitError;

  // 2. Services作成
  if (services && services.length > 0) {
    const servicesWithVisitId = services.map((s) => ({
      ...s,
      visit_id: visit.id,
    }));

    const { error: servicesError } = await supabase
      .from('visit_services')
      .insert(servicesWithVisitId);

    if (servicesError) throw servicesError;
  }

  // 3. Photos作成
  if (photos && photos.length > 0) {
    const photosWithVisitId = photos.map((p) => ({
      ...p,
      visit_id: visit.id,
    }));

    const { error: photosError } = await supabase
      .from('visit_photos')
      .insert(photosWithVisitId);

    if (photosError) throw photosError;
  }

  return getVisit(visit.id);
};

/**
 * 施術記録更新
 */
export const updateVisit = async (
  id: string,
  input: Partial<Visit>
): Promise<Visit> => {
  const { data, error } = await supabase
    .from('visits')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  return handleResponse(data, error);
};
```

---

## 3.6 画像アップロードAPI

### 3.6.1 Storage操作

```typescript
// src/services/api/storage.ts

import { supabase } from '@/services/supabase';

interface UploadResult {
  path: string;
  url: string;
}

/**
 * 顧客写真アップロード
 */
export const uploadCustomerPhoto = async (
  salonId: string,
  customerId: string,
  file: File,
  type: 'profile' | 'simulation'
): Promise<UploadResult> => {
  const ext = file.name.split('.').pop();
  const fileName = type === 'profile'
    ? `${salonId}/${customerId}/profile.${ext}`
    : `${salonId}/${customerId}/simulation/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from('customer-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: type === 'profile',
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('customer-photos')
    .getPublicUrl(data.path);

  return {
    path: data.path,
    url: publicUrl,
  };
};

/**
 * 施術写真アップロード
 */
export const uploadVisitPhoto = async (
  salonId: string,
  visitId: string,
  file: File,
  type: 'before' | 'after' | 'process',
  angle: 'front' | 'side_left' | 'side_right' | 'back'
): Promise<UploadResult> => {
  const ext = file.name.split('.').pop();
  const fileName = `${salonId}/${visitId}/${type}_${angle}.${ext}`;

  const { data, error } = await supabase.storage
    .from('visit-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;

  // 署名付きURL取得（1時間有効）
  const { data: signedData } = await supabase.storage
    .from('visit-photos')
    .createSignedUrl(data.path, 3600);

  return {
    path: data.path,
    url: signedData?.signedUrl || '',
  };
};

/**
 * 署名付きURL取得
 */
export const getSignedUrl = async (
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) throw error;

  return data.signedUrl;
};
```
