import React, { useState } from 'react';
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
  Grid
} from '@mui/material';
import { 
  AdminPanelSettings, 
  HomeWork, 
  Person,
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
  SupportAgent as SupportAgentIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import { ROUTES, ROLES } from '../constants';

const DEMO_ACCOUNTS = [
  { email: 'admin@system.com', role: ROLES.SUPER_ADMIN, label: 'Super Admin', icon: <AdminPanelSettings /> },
  { email: 'lan.host@gmail.com', role: ROLES.HOST, label: 'Chủ trọ (Host)', icon: <HomeWork /> },
  { email: 'tu.tenant@gmail.com', role: ROLES.TENANT, label: 'Người thuê (Tenant)', icon: <Person /> },
];

const Login = () => {
  const navigate = useNavigate();
  const login = useUserStore(state => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const account = DEMO_ACCOUNTS.find(acc => acc.email === email && password === '123456');

    if (account) {
      const username = account.email.split('@')[0];
      login(username, account.role);
      
      const targetRoute = {
        [ROLES.SUPER_ADMIN]: ROUTES.ADMIN_DASHBOARD,
        [ROLES.HOST]: ROUTES.HOST_DASHBOARD,
        [ROLES.TENANT]: ROUTES.TENANT_DASHBOARD,
      }[account.role];

      navigate(targetRoute);
    } else {
      setError('Email hoặc mật khẩu không đúng (Gợi ý: MK là 123456)');
    }
  };

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword('123456');
    setError('');
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      p: 2
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Paper elevation={12} sx={{ p: 4, borderRadius: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar sx={{ m: '0 auto 16px', bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <HomeWork />
                </Avatar>
                <Typography variant="h4" fontWeight={800} color="primary">
                  Đăng Nhập
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Chào mừng bạn quay trở lại hệ thống!
                </Typography>
              </Box>

              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

              <form onSubmit={handleLogin}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Địa chỉ Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
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
                    sx={{ py: 1.5, fontWeight: 700 }}
                    startIcon={<LoginIcon />}
                  >
                    Đăng Nhập
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ color: 'white' }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Tài khoản dùng thử (Demo)
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, mb: 3 }}>
                Click vào tài khoản dưới đây để tự động điền thông tin và trải nghiệm từng vai trò:
              </Typography>

              <Stack spacing={2}>
                {DEMO_ACCOUNTS.map((acc) => (
                  <Paper 
                    key={acc.role}
                    onClick={() => fillDemo(acc)}
                    sx={{ 
                      p: 2, 
                      borderRadius: 3, 
                      cursor: 'pointer',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateX(10px)',
                        borderColor: 'white'
                      }
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
                        {acc.icon}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {acc.label}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          Email: {acc.email} | MK: 123456
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
