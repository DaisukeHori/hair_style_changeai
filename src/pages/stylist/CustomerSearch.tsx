import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, AlertTriangle } from 'lucide-react';
import {
  Card,
  Button,
  Input,
  Avatar,
  Badge,
  LoadingScreen,
} from '@/components/common';
import { useCustomers } from '@/hooks';
import { useCustomerStore } from '@/stores';
import {
  formatCustomerName,
  formatPhoneNumber,
  formatRelativeTime,
} from '@/utils';

export const CustomerSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { filters, setFilters } = useCustomerStore();
  const { data, isLoading } = useCustomers({ ...filters, search: searchQuery });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">顧客管理</h1>
          <p className="text-secondary-500 mt-1">
            顧客の検索・登録・カルテ管理
          </p>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => navigate('/stylist/customers/new')}
        >
          新規登録
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="名前、電話番号、顧客番号で検索..."
            leftIcon={<Search className="h-4 w-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
          フィルター
        </Button>
      </div>

      {/* Customer List */}
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="space-y-3">
          {data?.data.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <p className="text-secondary-500">顧客が見つかりませんでした</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate('/stylist/customers/new')}
                >
                  新規登録する
                </Button>
              </div>
            </Card>
          ) : (
            data?.data.map((customer) => (
              <Card
                key={customer.id}
                hover
                onClick={() => navigate(`/stylist/customers/${customer.id}`)}
              >
                <div className="flex items-center gap-4">
                  <Avatar
                    src={customer.profile_photo_url}
                    name={formatCustomerName(
                      customer.last_name,
                      customer.first_name
                    )}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-secondary-900">
                        {formatCustomerName(
                          customer.last_name,
                          customer.first_name
                        )}
                      </h3>
                      {customer.customer_code && (
                        <span className="text-sm text-secondary-400">
                          #{customer.customer_code}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-secondary-500">
                      {customer.phone && (
                        <span>{formatPhoneNumber(customer.phone)}</span>
                      )}
                      <span>
                        最終来店: {formatRelativeTime(customer.updated_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* アレルギーバッジなどの表示 */}
                    <Badge variant="primary" size="sm">
                      来店 10回
                    </Badge>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={data.page === 1}
            onClick={() => setFilters({ page: data.page - 1 })}
          >
            前へ
          </Button>
          <span className="flex items-center px-4 text-sm text-secondary-600">
            {data.page} / {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={data.page === data.totalPages}
            onClick={() => setFilters({ page: data.page + 1 })}
          >
            次へ
          </Button>
        </div>
      )}
    </div>
  );
};
