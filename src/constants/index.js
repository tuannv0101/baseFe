export const ROUTES = {
  LOGIN: '/login',
  
  // Super Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_HOSTS: '/admin/hosts',
  ADMIN_SUBSCRIPTIONS: '/admin/subscriptions',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_TICKETS: '/admin/tickets',

  // Landlord/Host
  HOST_DASHBOARD: '/host',
  HOST_ROOMS: '/host/rooms',
  HOST_TENANTS: '/host/tenants',
  HOST_FINANCE: '/host/finance',
  HOST_STAFF: '/host/staff',
  HOST_SERVICES: '/host/services',

  // Tenant
  TENANT_DASHBOARD: '/tenant',
  TENANT_INVOICES: '/tenant/invoices',
  TENANT_MAINTENANCE: '/tenant/maintenance',
  TENANT_DOCUMENTS: '/tenant/documents',
};

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  HOST: 'host',
  TENANT: 'tenant',
};
