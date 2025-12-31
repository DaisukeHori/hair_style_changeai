import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks';
import { useUIStore } from '@/stores';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LoadingScreen } from '@/components/common';
import { ToastContainer } from '@/components/common/Toast';
import { cn } from '@/utils/cn';

export const StylistLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isSidebarCollapsed } = useUIStore();

  if (isLoading) {
    return <LoadingScreen message="認証情報を確認中..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Sidebar />
      <Header />

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          isSidebarCollapsed ? 'pl-16' : 'pl-64'
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
