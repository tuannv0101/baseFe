import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import HostDashboard from '../pages/HostDashboard';
import RoomMatrix from '../pages/RoomMatrix';
import RoomDetail from '../pages/RoomDetail';
import RoomEdit from '../pages/RoomEdit';
import Tenants from '../pages/Tenants';
import Services from '../pages/Services';
import TenantDashboard from '../pages/TenantDashboard';
import PlaceholderPage from '../pages/PlaceholderPage';
import { ROUTES, ROLES } from '../constants';
import useUserStore from '../store/useUserStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useUserStore();
  
  if (!isAuthenticated) {
    // Redirect to relevant login page based on path if possible, or default login
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
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
      <Routes>
        {/* Public Routes (Without MainLayout) */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.LOGIN_ADMIN} element={<Login forcedRole={ROLES.SUPER_ADMIN} />} />
        <Route path={ROUTES.LOGIN_HOST} element={<Login forcedRole={ROLES.HOST} />} />
        <Route path={ROUTES.LOGIN_TENANT} element={<Login forcedRole={ROLES.TENANT} />} />
        
        {/* Protected Routes (With MainLayout) */}
        <Route path="/" element={
          <MainLayout>
            <Navigate to={ROUTES.LOGIN} replace />
          </MainLayout>
        } />

        <Route path={ROUTES.ADMIN_DASHBOARD} element={
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
            <MainLayout><AdminDashboard /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.ADMIN_HOSTS} element={
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
            <MainLayout>
              <PlaceholderPage title="Quản lý Chủ trọ" breadcrumbs={[{label: 'Admin'}, {label: 'Chủ trọ'}]} />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.ADMIN_SUBSCRIPTIONS} element={
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
            <MainLayout>
              <PlaceholderPage title="Gói dịch vụ" breadcrumbs={[{label: 'Admin'}, {label: 'Gói dịch vụ'}]} />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path={ROUTES.HOST_DASHBOARD} element={
          <ProtectedRoute allowedRoles={[ROLES.HOST]}>
            <MainLayout><HostDashboard /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.HOST_ROOMS} element={
          <ProtectedRoute allowedRoles={[ROLES.HOST]}>
            <MainLayout>
              <RoomMatrix />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.HOST_ROOM_DETAIL} element={
          <ProtectedRoute allowedRoles={[ROLES.HOST]}>
            <MainLayout>
              <RoomDetail />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.HOST_ROOM_EDIT} element={
          <ProtectedRoute allowedRoles={[ROLES.HOST]}>
            <MainLayout>
              <RoomEdit />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.HOST_TENANTS} element={
          <ProtectedRoute allowedRoles={[ROLES.HOST]}>
            <MainLayout>
              <Tenants />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.HOST_SERVICES} element={
          <ProtectedRoute allowedRoles={[ROLES.HOST]}>
            <MainLayout>
              <Services />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path={ROUTES.TENANT_DASHBOARD} element={
          <ProtectedRoute allowedRoles={[ROLES.TENANT]}>
            <MainLayout><TenantDashboard /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path={ROUTES.TENANT_INVOICES} element={
          <ProtectedRoute allowedRoles={[ROLES.TENANT]}>
            <MainLayout>
              <PlaceholderPage title="Hóa đơn của tôi" breadcrumbs={[{label: 'Cư dân'}, {label: 'Hóa đơn'}]} />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
