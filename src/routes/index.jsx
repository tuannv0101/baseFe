import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import HostDashboard from '../pages/HostDashboard';
import TenantDashboard from '../pages/TenantDashboard';
import PlaceholderPage from '../pages/PlaceholderPage';
import { ROUTES, ROLES } from '../constants';
import useUserStore from '../store/useUserStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useUserStore();
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to their own dashboard if role not allowed
    const dashboardMap = {
      [ROLES.SUPER_ADMIN]: ROUTES.ADMIN_DASHBOARD,
      [ROLES.HOST]: ROUTES.HOST_DASHBOARD,
      [ROLES.TENANT]: ROUTES.TENANT_DASHBOARD,
    };
    return <Navigate to={dashboardMap[role]} replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          
          {/* Default redirect based on role or to login */}
          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

          {/* Super Admin Routes */}
          <Route path={ROUTES.ADMIN_DASHBOARD} element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.ADMIN_HOSTS} element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <PlaceholderPage title="Quản lý Chủ trọ" breadcrumbs={[{label: 'Admin'}, {label: 'Chủ trọ'}]} />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.ADMIN_SUBSCRIPTIONS} element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <PlaceholderPage title="Gói dịch vụ" breadcrumbs={[{label: 'Admin'}, {label: 'Gói dịch vụ'}]} />
            </ProtectedRoute>
          } />

          {/* Host Routes */}
          <Route path={ROUTES.HOST_DASHBOARD} element={
            <ProtectedRoute allowedRoles={[ROLES.HOST]}>
              <HostDashboard />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.HOST_ROOMS} element={
            <ProtectedRoute allowedRoles={[ROLES.HOST]}>
              <PlaceholderPage title="Tòa nhà & Phòng" breadcrumbs={[{label: 'Host'}, {label: 'Tòa nhà'}]} />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.HOST_TENANTS} element={
            <ProtectedRoute allowedRoles={[ROLES.HOST]}>
              <PlaceholderPage title="Khách thuê" breadcrumbs={[{label: 'Host'}, {label: 'Khách thuê'}]} />
            </ProtectedRoute>
          } />

          {/* Tenant Routes */}
          <Route path={ROUTES.TENANT_DASHBOARD} element={
            <ProtectedRoute allowedRoles={[ROLES.TENANT]}>
              <TenantDashboard />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.TENANT_INVOICES} element={
            <ProtectedRoute allowedRoles={[ROLES.TENANT]}>
              <PlaceholderPage title="Hóa đơn của tôi" breadcrumbs={[{label: 'Cư dân'}, {label: 'Hóa đơn'}]} />
            </ProtectedRoute>
          } />

          {/* Catch all fallback */}
          <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRoutes;
