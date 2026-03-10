import React, { useState, useMemo } from 'react';
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
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Stack,
  Collapse,
  Button,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  Business,
  Person,
  Visibility,
  Edit,
  RestartAlt,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';

// Enhanced mock data
const initialRooms = [
  { id: 1, roomNumber: '101', buildingName: 'Tòa nhà A', buildingStatus: 'Hoạt động', type: 'Studio', status: 'occupied', tenant: 'Nguyễn Văn A', price: 4500000 },
  { id: 2, roomNumber: '102', buildingName: 'Tòa nhà A', buildingStatus: 'Hoạt động', type: 'Studio', status: 'vacant', tenant: null, price: 4500000 },
  { id: 3, roomNumber: '103', buildingName: 'Tòa nhà A', buildingStatus: 'Hoạt động', type: 'Studio', status: 'occupied', tenant: 'Trần Thị B', price: 4200000 },
  { id: 4, roomNumber: '104', buildingName: 'Tòa nhà A', buildingStatus: 'Hoạt động', type: '1BR', status: 'maintenance', tenant: null, price: 5500000 },
  { id: 5, roomNumber: '201', buildingName: 'Tòa nhà A', buildingStatus: 'Hoạt động', type: 'Studio', status: 'occupied', tenant: 'Lê Văn C', price: 4500000 },
  { id: 6, roomNumber: '202', buildingName: 'Tòa nhà B', buildingStatus: 'Hoạt động', type: 'Studio', status: 'occupied', tenant: 'Phạm Thị D', price: 4800000 },
  { id: 7, roomNumber: '203', buildingName: 'Tòa nhà B', buildingStatus: 'Đầy phòng', type: '2BR', status: 'vacant', tenant: null, price: 7500000 },
  { id: 8, roomNumber: '204', buildingName: 'Tòa nhà B', buildingStatus: 'Đầy phòng', type: 'Studio', status: 'occupied', tenant: 'Hoàng Văn E', price: 4500000 },
  { id: 9, roomNumber: '301', buildingName: 'Tòa nhà B', buildingStatus: 'Hoạt động', type: 'Studio', status: 'occupied', tenant: 'Đặng Thị F', price: 4500000 },
  { id: 10, roomNumber: '302', buildingName: 'Tòa nhà C', buildingStatus: 'Bảo trì', type: 'Penthouse', status: 'vacant', tenant: null, price: 12000000 },
  { id: 11, roomNumber: '303', buildingName: 'Tòa nhà C', buildingStatus: 'Bảo trì', type: 'Studio', status: 'occupied', tenant: 'Bùi Văn G', price: 4500000 },
  { id: 12, roomNumber: '304', buildingName: 'Tòa nhà C', buildingStatus: 'Bảo trì', type: 'Studio', status: 'occupied', tenant: 'Ngô Thị H', price: 4500000 },
  { id: 13, roomNumber: '401', buildingName: 'Tòa nhà A', buildingStatus: 'Hoạt động', type: '1BR', status: 'occupied', tenant: 'Vũ Văn I', price: 5500000 },
  { id: 14, roomNumber: '402', buildingName: 'Tòa nhà A', buildingStatus: 'Hoạt động', type: '1BR', status: 'vacant', tenant: null, price: 5500000 },
  { id: 15, roomNumber: '403', buildingName: 'Tòa nhà B', buildingStatus: 'Hoạt động', type: 'Studio', status: 'occupied', tenant: 'Đỗ Thị J', price: 4500000 },
];

const statusConfig = {
  occupied: { color: 'primary', label: 'Đang thuê' },
  vacant: { color: 'success', label: 'Trống' },
  maintenance: { color: 'warning', label: 'Bảo trì' },
};

const RoomMatrix = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  // Form state
  const [searchForm, setSearchForm] = useState({
    buildingName: '',
    minPrice: '',
    maxPrice: '',
    buildingStatus: '',
    tenantName: '',
    roomType: '',
    roomStatus: '',
  });

  // Filter state for data
  const [appliedFilters, setAppliedFilters] = useState({ ...searchForm });

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
    return initialRooms.filter(room => {
      const matchBuilding = !appliedFilters.buildingName || room.buildingName.toLowerCase().includes(appliedFilters.buildingName.toLowerCase());
      const matchBuildingStatus = !appliedFilters.buildingStatus || room.buildingStatus === appliedFilters.buildingStatus;
      const matchTenant = !appliedFilters.tenantName || (room.tenant && room.tenant.toLowerCase().includes(appliedFilters.tenantName.toLowerCase()));
      const matchType = !appliedFilters.roomType || room.type === appliedFilters.roomType;
      const matchStatus = !appliedFilters.roomStatus || room.status === appliedFilters.roomStatus;
      const matchMinPrice = !appliedFilters.minPrice || room.price >= Number(appliedFilters.minPrice);
      const matchMaxPrice = !appliedFilters.maxPrice || room.price <= Number(appliedFilters.maxPrice);

      return matchBuilding && matchBuildingStatus && matchTenant && matchType && matchStatus && matchMinPrice && matchMaxPrice;
    });
  }, [appliedFilters]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader 
        title="Quản lý Phòng & Tòa nhà" 
        breadcrumbs={[{ label: 'Quản lý Tài sản' }, { label: 'Danh sách Phòng' }]}
      />

      {/* Filter Section */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        {/* Always Visible: Main Search Fields */}
        <Grid container spacing={2} alignItems="center" columns={12}>
          <Grid item size={6} sm={4} md={4}>
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
          <Grid item size={5} sm={4} md={4}>
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
          <Grid item size={1} sm={4} md={4}>
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
          <Collapse in={showFilters}>
            <Box size={12} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item size={3} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    select
                    name="buildingStatus"
                    label="Trạng thái tòa nhà"
                    value={searchForm.buildingStatus}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">Tất cả trạng thái</MenuItem>
                    <MenuItem value="Hoạt động">Hoạt động</MenuItem>
                    <MenuItem value="Đầy phòng">Đầy phòng</MenuItem>
                    <MenuItem value="Bảo trì">Bảo trì</MenuItem>
                  </TextField>
                </Grid>
                <Grid item size={3} sm={6} md={3}>
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
                <Grid item size={3} sm={6} md={3}>
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
                    <MenuItem value="occupied">Đang thuê</MenuItem>
                    <MenuItem value="vacant">Trống</MenuItem>
                    <MenuItem value="maintenance">Bảo trì</MenuItem>
                  </TextField>
                </Grid>
                <Grid item size={3} sm={6} md={3}>
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
          <Grid item size={12} sm={4} md={4}>
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

        {/* Toggled Area: Selects & Price Range */}
      </Paper>

      {/* List Table Section */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)' }}>
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
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{room.buildingName}</Typography>
                      <Typography variant="caption" color="text.secondary">{room.buildingStatus}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>{formatPrice(room.price)}</TableCell>
                  <TableCell>
                    {room.tenant ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Person sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                        <Typography variant="body2">{room.tenant}</Typography>
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>Trống</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={statusConfig[room.status].label} 
                      color={statusConfig[room.status].color} 
                      size="small" 
                      sx={{ fontWeight: 600, minWidth: 90 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="Xem chi tiết"><IconButton size="small"><Visibility fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Chỉnh sửa"><IconButton size="small" color="info"><Edit fontSize="small" /></IconButton></Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            {filteredRooms.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <Typography variant="body1" color="text.secondary">Không tìm thấy phòng nào phù hợp với bộ lọc</Typography>
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
      </TableContainer>
    </Box>
  );
};

export default RoomMatrix;
