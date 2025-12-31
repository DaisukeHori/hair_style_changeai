import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  Scissors,
  Heart,
  Camera,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  Button,
  Avatar,
  Badge,
  LoadingScreen,
} from '@/components/common';
import { useCustomer } from '@/hooks';
import {
  formatCustomerName,
  formatPhoneNumber,
  formatDate,
  calculateAge,
  formatCurrency,
} from '@/utils';
import {
  GENDER_OPTIONS,
  HAIR_TYPE_OPTIONS,
  HAIR_THICKNESS_OPTIONS,
  HAIR_VOLUME_OPTIONS,
  MEMBER_RANK_OPTIONS,
} from '@/utils/constants';

export const CustomerKarte = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading } = useCustomer(customerId || '');

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-500">顧客が見つかりませんでした</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate('/stylist/customers')}
        >
          一覧に戻る
        </Button>
      </div>
    );
  }

  const genderLabel = GENDER_OPTIONS.find(
    (g) => g.value === customer.gender
  )?.label;
  const age = calculateAge(customer.birth_date);
  const hairProfile = customer.hair_profile;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/stylist/customers')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">顧客カルテ</h1>
            <p className="text-secondary-500 mt-1">
              {formatCustomerName(customer.last_name, customer.first_name)}様の
              詳細情報
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Edit className="h-4 w-4" />}>
            編集
          </Button>
          <Button leftIcon={<Scissors className="h-4 w-4" />}>施術開始</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <div className="flex flex-col items-center text-center">
              <Avatar
                src={customer.profile_photo_url}
                name={formatCustomerName(customer.last_name, customer.first_name)}
                size="xl"
              />
              <h2 className="mt-4 text-xl font-bold text-secondary-900">
                {formatCustomerName(customer.last_name, customer.first_name)}
              </h2>
              {customer.customer_code && (
                <p className="text-sm text-secondary-400">
                  顧客番号: {customer.customer_code}
                </p>
              )}
              <div className="flex gap-2 mt-3">
                {genderLabel && (
                  <Badge variant="default" size="sm">
                    {genderLabel}
                  </Badge>
                )}
                {age && (
                  <Badge variant="default" size="sm">
                    {age}歳
                  </Badge>
                )}
                {customer.points && (
                  <Badge
                    variant={
                      customer.points.member_rank === 'platinum'
                        ? 'primary'
                        : 'default'
                    }
                    size="sm"
                  >
                    {MEMBER_RANK_OPTIONS.find(
                      (r) => r.value === customer.points?.member_rank
                    )?.label || 'ブロンズ'}
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {customer.phone && (
                <div className="flex items-center gap-3 text-secondary-600">
                  <Phone className="h-4 w-4" />
                  <span>{formatPhoneNumber(customer.phone)}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center gap-3 text-secondary-600">
                  <Mail className="h-4 w-4" />
                  <span>{customer.email}</span>
                </div>
              )}
              {customer.birth_date && (
                <div className="flex items-center gap-3 text-secondary-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(customer.birth_date)}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Alerts */}
          {hairProfile?.allergies?.has_allergy && (
            <Card className="border-red-200 bg-red-50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800">
                    アレルギー注意
                  </h3>
                  <p className="text-sm text-red-600 mt-1">
                    {hairProfile.allergies.items?.join(', ')}
                  </p>
                  {hairProfile.allergies.notes && (
                    <p className="text-sm text-red-600 mt-1">
                      {hairProfile.allergies.notes}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Hair Profile */}
          <Card>
            <CardHeader title="髪質情報" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-secondary-500">髪質</span>
                <p className="font-medium text-secondary-900">
                  {HAIR_TYPE_OPTIONS.find(
                    (t) => t.value === hairProfile?.hair_type
                  )?.label || '-'}
                </p>
              </div>
              <div>
                <span className="text-secondary-500">太さ</span>
                <p className="font-medium text-secondary-900">
                  {HAIR_THICKNESS_OPTIONS.find(
                    (t) => t.value === hairProfile?.hair_thickness
                  )?.label || '-'}
                </p>
              </div>
              <div>
                <span className="text-secondary-500">毛量</span>
                <p className="font-medium text-secondary-900">
                  {HAIR_VOLUME_OPTIONS.find(
                    (t) => t.value === hairProfile?.hair_volume
                  )?.label || '-'}
                </p>
              </div>
              <div>
                <span className="text-secondary-500">ダメージ</span>
                <p className="font-medium text-secondary-900">
                  {hairProfile?.hair_damage_level
                    ? `レベル${hairProfile.hair_damage_level}`
                    : '-'}
                </p>
              </div>
              <div>
                <span className="text-secondary-500">白髪率</span>
                <p className="font-medium text-secondary-900">
                  {hairProfile?.gray_hair_percentage
                    ? `${hairProfile.gray_hair_percentage}%`
                    : '-'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Center Column - Visit History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visit History */}
          <Card>
            <CardHeader
              title="来店履歴"
              description={`全${customer.visits?.length || 0}回`}
              action={
                <Button variant="outline" size="sm">
                  すべて見る
                </Button>
              }
            />
            <div className="space-y-4">
              {customer.visits?.length === 0 ? (
                <p className="text-secondary-500 text-sm text-center py-8">
                  来店履歴がありません
                </p>
              ) : (
                customer.visits?.slice(0, 5).map((visit) => (
                  <div
                    key={visit.id}
                    className="flex items-start gap-4 p-3 rounded-lg bg-secondary-50"
                  >
                    <div className="flex-shrink-0 w-20 text-center">
                      <p className="text-sm font-medium text-secondary-900">
                        {formatDate(visit.visit_date, 'M/d')}
                      </p>
                      <p className="text-xs text-secondary-500">
                        {formatDate(visit.visit_date, 'yyyy')}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">
                        カット・カラー
                      </p>
                      <p className="text-sm text-secondary-500 mt-0.5">
                        担当: スタイリスト名
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-secondary-900">
                        {formatCurrency(visit.total_amount)}
                      </p>
                      <Badge variant="success" size="sm">
                        完了
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Favorite Styles & Simulations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader
                title="お気に入りスタイル"
                action={
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                }
              />
              <div className="grid grid-cols-3 gap-2">
                {customer.favorite_styles?.slice(0, 6).map((fav) => (
                  <div
                    key={fav.id}
                    className="aspect-square rounded-lg bg-secondary-100 overflow-hidden"
                  >
                    <img
                      src={fav.hair_style?.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {(!customer.favorite_styles ||
                  customer.favorite_styles.length === 0) && (
                  <p className="col-span-3 text-sm text-secondary-500 text-center py-4">
                    お気に入りがありません
                  </p>
                )}
              </div>
            </Card>

            <Card>
              <CardHeader
                title="シミュレーション履歴"
                action={
                  <Button variant="ghost" size="sm">
                    <Camera className="h-4 w-4" />
                  </Button>
                }
              />
              <div className="grid grid-cols-3 gap-2">
                {customer.simulations?.slice(0, 6).map((sim) => (
                  <div
                    key={sim.id}
                    className="aspect-square rounded-lg bg-secondary-100 overflow-hidden"
                  >
                    <img
                      src={sim.simulated_photo_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {(!customer.simulations ||
                  customer.simulations.length === 0) && (
                  <p className="col-span-3 text-sm text-secondary-500 text-center py-4">
                    シミュレーション履歴がありません
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Notes */}
          {customer.notes && (
            <Card>
              <CardHeader title="メモ・特記事項" />
              <p className="text-secondary-700 whitespace-pre-wrap">
                {customer.notes}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
