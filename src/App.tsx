import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import { StylistLayout, CustomerLayout } from '@/components/layout';

// Pages
import { Login } from '@/pages/Login';
import {
  Dashboard,
  CustomerSearch,
  CustomerKarte,
  Appointments,
} from '@/pages/stylist';
import { Home, StyleDetail, MyPage } from '@/pages/customer';

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Stylist Routes */}
          <Route path="/stylist" element={<StylistLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<CustomerSearch />} />
            <Route path="customers/:customerId" element={<CustomerKarte />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="visits" element={<div>施術記録（準備中）</div>} />
            <Route path="styles" element={<div>スタイル提案（準備中）</div>} />
            <Route path="settings" element={<div>設定（準備中）</div>} />
          </Route>

          {/* Customer Routes */}
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<Home />} />
            <Route path="styles/:styleId" element={<StyleDetail />} />
            <Route path="favorites" element={<div className="p-4">お気に入り（準備中）</div>} />
            <Route path="history" element={<div className="p-4">履歴（準備中）</div>} />
            <Route path="mypage" element={<MyPage />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/stylist" replace />} />
          <Route path="*" element={<Navigate to="/stylist" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
