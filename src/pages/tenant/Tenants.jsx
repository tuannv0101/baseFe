import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,Typography,
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  Search,
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants';
import tenantManagementService from '../../services/host/tenantManagement/service';

const Tenants = () => {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await tenantManagementService.getTenants();
      // Linh hoạt xử lý response data tùy theo cấu trúc API (data, data.content, hoặc data.data)
      console.log(response.data.items);
      
      const data = response.data?.content || response.data.items || response.data || response;
      setTenants(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching tenants:', err);
      setError('Không thể tải danh sách khách thuê. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const filteredTenants = tenants.filter(tenant => {
    const searchStr = searchTerm.toLowerCase();
    const name = (tenant.fullName || tenant.name || '').toLowerCase();
    const phone = (tenant.phone || tenant.phoneNumber || '').toLowerCase();
    const room = (tenant.roomNumber || tenant.room?.number || '').toLowerCase();
    
    return name.includes(searchStr) || phone.includes(searchStr) || room.includes(searchStr);
  });

  return (
    <Box>
      <PageHeader 
        title="Quản lý Khách thuê" 
        breadcrumbs={[{ label: 'Quản lý Khách thuê' }]}
        action={{
          label: 'Thêm khách thuê',
          icon: <Add />,
          onClick: () => navigate(ROUTES.HOST_TENANT_CREATE)
        }}
      />

      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm theo tên, số điện thoại, số phòng..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)', position: 'relative', minHeight: 200 }}>
        {loading && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1 }}>
            <CircularProgress />
          </Box>
        )}
        
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
            {filteredTenants.length > 0 ? (
              filteredTenants.map((tenant) => (
                <TableRow key={tenant.id || tenant.tenantId} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                        {(tenant.fullName || tenant.name || 'T').charAt(0)}
                      </Avatar>
                      <Box>
                        <Box sx={{ fontWeight: 600 }}>{tenant.fullName || tenant.name}</Box>
                        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>ID: {tenant.id || tenant.tenantId}</Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`P.${tenant.roomNumber || tenant.room?.number || '---'}`} 
                      size="small" 
                      variant="outlined" 
                      sx={{ fontWeight: 600 }} 
                    />
                  </TableCell>
                  <TableCell>{tenant.phone || tenant.phoneNumber || '---'}</TableCell>
                  <TableCell>{tenant.email || '---'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={tenant.status === 'ACTIVE' || tenant.status === 'active' ? 'Đang thuê' : tenant.status === 'INACTIVE' || tenant.status === 'inactive' ? 'Đã chuyển' : 'Chờ duyệt'} 
                      color={tenant.status === 'ACTIVE' || tenant.status === 'active' ? 'success' : tenant.status === 'INACTIVE' || tenant.status === 'inactive' ? 'default' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => navigate(ROUTES.HOST_TENANT_DETAIL.replace(':id', tenant.id || tenant.tenantId))}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="info" 
                      onClick={() => navigate(ROUTES.HOST_TENANT_EDIT.replace(':id', tenant.id || tenant.tenantId))}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error"><Delete fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              !loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">Không tìm thấy khách thuê nào</Typography>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Tenants;
