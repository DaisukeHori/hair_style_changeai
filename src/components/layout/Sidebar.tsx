import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Scissors,
  Sparkles,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore, useUIStore } from '@/stores';
import { cn } from '@/utils/cn';
import { Avatar } from '@/components/common';

const navItems = [
  { icon: LayoutDashboard, label: 'ダッシュボード', path: '/stylist' },
  { icon: Users, label: '顧客管理', path: '/stylist/customers' },
  { icon: Calendar, label: '予約管理', path: '/stylist/appointments' },
  { icon: Scissors, label: '施術記録', path: '/stylist/visits' },
  { icon: Sparkles, label: 'スタイル提案', path: '/stylist/styles' },
];

const bottomItems = [
  { icon: Settings, label: '設定', path: '/stylist/settings' },
];

export const Sidebar = () => {
  const location = useLocation();
  const { stylist, salon } = useAuthStore();
  const { isSidebarCollapsed, setSidebarCollapsed } = useUIStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 bg-white border-r border-secondary-200 flex flex-col transition-all duration-300 z-40',
        isSidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-secondary-100">
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Scissors className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-secondary-900">
              {salon?.name || 'Hair Salon'}
            </span>
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          className="p-1.5 rounded-lg hover:bg-secondary-100 text-secondary-500"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive =
              item.path === '/stylist'
                ? location.pathname === '/stylist'
                : location.pathname.startsWith(item.path);

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                  )}
                >
                  <item.icon className={cn('h-5 w-5 flex-shrink-0')} />
                  {!isSidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-secondary-100 py-4">
        <ul className="space-y-1 px-2">
          {bottomItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 transition-colors"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isSidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-secondary-100">
        <div
          className={cn(
            'flex items-center gap-3',
            isSidebarCollapsed && 'justify-center'
          )}
        >
          <Avatar
            src={stylist?.profile_image_url}
            name={stylist?.name}
            size="sm"
          />
          {!isSidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate">
                {stylist?.name}
              </p>
              <p className="text-xs text-secondary-500 truncate">
                {stylist?.nickname || stylist?.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
