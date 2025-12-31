import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Camera, Share2 } from 'lucide-react';
import { Button, Badge, LoadingScreen } from '@/components/common';
import { useStyle } from '@/hooks';
import { HAIR_LENGTH_OPTIONS } from '@/utils/constants';

export const StyleDetail = () => {
  const { styleId } = useParams<{ styleId: string }>();
  const navigate = useNavigate();
  const { data: style, isLoading } = useStyle(styleId || '');

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!style) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-secondary-500">スタイルが見つかりませんでした</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/customer')}
        >
          戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-14 z-30 bg-white/80 backdrop-blur-sm border-b border-secondary-100">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Image */}
      <div className="aspect-[3/4] w-full">
        <img
          src={style.image_url}
          alt={style.title || 'ヘアスタイル'}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-secondary-900">
            {style.title || 'ヘアスタイル'}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {style.hair_length && (
              <Badge variant="primary">
                {HAIR_LENGTH_OPTIONS.find((o) => o.value === style.hair_length)
                  ?.label}
              </Badge>
            )}
            {style.tags?.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {style.description && (
          <div>
            <h2 className="font-semibold text-secondary-900 mb-2">説明</h2>
            <p className="text-secondary-600">{style.description}</p>
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-6 py-4 border-t border-b border-secondary-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary-900">
              {style.view_count}
            </p>
            <p className="text-sm text-secondary-500">閲覧数</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary-900">
              {style.favorite_count}
            </p>
            <p className="text-sm text-secondary-500">お気に入り</p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-secondary-100">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            <Heart className="h-5 w-5 mr-2" />
            お気に入り
          </Button>
          <Button className="flex-1">
            <Camera className="h-5 w-5 mr-2" />
            試着してみる
          </Button>
        </div>
      </div>
    </div>
  );
};
