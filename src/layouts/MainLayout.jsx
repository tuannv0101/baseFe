import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  useTheme,
  Paper, // Đã bổ sung Paper vào đây
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  HomeWork as HomeWorkIcon,
  ReceiptLong as ReceiptLongIcon,
  Settings as SettingsIcon,
  SupportAgent as SupportAgentIcon,
  Subscriptions as SubscriptionsIcon,
  Build as BuildIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Logout,
  Engineering,
  GroupAdd,
  Payment,
  ReportProblem,
  InsertDriveFile,
} from '@mui/icons-material';
import useUserStore from '../store/useUserStore';
import { ROUTES, ROLES } from '../constants';

const drawerWidth = 260;

const getMenuItems = (role) => {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return [
        { title: 'Tổng quan Admin', icon: <DashboardIcon />, path: ROUTES.ADMIN_DASHBOARD },
        { title: 'Quản lý Chủ trọ', icon: <GroupAdd />, path: ROUTES.ADMIN_HOSTS },
        { title: 'Gói dịch vụ', icon: <SubscriptionsIcon />, path: ROUTES.ADMIN_SUBSCRIPTIONS },
        { title: 'Yêu cầu Hỗ trợ', icon: <SupportAgentIcon />, path: ROUTES.ADMIN_TICKETS },
        { title: 'Cấu hình hệ thống', icon: <SettingsIcon />, path: ROUTES.ADMIN_SETTINGS },
      ];
    case ROLES.HOST:
      return [
        { title: 'Tổng quan Host', icon: <DashboardIcon />, path: ROUTES.HOST_DASHBOARD },
        { title: 'Tòa nhà & Phòng', icon: <HomeWorkIcon />, path: ROUTES.HOST_ROOMS },
        { title: 'Khách thuê', icon: <PeopleIcon />, path: ROUTES.HOST_TENANTS },
        { title: 'Hop dong thue', icon: <DescriptionIcon />, path: ROUTES.HOST_CONTRACTS },
        { title: 'Dịch vụ & Tiện ích', icon: <BuildIcon />, path: ROUTES.HOST_SERVICES },
        { title: 'Tài chính', icon: <Payment />, path: ROUTES.HOST_FINANCE },
        { title: 'Nhân viên', icon: <Engineering />, path: ROUTES.HOST_STAFF },
      ];
    case ROLES.TENANT:
      return [
        { title: 'Trang chủ', icon: <DashboardIcon />, path: ROUTES.TENANT_DASHBOARD },
        { title: 'Hóa đơn của tôi', icon: <ReceiptLongIcon />, path: ROUTES.TENANT_INVOICES },
        { title: 'Báo cáo sự cố', icon: <ReportProblem />, path: ROUTES.TENANT_MAINTENANCE },
        { title: 'Tiện ích & Nội quy', icon: <InsertDriveFile />, path: ROUTES.TENANT_DOCUMENTS },
      ];
    default:
      return [];
  }
};

const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user, role, logout, isAuthenticated } = useUserStore();
  const menuItems = getMenuItems(role);

  if (!isAuthenticated || location.pathname === ROUTES.LOGIN) {
    return <>{children}</>;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: [1] }}>
        <Typography variant="h6" fontWeight={800} color="primary" sx={{ letterSpacing: 1 }}>
          RENTAL MANAGER
        </Typography>
      </Toolbar>
      <Box sx={{ px: 2, mb: 2 }}>
         <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, textTransform: 'uppercase' }}>
              VAI TRÒ: {role?.replace('_', ' ')}
            </Typography>
         </Paper>
      </Box>
      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  bgcolor: isSelected ? 'primary.main' : 'transparent',
                  color: isSelected ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: isSelected ? 'primary.main' : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isSelected ? 'white' : 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} primaryTypographyProps={{ fontWeight: isSelected ? 600 : 500, fontSize: '0.9rem' }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" fontWeight={700} sx={{ display: { xs: 'none', sm: 'block' } }}>
            {menuItems.find(item => item.path === location.pathname)?.title || 'Hệ thống'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" fontWeight={600}>{user?.username}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
            </Box>
            <Tooltip title="Tài khoản">
              <IconButton onClick={handleMenuOpen} size="small">
                <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontWeight: 700 }}>
                  {user?.avatar}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                Thông tin cá nhân
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #e2e8f0' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px', width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
