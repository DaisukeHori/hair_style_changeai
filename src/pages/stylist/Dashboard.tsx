import { Calendar, Users, Scissors, TrendingUp } from 'lucide-react';
import { Card, CardHeader, Badge, Avatar, Button } from '@/components/common';
import { useTodayAppointments } from '@/hooks';
import { formatTime, formatCustomerName } from '@/utils';

export const Dashboard = () => {
  const { data: todayAppointments, isLoading } = useTodayAppointments();

  const stats = [
    {
      icon: Calendar,
      label: '本日の予約',
      value: todayAppointments?.length || 0,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Users,
      label: '今月の新規顧客',
      value: 12,
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Scissors,
      label: '今月の施術数',
      value: 45,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: TrendingUp,
      label: '今月の売上',
      value: '¥320,000',
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">ダッシュボード</h1>
        <p className="text-secondary-500 mt-1">本日の予約状況と統計情報</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-secondary-500">{stat.label}</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader
          title="本日の予約"
          description={`${todayAppointments?.length || 0}件の予約があります`}
          action={
            <Button variant="outline" size="sm">
              すべて見る
            </Button>
          }
        />
        <div className="space-y-3">
          {isLoading ? (
            <p className="text-secondary-500 text-sm py-4 text-center">
              読み込み中...
            </p>
          ) : todayAppointments?.length === 0 ? (
            <p className="text-secondary-500 text-sm py-4 text-center">
              本日の予約はありません
            </p>
          ) : (
            todayAppointments?.slice(0, 5).map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={appointment.customer?.profile_photo_url}
                    name={formatCustomerName(
                      appointment.customer?.last_name,
                      appointment.customer?.first_name
                    )}
                    size="md"
                  />
                  <div>
                    <p className="font-medium text-secondary-900">
                      {formatCustomerName(
                        appointment.customer?.last_name,
                        appointment.customer?.first_name
                      )}
                    </p>
                    <p className="text-sm text-secondary-500">
                      {appointment.services
                        ?.map((s) => s.service_name)
                        .join(', ') || '施術未定'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-secondary-900">
                    {formatTime(appointment.start_time)}
                  </p>
                  <Badge
                    variant={
                      appointment.status === 'confirmed' ? 'success' : 'warning'
                    }
                    size="sm"
                  >
                    {appointment.status === 'confirmed' ? '確定' : '未確定'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-auto py-4 flex-col gap-2">
          <Users className="h-6 w-6" />
          <span>新規顧客登録</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2">
          <Calendar className="h-6 w-6" />
          <span>予約作成</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2">
          <Scissors className="h-6 w-6" />
          <span>施術開始</span>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2">
          <TrendingUp className="h-6 w-6" />
          <span>レポート</span>
        </Button>
      </div>
    </div>
  );
};
