import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {
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
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Stack,
  Collapse,
  Button,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  FilterList,
  Business,
  Person,
  Visibility,
  Edit,
  RestartAlt,
  Add,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants';
import propertyManagementService from '../../services/host/propertyManagement/service';

const statusConfig = {
  'AVAILABLE': { color: 'success', label: 'Trống' },
  'OCCUPIED': { color: 'primary', label: 'Đang thuê' },
  'MAINTENANCE': { color: 'warning', label: 'Bảo trì' },
  // Fallback for mock data or different API values
  'occupied': { color: 'primary', label: 'Đang thuê' },
  'vacant': { color: 'success', label: 'Trống' },
  'maintenance': { color: 'warning', label: 'Bảo trì' },
};

const RoomMatrix = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  // Form state
  const [searchForm, setSearchForm] = useState({
    buildingName: '',
    minPrice: '',
    maxPrice: '',
    buildingStatus: '', // Note: API might not have this per room
    tenantName: '',
    roomType: '',
    roomStatus: '',
  });

  // Filter state for data
  const [appliedFilters, setAppliedFilters] = useState({ ...searchForm });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await propertyManagementService.getAllProperties();
      // Assuming data is an array based on "getAll" naming
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters({ ...searchForm });
    setPage(0);
  };

  const handleReset = () => {
    const resetForm = {
      buildingName: '',
      minPrice: '',
      maxPrice: '',
      buildingStatus: '',
      tenantName: '',
      roomType: '',
      roomStatus: '',
    };
    setSearchForm(resetForm);
    setAppliedFilters(resetForm);
    setPage(0);
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      // Mapping API fields to filter logic
      const buildingName = room.propertyName || '';
      const tenantName = room.tenantName || '';
      const typeRoom = room.typeRoom || '';
      const statusRoom = room.statusRoom || '';
      const price = Number(room.price) || 0;

      const matchBuilding = !appliedFilters.buildingName || buildingName.toLowerCase().includes(appliedFilters.buildingName.toLowerCase());
      const matchTenant = !appliedFilters.tenantName || tenantName.toLowerCase().includes(appliedFilters.tenantName.toLowerCase());
      const matchType = !appliedFilters.roomType || typeRoom === appliedFilters.roomType;
      const matchStatus = !appliedFilters.roomStatus || statusRoom === appliedFilters.roomStatus;
      const matchMinPrice = !appliedFilters.minPrice || price >= Number(appliedFilters.minPrice);
      const matchMaxPrice = !appliedFilters.maxPrice || price <= Number(appliedFilters.maxPrice);

      return matchBuilding && matchTenant && matchType && matchStatus && matchMinPrice && matchMaxPrice;
    });
  }, [appliedFilters, rooms]);

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

  const handleOpenDetail = (roomId) => {
    const targetPath = ROUTES.HOST_ROOM_DETAIL.replace(':id', roomId);
    navigate(targetPath);
  };

  const getStatusDisplay = (status) => {
    const config = statusConfig[status] || { color: 'default', label: status || 'N/A' };
    return <Chip label={config.label} color={config.color} size="small" sx={{ fontWeight: 600, minWidth: 90 }} />;
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader 
        title="Danh sách tất cả phòng" 
        breadcrumbs={[{ label: 'Quản lý Tài sản' }, { label: 'Tất cả phòng' }]}
        action={{
                  label: 'Thêm phòng',
                  icon: <Add />,
                  onClick: () => {} // Placeholder
                }}  
      />

      {/* Filter Section */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center" sx={{ width: '100%', m: 0 }}>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              name="buildingName"
              placeholder="Tìm tên tòa nhà..."
              value={searchForm.buildingName}
              onChange={handleInputChange}
              InputProps={{ 
                startAdornment: <InputAdornment position="start"><Business fontSize="small" /></InputAdornment> 
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5, md: 5 }}>
            <TextField
              fullWidth
              size="small"
              name="tenantName"
              placeholder="Tìm tên người thuê..."
              value={searchForm.tenantName}
              onChange={handleInputChange}
              InputProps={{ 
                startAdornment: <InputAdornment position="start"><Person fontSize="small" /></InputAdornment> 
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 1, md: 1 }}>
          <Tooltip title="Bộ lọc nâng cao">
              <IconButton 
                color={showFilters ? 'primary' : 'default'} 
                onClick={() => setShowFilters(!showFilters)}
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <FilterList fontSize="small" />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Collapse in={showFilters}>
              <Box sx={{ pt: 2 }}>
              <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    select
                    name="roomType"
                    label="Loại phòng"
                    value={searchForm.roomType}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">Tất cả loại phòng</MenuItem>
                    <MenuItem value="Studio">Studio</MenuItem>
                    <MenuItem value="1BR">1 Phòng ngủ</MenuItem>
                    <MenuItem value="2BR">2 Phòng ngủ</MenuItem>
                    <MenuItem value="Penthouse">Penthouse</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    select
                    name="roomStatus"
                    label="Trạng thái phòng"
                    value={searchForm.roomStatus}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">Tất cả trạng thái</MenuItem>
                    <MenuItem value="AVAILABLE">Trống</MenuItem>
                    <MenuItem value="OCCUPIED">Đang thuê</MenuItem>
                    <MenuItem value="MAINTENANCE">Bảo trì</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                      fullWidth
                      size="small"
                      name="minPrice"
                      label="Giá từ"
                      type="number"
                      value={searchForm.minPrice}
                      onChange={handleInputChange}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      name="maxPrice"
                      label="Đến"
                      type="number"
                      value={searchForm.maxPrice}
                      onChange={handleInputChange}
                    />
                  </Stack>
                </Grid>
              </Grid>
              </Box>
            </Collapse>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Search />}
                onClick={handleSearch}
                sx={{ borderRadius: 1.5, px: 3 }}
              >
                Tìm kiếm
              </Button>
              
              <Button 
                variant="text" 
                color="inherit" 
                startIcon={<RestartAlt />}
                onClick={handleReset}
              >
                Làm mới
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* List Table Section */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50', py: 2 }}>Phòng</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Tòa nhà</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Loại phòng</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Giá thuê</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Người thuê</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }} align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRooms
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((room) => (
                    <TableRow key={room.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="primary.main">
                          P.{room.roomNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{room.propertyName || 'N/A'}</Typography>
                      </TableCell>
                      <TableCell>{room.typeRoom || 'N/A'}</TableCell>
                      <TableCell>{formatPrice(room.price)}</TableCell>
                      <TableCell>
                        {room.tenantName ? (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Person sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                            <Typography variant="body2">{room.tenantName}</Typography>
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>Trống</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusDisplay(room.statusRoom)}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="Xem chi tiết">
                            <IconButton size="small" onClick={() => handleOpenDetail(room.id)}>
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
                {filteredRooms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">Không tìm thấy phòng nào</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredRooms.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số dòng mỗi trang:"
            />
          </>
        )}
      </TableContainer>
    </Box>
  );
};

export default RoomMatrix;
