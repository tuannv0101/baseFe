import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Button,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Search,
  Business,
  Edit,
  RestartAlt,
  Add,
  LocationOn,
  Layers,
  AddBox,
  Description,
} from '@mui/icons-material';
import PageHeader from '../../../components/common/PageHeader';
import { ROUTES } from '../../../constants';
import propertyManagementService from '../../../services/host/propertyManagement/service';

const BuildingList = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Search form state
  const [searchForm, setSearchForm] = useState({
    name: '',
    status: '',
  });

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentBuilding, setCurrentBuilding] = useState({
    id: null,
    name: '',
    address: '',
    totalFloors: '',
    contractCode: '',
  });

  useEffect(() => {
    fetchBuildings();
  }, [page, rowsPerPage]);

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      const response = await propertyManagementService.getAllProperties({
        page,
        size: rowsPerPage,
        nameProperty: searchForm.name,
      });

      const data = response?.data ?? response;

      if (data) {
        setBuildings(data.items || []);
        setTotalElements(data.meta?.totalElements || 0);
      } else {
        setBuildings([]);
        setTotalElements(0);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách tòa nhà:', error);
      setBuildings([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setPage(0);
    fetchBuildings();
  };

  const handleReset = () => {
    const resetForm = { name: '', status: '' };
    setSearchForm(resetForm);
    setPage(0);
    if (page === 0) fetchBuildings();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAddDialog = () => {
    setIsEdit(false);
    setCurrentBuilding({
      id: null,
      name: '',
      address: '',
      totalFloors: '',
      contractCode: '',
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (building) => {
    setIsEdit(true);
    setCurrentBuilding({
      id: building.id,
      name: building.name || '',
      address: building.address || '',
      totalFloors: building.totalFloors || '',
      contractCode: building.contractCode || '',
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBuilding(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveBuilding = async () => {
    try {
      if (isEdit) {
        await propertyManagementService.updateProperty(currentBuilding.id, currentBuilding);
      } else {
        await propertyManagementService.createProperty(currentBuilding);
      }
      setOpenDialog(false);
      fetchBuildings();
    } catch (error) {
      console.error('Lỗi khi lưu thông tin tòa nhà:', error);
    }
  };

  const handleAddRoom = (buildingId) => {
    navigate(`${ROUTES.HOST_ROOM_CREATE}?buildingId=${buildingId}`);
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader 
        title="Quản lý Tòa nhà" 
        breadcrumbs={[{ label: 'Quản lý Tài sản' }, { label: 'Danh sách Tòa nhà' }]}
        action={{
          label: 'Thêm tòa nhà',
          icon: <Add />,
          onClick: handleOpenAddDialog
        }}  
      />

      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <TextField
            fullWidth
            size="small"
            name="name"
            placeholder="Tìm theo tên tòa nhà..."
            value={searchForm.name}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
              if (e.key === 'Escape') handleReset();
            }}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Business fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            justifyContent="flex-end"
            sx={{ flexShrink: 0 }}
          >
            <Button
              variant="contained"
              size="small"
              startIcon={<Search />}
              onClick={handleSearch}
              sx={{ px: 3, width: { xs: '100%', sm: 'auto' } }}
            >
              Tìm kiếm
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="inherit"
              startIcon={<RestartAlt />}
              onClick={handleReset}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              Làm mới
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50', width: '20%' }}>Tên tòa nhà</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50', width: '30%' }}>Địa chỉ</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.50', width: '10%' }}>Số tầng</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.50', width: '10%' }}>Đang thuê</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.50', width: '10%' }}>Phòng trống</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.50', width: '10%' }}>Bảo trì</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'grey.50', width: '10%' }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {buildings.map((building) => (
                    <TableRow key={building.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="primary" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => navigate(ROUTES.HOST_BUILDING_DETAIL.replace(':id', building.id))}>
                          {building.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <LocationOn sx={{ fontSize: '1rem' }} color="action" />
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 250 }}>
                            {building.address || 'Chưa cập nhật'}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={500}>{building.totalFloors || 0}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={building.occupiedRooms || 0} size="small" color="primary" variant="outlined" sx={{ fontWeight: 700, minWidth: 40 }} />
                      </TableCell>
                      <TableCell align="center">
                         <Chip label={building.availableRooms || 0} size="small" color="success" variant="outlined" sx={{ fontWeight: 700, minWidth: 40 }} />
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={building.maintenanceRooms || 0} size="small" color="warning" variant="outlined" sx={{ fontWeight: 700, minWidth: 40 }} />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="Thêm phòng trọ">
                            <IconButton size="small" color="primary" onClick={() => handleAddRoom(building.id)}>
                              <AddBox fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton size="small" color="info" onClick={() => handleOpenEditDialog(building)}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                {buildings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">Không tìm thấy tòa nhà nào</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={totalElements}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số dòng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} trên tổng số ${count !== -1 ? count : `hơn ${to}`}`}
              sx={{ borderTop: '1px solid #e0e0e0' }}
            />
          </>
        )}
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>
          {isEdit ? 'Chỉnh sửa tòa nhà' : 'Thêm tòa nhà mới'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên tòa nhà"
                name="name"
                value={currentBuilding.name}
                onChange={handleDialogInputChange}
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={currentBuilding.address}
                onChange={handleDialogInputChange}
                size="small"
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số tầng"
                name="totalFloors"
                type="number"
                value={currentBuilding.totalFloors}
                onChange={handleDialogInputChange}
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mã hợp đồng thuê"
                name="contractCode"
                value={currentBuilding.contractCode}
                onChange={handleDialogInputChange}
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Description fontSize="small" /></InputAdornment>
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleDialogClose} color="inherit">Hủy</Button>
          <Button onClick={handleSaveBuilding} variant="contained" color="primary">Lưu thông tin</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BuildingList;
