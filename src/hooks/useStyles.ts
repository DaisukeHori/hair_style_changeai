import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/stores/uiStore';
import * as stylesApi from '@/services/api/styles';
import type { StyleFilters } from '@/types';

// Query Keys
export const styleKeys = {
  all: ['styles'] as const,
  lists: () => [...styleKeys.all, 'list'] as const,
  list: (filters: StyleFilters) => [...styleKeys.lists(), filters] as const,
  details: () => [...styleKeys.all, 'detail'] as const,
  detail: (id: string) => [...styleKeys.details(), id] as const,
  popular: () => [...styleKeys.all, 'popular'] as const,
  recommended: (customerId: string) => [...styleKeys.all, 'recommended', customerId] as const,
  favorites: (customerId: string) => [...styleKeys.all, 'favorites', customerId] as const,
};

// スタイル一覧フック
export const useStyles = (filters?: StyleFilters) => {
  return useQuery({
    queryKey: styleKeys.list(filters || {}),
    queryFn: () => stylesApi.getStyles(filters),
  });
};

// スタイル詳細フック
export const useStyle = (styleId: string) => {
  return useQuery({
    queryKey: styleKeys.detail(styleId),
    queryFn: async () => {
      // 閲覧数をインクリメント
      await stylesApi.incrementViewCount(styleId);
      return stylesApi.getStyleById(styleId);
    },
    enabled: !!styleId,
  });
};

// 人気スタイルフック
export const usePopularStyles = (limit?: number) => {
  return useQuery({
    queryKey: styleKeys.popular(),
    queryFn: () => stylesApi.getPopularStyles(limit),
  });
};

// おすすめスタイルフック
export const useRecommendedStyles = (customerId: string, limit?: number) => {
  return useQuery({
    queryKey: styleKeys.recommended(customerId),
    queryFn: () => stylesApi.getRecommendedStyles(customerId, limit),
    enabled: !!customerId,
  });
};

// お気に入りスタイルフック
export const useFavoriteStyles = (customerId: string) => {
  return useQuery({
    queryKey: styleKeys.favorites(customerId),
    queryFn: () => stylesApi.getCustomerFavoriteStyles(customerId),
    enabled: !!customerId,
  });
};

// お気に入り追加フック
export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      styleId,
      notes,
    }: {
      customerId: string;
      styleId: string;
      notes?: string;
    }) => stylesApi.addFavoriteStyle(customerId, styleId, notes),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: styleKeys.favorites(customerId) });
      toast.success('お気に入りに追加しました');
    },
    onError: (error) => {
      toast.error('追加に失敗しました', error instanceof Error ? error.message : undefined);
    },
  });
};

// お気に入り削除フック
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, styleId }: { customerId: string; styleId: string }) =>
      stylesApi.removeFavoriteStyle(customerId, styleId),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: styleKeys.favorites(customerId) });
      toast.success('お気に入りから削除しました');
    },
    onError: (error) => {
      toast.error('削除に失敗しました', error instanceof Error ? error.message : undefined);
    },
  });
};
