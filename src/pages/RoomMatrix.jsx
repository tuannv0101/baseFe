import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  CardActionArea,
  Tabs,
  Tab,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  HomeWork,
  CheckCircle,
  HourglassEmpty,
  Build,
  Person,
  MeetingRoom,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';

const rooms = [
  { id: 101, type: 'Studio', status: 'occupied', tenant: 'Nguyễn Văn A', price: '4.5M' },
  { id: 102, type: 'Studio', status: 'vacant', tenant: null, price: '4.5M' },
  { id: 103, type: 'Studio', status: 'occupied', tenant: 'Trần Thị B', price: '4.2M' },
  { id: 104, type: '1BR', status: 'maintenance', tenant: null, price: '5.5M' },
  { id: 201, type: 'Studio', status: 'occupied', tenant: 'Lê Văn C', price: '4.5M' },
  { id: 202, type: 'Studio', status: 'occupied', tenant: 'Phạm Thị D', price: '4.5M' },
  { id: 203, type: '2BR', status: 'vacant', tenant: null, price: '7.5M' },
  { id: 204, type: 'Studio', status: 'occupied', tenant: 'Hoàng Văn E', price: '4.5M' },
  { id: 301, type: 'Studio', status: 'occupied', tenant: 'Đặng Thị F', price: '4.5M' },
  { id: 302, type: 'Penthouse', status: 'vacant', tenant: null, price: '12M' },
  { id: 303, type: 'Studio', status: 'occupied', tenant: 'Bùi Văn G', price: '4.5M' },
  { id: 304, type: 'Studio', status: 'occupied', tenant: 'Ngô Thị H', price: '4.5M' },
];

const statusConfig = {
  occupied: { color: 'primary', label: 'Đang thuê', icon: <Person fontSize="small" /> },
  vacant: { color: 'success', label: 'Trống', icon: <MeetingRoom fontSize="small" /> },
  maintenance: { color: 'warning', label: 'Bảo trì', icon: <Build fontSize="small" /> },
};

const RoomCard = ({ room }) => {
  const config = statusConfig[room.status];

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        height: '100%', 
        borderRadius: 2,
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
          borderColor: 'primary.main',
        }
      }}
    >
      <CardActionArea sx={{ height: '100%', p: 2 }}>
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={700}>
              P.{room.id}
            </Typography>
            <Chip 
              label={config.label} 
              color={config.color} 
              size="small" 
              icon={config.icon}
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {room.type} • {room.price}/tháng
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person sx={{ fontSize: '1rem', color: room.tenant ? 'primary.main' : 'text.disabled' }} />
            <Typography variant="body2" sx={{ color: room.tenant ? 'text.primary' : 'text.disabled', fontWeight: 500 }}>
              {room.tenant || 'Chưa có khách'}
            </Typography>
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
};

const RoomMatrix = () => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box>
      <PageHeader 
        title="Sơ đồ Phòng" 
        breadcrumbs={[{ label: 'Quản lý Tài sản' }, { label: 'Sơ đồ Phòng' }]}
      />

      <Paper sx={{ mb: 3, p: 1, borderRadius: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, v) => setTabValue(v)} 
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Tất cả (60)" />
          <Tab label="Tòa nhà A (24)" />
          <Tab label="Tòa nhà B (36)" />
        </Tabs>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item>
          <Chip icon={<CheckCircle />} label="Đang thuê: 45" variant="outlined" color="primary" />
        </Grid>
        <Grid item>
          <Chip icon={<HourglassEmpty />} label="Trống: 10" variant="outlined" color="success" />
        </Grid>
        <Grid item>
          <Chip icon={<Build />} label="Bảo trì: 5" variant="outlined" color="warning" />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>Tầng 1</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {rooms.filter(r => r.id < 200).map(room => (
          <Grid item xs={12} sm={6} md={3} lg={2} key={room.id}>
            <RoomCard room={room} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>Tầng 2</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {rooms.filter(r => r.id >= 200 && r.id < 300).map(room => (
          <Grid item xs={12} sm={6} md={3} lg={2} key={room.id}>
            <RoomCard room={room} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 700 }}>Tầng 3</Typography>
      <Grid container spacing={2}>
        {rooms.filter(r => r.id >= 300).map(room => (
          <Grid item xs={12} sm={6} md={3} lg={2} key={room.id}>
            <RoomCard room={room} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RoomMatrix;
