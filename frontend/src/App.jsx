import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import FarmerLayout from './layouts/FarmerLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FarmerDashboard from './pages/FarmerDashboard';
import WaterLogPage from './pages/WaterLogPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminFarmersPage from './pages/AdminFarmersPage';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  try {
    return (
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
          </Route>

          {/* Farmer Routes */}
          <Route
            element={
              <ProtectedRoute requiredRole='farmer'>
                <FarmerLayout />
              </ProtectedRoute>
            }
          >
            <Route path='/farmer/dashboard' element={<FarmerDashboard />} />
            <Route path='/farmer/water-log' element={<WaterLogPage />} />
            <Route path='/farmer/analytics' element={<AnalyticsPage />} />
            <Route path='/farmer/profile' element={<ProfilePage />} />
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute requiredRole='admin'>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path='/admin/dashboard' element={<AdminDashboard />} />
            <Route path='/admin/farmers' element={<AdminFarmersPage />} />
            <Route path='/admin/analytics' element={<AnalyticsPage />} />
          </Route>

          {/* Root redirect */}
          <Route path='/' element={<RootRedirect />} />

          {/* Catch all */}
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </Router>
    );
  } catch (error) {
    console.error('App Error:', error);
    return <div style={{ color: 'red', padding: '20px' }}>Error: {error.message}</div>;
  }
}

// Component to handle root redirect logic
function RootRedirect() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (user?.role === 'farmer') {
    return <Navigate to='/farmer/dashboard' replace />;
  }

  if (user?.role === 'admin') {
    return <Navigate to='/admin/dashboard' replace />;
  }

  return <Navigate to='/login' replace />;
}

export default App;
