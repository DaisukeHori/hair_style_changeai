import { Outlet } from 'react-router-dom';
import { Scissors, Heart, Clock, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { ToastContainer } from '@/components/common/Toast';

const navItems = [
  { icon: Scissors, label: 'スタイル', path: '/customer' },
  { icon: Heart, label: 'お気に入り', path: '/customer/favorites' },
  { icon: Clock, label: '履歴', path: '/customer/history' },
  { icon: User, label: 'マイページ', path: '/customer/mypage' },
];

export const CustomerLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200 h-14 flex items-center justify-center px-4 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Scissors className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-secondary-900">
            Style Simulator
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-secondary-200 h-16 z-40">
        <ul className="flex h-full">
          {navItems.map((item) => {
            const isActive =
              item.path === '/customer'
                ? location.pathname === '/customer'
                : location.pathname.startsWith(item.path);

            return (
              <li key={item.path} className="flex-1">
                <NavLink
                  to={item.path}
                  className={cn(
                    'flex flex-col items-center justify-center h-full gap-1 transition-colors',
                    isActive
                      ? 'text-primary-600'
                      : 'text-secondary-400 hover:text-secondary-600'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
