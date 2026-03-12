export const ROUTES = {
  LOGIN: '/login',
  LOGIN_ADMIN: '/admin/login',
  LOGIN_HOST: '/host/login',
  LOGIN_TENANT: '/tenant/login',
  
  // Super Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_HOSTS: '/admin/hosts',
  ADMIN_SUBSCRIPTIONS: '/admin/subscriptions',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_TICKETS: '/admin/tickets',

  // Landlord/Host
  HOST_DASHBOARD: '/host',
  HOST_ROOMS: '/host/rooms',
  HOST_ROOM_DETAIL: '/host/rooms/:id',
  HOST_ROOM_EDIT: '/host/rooms/:id/edit',
  HOST_TENANTS: '/host/tenants',
  HOST_FINANCE: '/host/finance',
  HOST_STAFF: '/host/staff',
  HOST_SERVICES: '/host/services',
  HOST_CONTRACTS: '/host/contracts',
  HOST_CONTRACT_CREATE: '/host/contracts/create',

  // Tenant
  TENANT_DASHBOARD: '/tenant',
  TENANT_INVOICES: '/tenant/invoices',
  TENANT_MAINTENANCE: '/tenant/maintenance',
  TENANT_DOCUMENTS: '/tenant/documents',
};

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  HOST: 'HOST',
  TENANT: 'TENANT',
};
