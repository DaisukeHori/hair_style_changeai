import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
} from 'lucide-react';
import { Card, Button, Badge, Avatar, LoadingScreen } from '@/components/common';
import { useAppointments } from '@/hooks';
import { formatCustomerName, formatTime, formatDate } from '@/utils';

export const Appointments = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const { data, isLoading } = useAppointments({
    dateFrom: selectedDate,
    dateTo: selectedDate,
  });

  const goToPrevDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">確定</Badge>;
      case 'pending':
        return <Badge variant="warning">未確定</Badge>;
      case 'completed':
        return <Badge variant="default">完了</Badge>;
      case 'cancelled':
        return <Badge variant="error">キャンセル</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">予約管理</h1>
          <p className="text-secondary-500 mt-1">予約の確認・作成・管理</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>新規予約</Button>
      </div>

      {/* Date Navigation */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={goToPrevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-secondary-900">
              {formatDate(selectedDate, 'yyyy年M月d日 (E)')}
            </h2>
          </div>

          <Button variant="outline" size="sm" onClick={goToToday}>
            今日
          </Button>
        </div>
      </Card>

      {/* Appointments List */}
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="space-y-3">
          {data?.data.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-secondary-300 mx-auto" />
                <p className="text-secondary-500 mt-4">
                  この日の予約はありません
                </p>
                <Button variant="outline" className="mt-4">
                  予約を作成
                </Button>
              </div>
            </Card>
          ) : (
            data?.data.map((appointment) => (
              <Card
                key={appointment.id}
                hover
                onClick={() =>
                  navigate(`/stylist/appointments/${appointment.id}`)
                }
              >
                <div className="flex items-center gap-4">
                  {/* Time */}
                  <div className="w-20 text-center flex-shrink-0">
                    <p className="text-lg font-bold text-secondary-900">
                      {formatTime(appointment.start_time)}
                    </p>
                    <p className="text-sm text-secondary-500">
                      〜{formatTime(appointment.end_time)}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="w-1 h-16 bg-primary-200 rounded-full" />

                  {/* Customer Info */}
                  <div className="flex-1 flex items-center gap-4">
                    <Avatar
                      src={appointment.customer?.profile_photo_url}
                      name={formatCustomerName(
                        appointment.customer?.last_name,
                        appointment.customer?.first_name
                      )}
                      size="md"
                    />
                    <div>
                      <p className="font-semibold text-secondary-900">
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

                  {/* Stylist */}
                  <div className="flex items-center gap-2 text-sm text-secondary-600">
                    <User className="h-4 w-4" />
                    <span>{appointment.stylist?.name || '未割当'}</span>
                  </div>

                  {/* Status */}
                  {statusBadge(appointment.status)}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
