import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Stack, 
  Container, 
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  AdminPanelSettings, 
  HomeWork, 
  Person,
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import { ROUTES, ROLES } from '../constants';
import authService from '../services/authService';

const ROLE_CONFIGS = {
  [ROLES.SUPER_ADMIN]: {
    title: 'Quản Trị Viên',
    subtitle: 'Đăng nhập hệ thống quản trị',
    icon: <AdminPanelSettings />,
    color: '#1e3a8a',
    bg: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    demoEmail: 'admin'
  },
  [ROLES.HOST]: {
    title: 'Chủ Trọ / Quản Lý',
    subtitle: 'Quản lý tòa nhà và phòng trọ',
    icon: <HomeWork />,
    color: '#047857',
    bg: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
    demoEmail: 'host'
  },
  [ROLES.TENANT]: {
    title: 'Khách Thuê',
    subtitle: 'Xem thông tin phòng và hóa đơn',
    icon: <Person />,
    color: '#7c3aed',
    bg: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    demoEmail: 'tenant'
  }
};

const Login = ({ forcedRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useUserStore(state => state.login);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Determine role strictly based on URL path
  const getRoleFromPath = () => {
    const path = location.pathname;
    if (path.startsWith('/admin')) return ROLES.SUPER_ADMIN;
    if (path.startsWith('/host')) return ROLES.HOST;
    if (path.startsWith('/tenant')) return ROLES.TENANT;
    return ROLES.TENANT; // Mặc định là khách thuê nếu vào đường dẫn /login chung
  };

  const currentRole = forcedRole || getRoleFromPath();
  const config = ROLE_CONFIGS[currentRole];

  useEffect(() => {
    // Reset fields and set demo username based on role
    setUsername(config.demoEmail);
    setPassword('123456');
    setError('');
  }, [currentRole, config.demoEmail]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // API payload matches AuthRequest class
      const loginData = {
        username: username,
        password: password,
        role: currentRole
      };

      const data = await authService.login(loginData);
      
      // Linh hoạt bóc tách dữ liệu từ API
      const token = data.token || data.accessToken || data.data?.token;
      const user = data.user || data.data?.user || { username: username, role: currentRole };
      
      if (!token) {
        throw new Error('Không nhận được mã xác thực từ server');
      }
      
      login(user, token);
      
      const targetRoute = {
        [ROLES.SUPER_ADMIN]: ROUTES.ADMIN_DASHBOARD,
        [ROLES.HOST]: ROUTES.HOST_DASHBOARD,
        [ROLES.TENANT]: ROUTES.TENANT_DASHBOARD,
      }[currentRole];

      navigate(targetRoute);
    } catch (err) {
      console.error('Login error:', err);
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: config.bg,
      p: 2,
      transition: 'all 0.5s ease'
    }}>
      <Container maxWidth="sm">
        <Paper elevation={12} sx={{ p: 4, borderRadius: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar sx={{ m: '0 auto 16px', bgcolor: config.color, width: 64, height: 64 }}>
              {config.icon}
            </Avatar>
            <Typography variant="h4" fontWeight={800} sx={{ color: config.color }}>
              {config.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {config.subtitle}
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowPassword(!showPassword)} 
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                size="large" 
                disabled={loading}
                sx={{ 
                  py: 1.5, 
                  fontWeight: 700,
                  bgcolor: config.color,
                  '&:hover': { bgcolor: config.color, filter: 'brightness(0.9)' }
                }}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Bạn vào nhầm trang? <br />
              <Button size="small" onClick={() => navigate(ROUTES.LOGIN_ADMIN)}>Admin</Button>
              <Button size="small" onClick={() => navigate(ROUTES.LOGIN_HOST)}>Chủ trọ</Button>
              <Button size="small" onClick={() => navigate(ROUTES.LOGIN_TENANT)}>Khách thuê</Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
