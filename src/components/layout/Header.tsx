import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '@/hooks';
import { useUIStore } from '@/stores';
import { Avatar, Button } from '@/components/common';
import { cn } from '@/utils/cn';

export const Header = () => {
  const navigate = useNavigate();
  const { stylist, logout } = useAuth();
  const { isSidebarCollapsed } = useUIStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 h-16 bg-white border-b border-secondary-200 flex items-center justify-between px-6 z-30 transition-all duration-300',
        isSidebarCollapsed ? 'left-16' : 'left-64'
      )}
    >
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
          <input
            type="text"
            placeholder="顧客名、電話番号で検索..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-secondary-200 bg-secondary-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-secondary-100 text-secondary-600">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-secondary-100 transition-colors"
          >
            <Avatar
              src={stylist?.profile_image_url}
              name={stylist?.name}
              size="sm"
            />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-secondary-200 shadow-lg py-2 z-20">
                <div className="px-4 py-2 border-b border-secondary-100">
                  <p className="font-medium text-secondary-900">
                    {stylist?.name}
                  </p>
                  <p className="text-sm text-secondary-500">
                    {stylist?.nickname || stylist?.role}
                  </p>
                </div>
                <ul className="py-1">
                  <li>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/stylist/profile');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                    >
                      <User className="h-4 w-4" />
                      プロフィール
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/stylist/settings');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                    >
                      <Settings className="h-4 w-4" />
                      設定
                    </button>
                  </li>
                </ul>
                <div className="border-t border-secondary-100 pt-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    ログアウト
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
