import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {
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
  alpha,
} from '@mui/material';
import { Search, Business, Edit, RestartAlt, Add, LocationOn, Layers, AddBox, Description } from '@mui/icons-material';
import PageHeader from '../../../components/common/PageHeader';
import { ROUTES } from '../../../constants';
import propertyManagementService from '../../../services/host/propertyManagement/service';

const StatPill = ({ label, value, color }) => (
  <Paper
    elevation={0}
    sx={{
      px: 1.5,
      py: 1,
      borderRadius: 3,
      border: '1px solid #e2e8f0',
      bgcolor: alpha(color, 0.06),
      minWidth: 150,
    }}
  >
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
      {label}
    </Typography>
    <Typography fontWeight={900} sx={{ color: '#0f172a' }}>
      {value}
    </Typography>
  </Paper>
);

const BuildingList = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const [searchForm, setSearchForm] = useState({ name: '', status: '' });

  const [openDialog, setOpenDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentBuilding, setCurrentBuilding] = useState({ id: null, name: '', address: '', totalFloors: '', contractCode: '' });

  const fetchBuildings = useCallback(async () => {
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
  }, [page, rowsPerPage, searchForm.name]);

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  const stats = useMemo(() => {
    const total = totalElements || buildings.length;
    const totalRooms = buildings.reduce((sum, b) => sum + Number(b.totalRooms || 0), 0);
    const occupied = buildings.reduce((sum, b) => sum + Number(b.occupiedRooms || 0), 0);
    const available = buildings.reduce((sum, b) => sum + Number(b.availableRooms || 0), 0);
    return { total, totalRooms, occupied, available };
  }, [buildings, totalElements]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setPage(0);
    fetchBuildings();
  };

  const handleReset = () => {
    setSearchForm({ name: '', status: '' });
    setPage(0);
    if (page === 0) fetchBuildings();
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenAddDialog = () => {
    setIsEdit(false);
    setCurrentBuilding({ id: null, name: '', address: '', totalFloors: '', contractCode: '' });
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

  const handleDialogClose = () => setOpenDialog(false);
  const handleDialogInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBuilding((prev) => ({ ...prev, [name]: value }));
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

  const handleAddRoom = (buildingId) => navigate(`${ROUTES.HOST_ROOM_CREATE}?buildingId=${buildingId}`);

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Quản lý Tòa nhà"
        breadcrumbs={[{ label: 'Quản lý Tài sản' }, { label: 'Danh sách Tòa nhà' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAddDialog}
            sx={{ borderRadius: 2.5, fontWeight: 900, boxShadow: '0 8px 18px rgba(37, 99, 235, 0.18)' }}
          >
            Thêm tòa nhà
          </Button>
        }
      />

      <Paper elevation={0} sx={{ p: 2.5, mb: 2.5, borderRadius: 4, border: '1px solid #e2e8f0' }}>
        <Grid container spacing={2} alignItems="center" sx={{ width: '100%', m: 0 }}>
          <Grid size={{ xs: 12, md: 5 }}>
            <TextField
              fullWidth
              size="small"
              name="name"
              value={searchForm.name}
              onChange={handleInputChange}
              placeholder="Tìm theo tên tòa nhà…"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleReset} startIcon={<RestartAlt />} sx={{ borderRadius: 2.5, fontWeight: 900 }}>
                Đặt lại
              </Button>
              <Button variant="contained" onClick={handleSearch} sx={{ borderRadius: 2.5, fontWeight: 900 }}>
                Tìm kiếm
              </Button>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Stack direction="row" spacing={1.25} sx={{ flexWrap: 'wrap' }}>
              <StatPill label="Tổng tòa nhà" value={stats.total} color="#2563eb" />
              <StatPill label="Tổng phòng" value={stats.totalRooms} color="#0ea5e9" />
              <StatPill label="Đang thuê" value={stats.occupied} color="#10b981" />
              <StatPill label="Trống" value={stats.available} color="#f59e0b" />
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <Box sx={{ px: 3, py: 2.25, bgcolor: '#fcfcfd', borderBottom: '1px solid #f1f5f9' }}>
          <Typography variant="h6" fontWeight={900}>
            Danh sách tòa nhà
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Quản lý thông tin, thêm phòng và xem chi tiết
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#fcfcfd' }}>
                  <TableCell sx={{ fontWeight: 900 }}>Tòa nhà</TableCell>
                  <TableCell sx={{ fontWeight: 900 }} align="center">
                    Số tầng
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900 }} align="center">
                    Tổng phòng
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900 }} align="center">
                    Đang thuê
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900 }} align="center">
                    Trống
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900 }} align="center">
                    Bảo trì
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900 }} align="right">
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {buildings.map((building) => (
                  <TableRow key={building.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.25} alignItems="flex-start">
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2.25,
                            bgcolor: alpha('#2563eb', 0.12),
                            color: '#2563eb',
                            display: 'grid',
                            placeItems: 'center',
                            flex: '0 0 auto',
                            mt: 0.25,
                          }}
                        >
                          <Business sx={{ fontSize: 20 }} />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            fontWeight={900}
                            color="primary"
                            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                            onClick={() => navigate(ROUTES.HOST_BUILDING_DETAIL.replace(':id', building.id))}
                          >
                            {building.name || `Tòa nhà #${building.id}`}
                          </Typography>
                          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: 'text.secondary', mt: 0.25 }}>
                            <LocationOn sx={{ fontSize: 14 }} />
                            <Typography variant="caption" noWrap>
                              {building.address || 'Chưa cập nhật địa chỉ'}
                            </Typography>
                          </Stack>
                          {building.contractCode && (
                            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: 'text.secondary', mt: 0.25 }}>
                              <Description sx={{ fontSize: 14 }} />
                              <Typography variant="caption" noWrap>
                                {building.contractCode}
                              </Typography>
                            </Stack>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={building.totalFloors || 0}
                        size="small"
                        variant="outlined"
                        icon={<Layers sx={{ fontSize: 16 }} />}
                        sx={{ fontWeight: 900, minWidth: 64 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={building.totalRooms || 0} size="small" color="info" variant="outlined" sx={{ fontWeight: 900, minWidth: 64 }} />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={building.occupiedRooms || 0} size="small" color="primary" variant="outlined" sx={{ fontWeight: 900, minWidth: 64 }} />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={building.availableRooms || 0} size="small" color="success" variant="outlined" sx={{ fontWeight: 900, minWidth: 64 }} />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={building.maintenanceRooms || 0} size="small" color="warning" variant="outlined" sx={{ fontWeight: 900, minWidth: 64 }} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Thêm phòng">
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
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography variant="body2" color="text.secondary">
                        Không tìm thấy tòa nhà nào
                      </Typography>
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
              sx={{ borderTop: '1px solid #f1f5f9' }}
            />
          </>
        )}
      </TableContainer>

      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900 }}>{isEdit ? 'Chỉnh sửa tòa nhà' : 'Thêm tòa nhà mới'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ width: '100%', m: 0, mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Tên tòa nhà" name="name" value={currentBuilding.name} onChange={handleDialogInputChange} size="small" required />
            </Grid>
            <Grid size={{ xs: 12 }}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Số tầng" name="totalFloors" type="number" value={currentBuilding.totalFloors} onChange={handleDialogInputChange} size="small" required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Mã hợp đồng thuê"
                name="contractCode"
                value={currentBuilding.contractCode}
                onChange={handleDialogInputChange}
                size="small"
                InputProps={{ startAdornment: <InputAdornment position="start"><Description fontSize="small" /></InputAdornment> }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleDialogClose} color="inherit" sx={{ fontWeight: 900 }}>
            Hủy
          </Button>
          <Button onClick={handleSaveBuilding} variant="contained" color="primary" sx={{ fontWeight: 900 }}>
            Lưu thông tin
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BuildingList;
