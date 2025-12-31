import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, TrendingUp, Star } from 'lucide-react';
import { Card, Input, Button, Badge, LoadingScreen } from '@/components/common';
import { useStyles, usePopularStyles } from '@/hooks';
import { HAIR_LENGTH_OPTIONS } from '@/utils/constants';

export const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLength, setSelectedLength] = useState<string | null>(null);

  const { data: styles, isLoading } = useStyles({
    search: searchQuery,
    hairLength: selectedLength || undefined,
  });

  const { data: popularStyles } = usePopularStyles(6);

  return (
    <div className="pb-6">
      {/* Search Header */}
      <div className="sticky top-14 z-30 bg-secondary-50 pb-4 pt-4 px-4">
        <Input
          placeholder="スタイルを検索..."
          leftIcon={<Search className="h-4 w-4" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Length Filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          <Button
            variant={selectedLength === null ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedLength(null)}
          >
            すべて
          </Button>
          {HAIR_LENGTH_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={selectedLength === option.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedLength(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Popular Styles */}
      {!searchQuery && !selectedLength && popularStyles && (
        <section className="px-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-bold text-secondary-900">
              人気スタイル
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {popularStyles.map((style) => (
              <div
                key={style.id}
                className="aspect-[3/4] rounded-xl overflow-hidden cursor-pointer relative group"
                onClick={() => navigate(`/customer/styles/${style.id}`)}
              >
                <img
                  src={style.image_url}
                  alt={style.title || 'ヘアスタイル'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-xs font-medium truncate">
                    {style.title || 'ヘアスタイル'}
                  </p>
                  <div className="flex items-center gap-1 text-white/80 text-xs">
                    <Star className="h-3 w-3 fill-current" />
                    <span>{style.favorite_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Styles */}
      <section className="px-4">
        <h2 className="text-lg font-bold text-secondary-900 mb-3">
          {searchQuery || selectedLength ? '検索結果' : 'すべてのスタイル'}
        </h2>

        {isLoading ? (
          <LoadingScreen />
        ) : styles?.data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary-500">
              スタイルが見つかりませんでした
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {styles?.data.map((style) => (
              <div
                key={style.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-secondary-100 cursor-pointer"
                onClick={() => navigate(`/customer/styles/${style.id}`)}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={style.image_url}
                    alt={style.title || 'ヘアスタイル'}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-3">
                  <p className="font-medium text-secondary-900 truncate">
                    {style.title || 'ヘアスタイル'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {style.hair_length && (
                      <Badge variant="default" size="sm">
                        {HAIR_LENGTH_OPTIONS.find(
                          (o) => o.value === style.hair_length
                        )?.label}
                      </Badge>
                    )}
                    {style.tags?.slice(0, 1).map((tag) => (
                      <Badge key={tag} variant="primary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
