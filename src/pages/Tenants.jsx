import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Chip,
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  Search,
  Add,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';

const tenants = [
  { id: 1, name: 'Nguyễn Văn A', room: '101', phone: '0901234567', status: 'active', email: 'vana@gmail.com' },
  { id: 2, name: 'Trần Thị B', room: '103', phone: '0902345678', status: 'active', email: 'thib@gmail.com' },
  { id: 3, name: 'Lê Văn C', room: '201', phone: '0903456789', status: 'inactive', email: 'vanc@gmail.com' },
  { id: 4, name: 'Phạm Thị D', room: '202', phone: '0904567890', status: 'active', email: 'thid@gmail.com' },
  { id: 5, name: 'Hoàng Văn E', room: '204', phone: '0905678901', status: 'pending', email: 'vane@gmail.com' },
];

const Tenants = () => {
  return (
    <Box>
      <PageHeader 
        title="Hồ sơ Khách thuê" 
        breadcrumbs={[{ label: 'Quản lý Thuê phòng' }, { label: 'Hồ sơ Khách thuê' }]}
        action={{
          label: 'Thêm khách thuê',
          icon: <Add />,
          onClick: () => console.log('Add tenant')
        }}
      />

      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm theo tên, số điện thoại, số phòng..."
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500 }}
        />
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Khách thuê</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Phòng</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Số điện thoại</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                      {tenant.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Box sx={{ fontWeight: 600 }}>{tenant.name}</Box>
                      <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>ID: {tenant.id}</Box>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={`P.${tenant.room}`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                </TableCell>
                <TableCell>{tenant.phone}</TableCell>
                <TableCell>{tenant.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={tenant.status === 'active' ? 'Đang thuê' : tenant.status === 'inactive' ? 'Đã chuyển' : 'Chờ duyệt'} 
                    color={tenant.status === 'active' ? 'success' : tenant.status === 'inactive' ? 'default' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary"><Visibility fontSize="small" /></IconButton>
                  <IconButton size="small" color="info"><Edit fontSize="small" /></IconButton>
                  <IconButton size="small" color="error"><Delete fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Tenants;
