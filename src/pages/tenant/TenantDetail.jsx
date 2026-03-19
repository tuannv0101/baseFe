import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Divider,
  Button,
  Stack,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit,
  Phone,
  Email,
  Badge,
  Home,
  History,
  Description,
  Payments,
  ArrowBack,
  CalendarMonth,
  LocationOn,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants';

// For now using mock, but in real app would fetch by ID
const mockTenantDetail = {
  id: 1,
  fullName: 'Nguyễn Văn A',
  email: 'vana@gmail.com',
  phone: '0901234567',
  idCard: '012345678901',
  dob: '1995-05-20',
  address: 'Hà Nội',
  status: 'active',
  room: {
    id: 101,
    number: '101',
    building: 'Tòa nhà A',
    price: 4500000,
  },
  contracts: [
    { id: 'C001', startDate: '2023-01-01', endDate: '2024-01-01', status: 'expired' },
    { id: 'C005', startDate: '2024-01-01', endDate: '2025-01-01', status: 'active' },
  ],
  invoices: [
    { id: 'INV-03', month: '03/2026', total: 4750000, status: 'unpaid' },
    { id: 'INV-02', month: '02/2026', total: 4680000, status: 'paid' },
  ]
};

const TenantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API fetch
    setLoading(true);
    setTimeout(() => {
      setTenant(mockTenantDetail);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!tenant) {
    return <Alert severity="error">Không tìm thấy thông tin khách thuê</Alert>;
  }

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader 
        title="Chi tiết Khách thuê" 
        breadcrumbs={[{ label: 'Khách thuê', path: ROUTES.HOST_TENANTS }, { label: tenant.fullName }]}
        action={{
          label: 'Chỉnh sửa hồ sơ',
          icon: <Edit />,
          onClick: () => navigate(ROUTES.HOST_TENANT_EDIT.replace(':id', id))
        }}
      />

      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        {/* Profile Info Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                mx: 'auto', 
                mb: 3, 
                bgcolor: 'primary.main', 
                fontSize: '3rem',
                boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)'
              }}
            >
              {tenant.fullName.charAt(0)}
            </Avatar>
            <Typography variant="h5" fontWeight={800} gutterBottom>{tenant.fullName}</Typography>
            <Chip 
              label={tenant.status === 'active' ? 'Đang thuê' : 'Đã rời đi'} 
              color={tenant.status === 'active' ? 'success' : 'default'}
              sx={{ fontWeight: 600, px: 1 }}
            />
            
            <Divider sx={{ my: 4 }} />
            
            <Stack spacing={2.5} sx={{ textAlign: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'grey.100', color: 'text.secondary', width: 40, height: 40 }}>
                  <Phone fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">Số điện thoại</Typography>
                  <Typography variant="body2" fontWeight={600}>{tenant.phone}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'grey.100', color: 'text.secondary', width: 40, height: 40 }}>
                  <Email fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="body2" fontWeight={600}>{tenant.email}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'grey.100', color: 'text.secondary', width: 40, height: 40 }}>
                  <Badge fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">Số CCCD</Typography>
                  <Typography variant="body2" fontWeight={600}>{tenant.idCard}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'grey.100', color: 'text.secondary', width: 40, height: 40 }}>
                  <LocationOn fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">Địa chỉ</Typography>
                  <Typography variant="body2" fontWeight={600}>{tenant.address}</Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Details & History */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Current Occupancy Information */}
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <Home color="primary" /> Thông tin thuê hiện tại
                </Typography>
                <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">Tòa nhà</Typography>
                    <Typography variant="body1" fontWeight={700}>{tenant.room.building}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">Số phòng</Typography>
                    <Typography variant="body1" fontWeight={700} color="primary.main">P.{tenant.room.number}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">Giá thuê</Typography>
                    <Typography variant="body1" fontWeight={700}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tenant.room.price)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">Ngày dọn vào</Typography>
                    <Typography variant="body1" fontWeight={700}>01/01/2024</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* History Section */}
            <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 1 }}>
                <History color="primary" />
                <Typography variant="h6" fontWeight={700}>Lịch sử hoạt động</Typography>
              </Box>
              <Grid container spacing={0} sx={{ width: '100%', m: 0 }}>
                {/* Contracts Column */}
                <Grid size={{ xs: 12, sm: 6 }} sx={{ borderRight: { sm: '1px solid #f0f0f0' } }}>
                   <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                     <Typography variant="subtitle2" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                       <Description fontSize="small" color="action" /> Hợp đồng
                     </Typography>
                   </Box>
                   <List sx={{ p: 0 }}>
                     {tenant.contracts.map((c, index) => (
                       <React.Fragment key={c.id}>
                         <ListItem sx={{ py: 2 }}>
                           <ListItemText 
                             primary={<Typography variant="body2" fontWeight={700}>Hợp đồng #{c.id}</Typography>} 
                             secondary={
                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                 <CalendarMonth sx={{ fontSize: '0.9rem' }} color="disabled" />
                                 <Typography variant="caption">{c.startDate} - {c.endDate}</Typography>
                               </Box>
                             }
                           />
                           <Chip 
                             label={c.status === 'active' ? 'Còn hạn' : 'Hết hạn'} 
                             size="small" 
                             color={c.status === 'active' ? 'success' : 'default'}
                             variant="outlined"
                             sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                           />
                         </ListItem>
                         {index < tenant.contracts.length - 1 && <Divider component="li" />}
                       </React.Fragment>
                     ))}
                   </List>
                </Grid>

                {/* Invoices Column */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Payments fontSize="small" color="action" /> Hóa đơn gần đây
                    </Typography>
                  </Box>
                  <List sx={{ p: 0 }}>
                    {tenant.invoices.map((inv, index) => (
                      <React.Fragment key={inv.id}>
                        <ListItem sx={{ py: 2 }}>
                           <ListItemText 
                             primary={<Typography variant="body2" fontWeight={700}>Tháng {inv.month}</Typography>} 
                             secondary={<Typography variant="caption" color="primary.main" fontWeight={600}>{new Intl.NumberFormat('vi-VN').format(inv.total)} đ</Typography>}
                           />
                           <Chip 
                             label={inv.status === 'paid' ? 'Đã thu' : 'Chưa thu'} 
                             size="small" 
                             color={inv.status === 'paid' ? 'success' : 'error'}
                             sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                           />
                        </ListItem>
                        {index < tenant.invoices.length - 1 && <Divider component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
               <Button 
                startIcon={<ArrowBack />} 
                onClick={() => navigate(ROUTES.HOST_TENANTS)}
                sx={{ color: 'text.secondary' }}
               >
                 Quay lại danh sách
               </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TenantDetail;
