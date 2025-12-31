import { User, History, Heart, Settings, ChevronRight } from 'lucide-react';
import { Card, Avatar, Badge } from '@/components/common';

export const MyPage = () => {
  // デモ用のダミーデータ
  const customer = {
    name: '山田 花子',
    memberRank: 'ゴールド',
    points: 1250,
    visitCount: 15,
  };

  const menuItems = [
    { icon: User, label: 'プロフィール', path: '/customer/profile' },
    { icon: History, label: '施術履歴', path: '/customer/history' },
    { icon: Heart, label: 'お気に入り', path: '/customer/favorites' },
    { icon: Settings, label: '設定', path: '/customer/settings' },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Profile Card */}
      <Card>
        <div className="flex items-center gap-4">
          <Avatar name={customer.name} size="xl" />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-secondary-900">
              {customer.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="primary">{customer.memberRank}</Badge>
              <span className="text-sm text-secondary-500">
                来店 {customer.visitCount}回
              </span>
            </div>
          </div>
        </div>

        {/* Points */}
        <div className="mt-4 p-4 bg-primary-50 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary-700">保有ポイント</span>
            <span className="text-2xl font-bold text-primary-700">
              {customer.points.toLocaleString()} pt
            </span>
          </div>
        </div>
      </Card>

      {/* Menu */}
      <Card padding="none">
        <ul>
          {menuItems.map((item, index) => (
            <li key={item.path}>
              <button
                className={`w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-secondary-50 transition-colors ${
                  index !== menuItems.length - 1
                    ? 'border-b border-secondary-100'
                    : ''
                }`}
              >
                <item.icon className="h-5 w-5 text-secondary-400" />
                <span className="flex-1 font-medium text-secondary-900">
                  {item.label}
                </span>
                <ChevronRight className="h-5 w-5 text-secondary-300" />
              </button>
            </li>
          ))}
        </ul>
      </Card>

      {/* App Info */}
      <div className="text-center text-sm text-secondary-400">
        <p>Style Simulator v1.0.0</p>
      </div>
    </div>
  );
};
