import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Switch,
  TextField,
  InputAdornment,
  Divider,
  Button,
} from '@mui/material';
import {
  FlashOn,
  WaterDrop,
  Wifi,
  DeleteOutline,
  Payments,
  Home,
  Save,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';

const serviceList = [
  { id: 1, name: 'Điện', unit: 'kWh', price: 3500, icon: <FlashOn />, color: '#fbc02d', enabled: true },
  { id: 2, name: 'Nước', unit: 'm3', price: 15000, icon: <WaterDrop />, color: '#1976d2', enabled: true },
  { id: 3, name: 'Wifi', unit: 'Phòng', price: 100000, icon: <Wifi />, color: '#4caf50', enabled: true },
  { id: 4, name: 'Rác & Vệ sinh', unit: 'Phòng', price: 50000, icon: <DeleteOutline />, color: '#757575', enabled: true },
  { id: 5, name: 'Phí quản lý', unit: 'Phòng', price: 150000, icon: <Home />, color: '#9c27b0', enabled: false },
];

const ServiceCard = ({ service }) => (
  <Card variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: `${service.color}15`, 
            color: service.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {service.icon}
          </Box>
          <Typography variant="h6" fontWeight={600}>{service.name}</Typography>
        </Box>
        <Switch defaultChecked={service.enabled} color="primary" />
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Đơn giá"
            defaultValue={service.price}
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">đ/{service.unit}</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Đơn vị tính"
            defaultValue={service.unit}
            size="small"
          />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const Services = () => {
  return (
    <Box>
      <PageHeader 
        title="Quản lý Dịch vụ" 
        breadcrumbs={[{ label: 'Tài chính & Dịch vụ' }, { label: 'Quản lý Dịch vụ' }]}
        action={{
          label: 'Lưu thay đổi',
          icon: <Save />,
          onClick: () => console.log('Save services')
        }}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>Danh sách dịch vụ đang áp dụng</Typography>
          {serviceList.map(s => (
            <ServiceCard key={s.id} service={s} />
          ))}
          <Button variant="outlined" startIcon={<Payments />} sx={{ mt: 1, borderRadius: 2 }}>
            Thêm loại dịch vụ mới
          </Button>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: 'primary.light', border: 'none' }}>
            <CardContent>
              <Typography variant="h6" color="primary.main" fontWeight={700} gutterBottom>
                Lưu ý cấu hình
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                - Các thay đổi về đơn giá sẽ được áp dụng cho kỳ hóa đơn tiếp theo.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                - Bạn có thể tùy chỉnh đơn giá riêng cho từng phòng trong phần chi tiết phòng.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Các dịch vụ có đơn vị là "kWh" hoặc "m3" sẽ yêu cầu chốt số định kỳ hàng tháng.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Services;
