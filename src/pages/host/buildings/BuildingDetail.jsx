import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Stack,
  Button,
  Tooltip,
  CircularProgress,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Person,
  Visibility,
  Edit,
  ArrowBack,
  Business,
  LocationOn,
  AddBox,
  MeetingRoom,
  Layers,
  Description,
  Add,
} from '@mui/icons-material';
import PageHeader from '../../../components/common/PageHeader';
import { ROUTES } from '../../../constants';
import propertyManagementService from '../../../services/host/propertyManagement/service';

const statusConfig = {
  'AVAILABLE': { color: 'success', label: 'Trống' },
  'OCCUPIED': { color: 'primary', label: 'Đang thuê' },
  'MAINTENANCE': { color: 'warning', label: 'Bảo trì' },
};
const typeConfig = {
  '1BR': { color: 'info', label: 'Phòng đơn' },
  '2BR': { color: 'secondary', label: 'Phòng đôi' },
  'SUITE': { color: 'error', label: 'Phòng VIP' },
};
const BuildingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [buildingInfo, setBuildingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchBuildingData();
  }, [id]);

  const fetchBuildingData = async () => {
    setLoading(true);
    try {
      // 1. Lấy thông tin chi tiết tòa nhà
      const propResponse = await propertyManagementService.getPropertyById(id);
      setBuildingInfo(propResponse?.data || propResponse);

      // 2. Lấy danh sách phòng thuộc tòa nhà này
      const roomResponse = await propertyManagementService.getRoomMatrix(id);
      // Giả sử API trả về data là mảng các phòng
      setRooms(Array.isArray(roomResponse?.data.items) ? roomResponse.data.items : (Array.isArray(roomResponse) ? roomResponse : []));
    } catch (error) {
      console.error('Lỗi khi tải thông tin tòa nhà:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusDisplay = (status) => {
    const config = statusConfig[status] || { color: 'default', label: status || 'N/A' };
    return <Chip label={config.label} color={config.color} size="small" variant="outlined" sx={{ fontWeight: 600 }} />;
  };
  const getTypeDisplay = (type) => {
    const config = typeConfig[type] || { color: 'default', label: type || 'N/A' };
    return <Chip label={config.label} color={config.color} size="small" variant="outlined" sx={{ fontWeight: 600 }} />;
  };
  if (loading && !buildingInfo) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const building = buildingInfo || { name: 'Không tìm thấy', address: 'Chưa cập nhật' };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader 
        title={`Chi tiết ${building.name || 'Tòa nhà'}`} 
        breadcrumbs={[
          { label: 'Quản lý Tài sản' }, 
          { label: 'Tòa nhà', path: ROUTES.HOST_BUILDINGS },
          { label: building.name || 'Chi tiết' }
        ]}
      />

      <Button 
        variant="text"
        startIcon={<ArrowBack />} 
        onClick={() => navigate(ROUTES.HOST_BUILDINGS)}
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        Quay lại danh sách
      </Button>

      {/* Thông tin tổng quan tòa nhà */}
      <Paper 
        sx={{ 
          p: { xs: 2, md: 3 }, 
          mb: 4, 
          borderRadius: 3, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid',
          borderColor: 'divider',
          background: 'linear-gradient(to bottom right, #ffffff, #fafafa)'
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3}>
              <Box>
                <Typography 
                  variant="overline" 
                  sx={{ 
                    color: 'primary.main', 
                    fontWeight: 800, 
                    letterSpacing: 1.2,
                    bgcolor: 'primary.lighter',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    display: 'inline-block',
                    mb: 1
                  }}
                >
                  THÔNG TIN TÒA NHÀ
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      width: 56, 
                      height: 56, 
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)' 
                    }}
                  >
                    <Business sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight={800} color="text.primary">
                      {building.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', mt: 0.5 }}>
                      <LocationOn sx={{ fontSize: 16 }} />
                      <Typography variant="body2">{building.address || 'Chưa cập nhật địa chỉ'}</Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: 'transparent' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Layers color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Quy mô tòa nhà</Typography>
                        <Typography variant="body2" fontWeight={700}>{building.totalFloors || 0} tầng</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: 'transparent' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <MeetingRoom color="action" />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Tổng số phòng</Typography>
                        <Typography variant="body2" fontWeight={700}>{rooms.length} phòng</Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
          
          <Grid size={{ xs: 12, md: 5 }}>
            <Box 
              sx={{ 
                p: 2.5, 
                bgcolor: 'grey.50', 
                borderRadius: 3, 
                border: '1px dashed',
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 4, height: 16, bgcolor: 'primary.main', borderRadius: 1 }} />
                TRẠNG THÁI PHÒNG
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={800} color="primary.main">
                      {rooms.filter(r => r.statusRoom === 'OCCUPIED').length}
                    </Typography>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 10 }}>
                      Đang thuê
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={800} color="success.main">
                      {rooms.filter(r => r.statusRoom === 'AVAILABLE').length}
                    </Typography>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 10 }}>
                      Phòng trống
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={800} color="warning.main">
                      {rooms.filter(r => r.statusRoom === 'MAINTENANCE').length}
                    </Typography>
                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 10 }}>
                      Bảo trì
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2.5, borderStyle: 'dashed' }} />
              
              <Stack direction="row" spacing={1.5}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<AddBox />} 
                  onClick={() => navigate(`${ROUTES.HOST_ROOM_CREATE}?buildingId=${id}`)}
                  sx={{ 
                    borderRadius: 2, 
                    py: 1,
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                    textTransform: 'none',
                    fontWeight: 700
                  }}
                >
                  Thêm phòng
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Danh sách phòng */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={700}>Danh sách phòng trong tòa nhà</Typography>
      </Box>
      
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Tên phòng</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Loại phòng</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Giá thuê</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Khách thuê</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }} align="center">Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }} align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((room) => (
                    <TableRow key={room.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="primary.main">
                          {room.roomNumber || `Phòng ${room.id}`}
                        </Typography>
                      </TableCell>
                      <TableCell>{getTypeDisplay(room.typeRoom)}</TableCell>
                      <TableCell fontWeight={600}>{formatPrice(room.price)}</TableCell>
                      <TableCell>
                        {room.tenantName ? (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Person sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                            <Typography variant="body2">{room.tenantName}</Typography>
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>Chưa có khách</Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {getStatusDisplay(room.statusRoom)}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="Xem chi tiết">
                            <IconButton size="small" onClick={() => navigate(ROUTES.HOST_ROOM_DETAIL.replace(':id', room.id))}>
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton size="small" color="info" onClick={() => navigate(ROUTES.HOST_ROOM_EDIT.replace(":id", room.id))}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                {rooms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                        <MeetingRoom sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
                        <Typography variant="body2">Tòa nhà này chưa có phòng nào được tạo.</Typography>
                        <Button 
                          variant="text" 
                          startIcon={<Add />} 
                          sx={{ mt: 1 }}
                          onClick={() => navigate(`${ROUTES.HOST_ROOM_CREATE}?buildingId=${id}`)}
                        >
                          Thêm phòng ngay
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rooms.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số dòng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên tổng số ${count}`}
            />
          </>
        )}
      </TableContainer>
    </Box>
  );
};

export default BuildingDetail;
