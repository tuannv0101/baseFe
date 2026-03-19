import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Switch,
  TextField,
  InputAdornment,
  Divider,
  Button,
  MenuItem,
  CircularProgress,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  FlashOn,
  WaterDrop,
  Wifi,
  DeleteOutline,
  Payments,
  Home,
  Save,
  Business,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import propertyManagementService from '../services/host/propertyManagement/service';

const iconMap = {
  'Điện': <FlashOn />,
  'Nước': <WaterDrop />,
  'Wifi': <Wifi />,
  'Rác': <DeleteOutline />,
  'Vệ sinh': <DeleteOutline />,
  'Quản lý': <Home />,
  'Phòng': <Home />,
};

const defaultColor = '#1976d2';
const colorMap = {
  'Điện': '#fbc02d',
  'Nước': '#1976d2',
  'Wifi': '#4caf50',
  'Rác': '#757575',
  'Vệ sinh': '#757575',
  'Quản lý': '#9c27b0',
};

const ServiceCard = ({ service, onUpdate }) => {
  const icon = iconMap[service.name] || <Payments />;
  const color = colorMap[service.name] || defaultColor;

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: `${color}15`, 
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {icon}
            </Box>
            <Typography variant="h6" fontWeight={600}>{service.name}</Typography>
          </Box>
          <Switch 
            checked={service.enabled} 
            onChange={(e) => onUpdate({ ...service, enabled: e.target.checked })}
            color="primary" 
          />
        </Box>
        
        <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Đơn giá"
              type="number"
              value={service.price}
              onChange={(e) => onUpdate({ ...service, price: Number(e.target.value) })}
              size="small"
              InputProps={{
                endAdornment: <InputAdornment position="end">đ/{service.unit}</InputAdornment>,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Đơn vị tính"
              value={service.unit}
              onChange={(e) => onUpdate({ ...service, unit: e.target.value })}
              size="small"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const Services = () => {
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [services, setServices] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoadingProps(true);
      const res = await propertyManagementService.getAllProperties();
      const list = res?.data || res || [];
      setProperties(Array.isArray(list) ? list : []);
      if (list.length > 0) {
        setSelectedPropertyId(list[0].id);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách tòa nhà:', error);
    } finally {
      setLoadingProps(false);
    }
  };

  useEffect(() => {
    if (selectedPropertyId) {
      fetchServices(selectedPropertyId);
    }
  }, [selectedPropertyId]);

  const fetchServices = async (id) => {
    try {
      setLoadingServices(true);
      const res = await propertyManagementService.getPropertyServices(id);
      const list = res?.data || res || [];
      // If backend returns empty, we might want to provide defaults
      if (Array.isArray(list) && list.length > 0) {
        setServices(list);
      } else {
        // Mock defaults if none exist
        setServices([
          { id: '1', name: 'Điện', unit: 'kWh', price: 3500, enabled: true },
          { id: '2', name: 'Nước', unit: 'm3', price: 15000, enabled: true },
          { id: '3', name: 'Wifi', unit: 'Phòng', price: 100000, enabled: true },
          { id: '4', name: 'Rác & Vệ sinh', unit: 'Phòng', price: 50000, enabled: true },
        ]);
      }
    } catch (error) {
      console.error('Lỗi khi tải dịch vụ:', error);
      // Fallback defaults for demo if API fails
      setServices([
        { id: '1', name: 'Điện', unit: 'kWh', price: 3500, enabled: true },
        { id: '2', name: 'Nước', unit: 'm3', price: 15000, enabled: true },
        { id: '3', name: 'Wifi', unit: 'Phòng', price: 100000, enabled: true },
        { id: '4', name: 'Rác & Vệ sinh', unit: 'Phòng', price: 50000, enabled: true },
      ]);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleUpdateService = (updated) => {
    setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleSave = async () => {
    if (!selectedPropertyId) return;
    try {
      setIsSaving(true);
      await propertyManagementService.updatePropertyServices(selectedPropertyId, services);
      alert('Đã lưu cấu hình dịch vụ thành công!');
    } catch (error) {
      console.error('Lỗi khi lưu dịch vụ:', error);
      alert('Có lỗi xảy ra khi lưu cấu hình.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddService = () => {
    const newId = Date.now().toString();
    setServices(prev => [...prev, { 
      id: newId, 
      name: 'Dịch vụ mới', 
      unit: 'Tháng', 
      price: 0, 
      enabled: true 
    }]);
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader 
        title="Quản lý Dịch vụ" 
        breadcrumbs={[{ label: 'Tài chính & Dịch vụ' }, { label: 'Quản lý Dịch vụ' }]}
        action={{
          label: isSaving ? 'Đang lưu...' : 'Lưu thay đổi',
          icon: isSaving ? <CircularProgress size={20} color="inherit" /> : <Save />,
          onClick: handleSave,
          disabled: isSaving || !selectedPropertyId
        }}
      />

      <Card sx={{ mb: 3, p: 2, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Business color="primary" />
          <TextField
            select
            label="Chọn tòa nhà để cấu hình"
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            size="small"
            sx={{ minWidth: 300 }}
            disabled={loadingProps}
          >
            {properties.map((prop) => (
              <MenuItem key={prop.id} value={prop.id}>
                {prop.name}
              </MenuItem>
            ))}
            {properties.length === 0 && !loadingProps && (
              <MenuItem disabled>Không có tòa nhà nào</MenuItem>
            )}
          </TextField>
          {loadingProps && <CircularProgress size={20} />}
        </Stack>
      </Card>

      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {selectedPropertyId 
                ? `Dịch vụ áp dụng cho: ${properties.find(p => p.id === selectedPropertyId)?.name || ''}`
                : 'Danh sách dịch vụ'
              }
            </Typography>
          </Box>
          
          {loadingServices ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {services.map(s => (
                <ServiceCard 
                  key={s.id} 
                  service={s} 
                  onUpdate={handleUpdateService} 
                />
              ))}
              <Button 
                variant="outlined" 
                startIcon={<Payments />} 
                onClick={handleAddService}
                sx={{ mt: 1, borderRadius: 2 }}
                disabled={!selectedPropertyId}
              >
                Thêm loại dịch vụ mới
              </Button>
            </>
          )}
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: 'primary.lighter', border: 'none', mb: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary.main" fontWeight={700} gutterBottom>
                Lưu ý cấu hình
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                - Đơn giá dịch vụ được cấu hình riêng cho từng tòa nhà.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                - Các thay đổi về đơn giá sẽ được áp dụng cho các kỳ hóa đơn được tạo sau thời điểm lưu.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                - Bạn có thể ghi đè đơn giá cho từng phòng cụ thể trong mục chi tiết phòng nếu cần thiết.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Services;
