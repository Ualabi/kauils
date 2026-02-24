import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { CartProvider } from './contexts/CartProvider';

// Layout
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import SeedPage from './pages/SeedPage';

// Customer Pages
import CustomerHomePage from './pages/customer/CustomerHomePage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import TableManagementPage from './pages/staff/TableManagementPage';
import TogoTicketPage from './pages/staff/TogoTicketPage';

// Expo Pages
import ExpoPage from './pages/expo/ExpoPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="seed" element={<SeedPage />} />

            {/* Customer Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
              <Route path="menu" element={<CustomerHomePage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="orders" element={<MyOrdersPage />} />
            </Route>

            {/* Staff Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['staff', 'admin']} />}>
              <Route path="staff" element={<StaffDashboard />} />
              <Route path="staff/table/:tableNumber" element={<TableManagementPage />} />
              <Route path="staff/togo/:ticketId" element={<TogoTicketPage />} />
            </Route>

            {/* Expo Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['expo', 'admin']} />}>
              <Route path="expo" element={<ExpoPage />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="admin" element={<AdminDashboard />} />
            </Route>

            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
