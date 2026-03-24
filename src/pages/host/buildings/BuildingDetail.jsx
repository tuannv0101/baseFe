import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  IconButton,
  Stack,
  Button,
  Tooltip,
  CircularProgress,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Switch,
  FormControlLabel,
  alpha,
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
  Add,
  FlashOn,
  WaterDrop,
  Wifi,
  DeleteOutline,
  Payments,
  Settings,
  Save,
  Close,
  Elevator,
  DirectionsCar,
} from '@mui/icons-material';
import PageHeader from '../../../components/common/PageHeader';
import { ROUTES } from '../../../constants';
import propertyManagementService from '../../../services/host/propertyManagement/service';

const statusConfig = {
  AVAILABLE: { color: 'success', label: 'Trống' },
  OCCUPIED: { color: 'primary', label: 'Đang thuê' },
  MAINTENANCE: { color: 'warning', label: 'Bảo trì' },
};

const typeConfig = {
  '1BR': { color: 'info', label: 'Phòng đơn' },
  '2BR': { color: 'secondary', label: 'Phòng đôi' },
  SUITE: { color: 'error', label: 'Phòng VIP' },
};

const iconMap = {
  'Điện': <FlashOn />,
  'Nước': <WaterDrop />,
  Wifi: <Wifi />,
  'Rác': <DeleteOutline />,
  'Vệ sinh': <DeleteOutline />,
  'Rác & Vệ sinh': <DeleteOutline />,
  'Quản lý': <Settings />,
  'Phòng': <MeetingRoom />,
  'Thang máy': <Elevator />,
  'Gửi xe': <DirectionsCar />,
};

const colorMap = {
  'Điện': '#f59e0b',
  'Nước': '#2563eb',
  Wifi: '#10b981',
  'Rác': '#64748b',
  'Vệ sinh': '#64748b',
  'Rác & Vệ sinh': '#64748b',
  'Quản lý': '#7c3aed',
  'Thang máy': '#f97316',
  'Gửi xe': '#64748b',
};

const BuildingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [buildingInfo, setBuildingInfo] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [editingServices, setEditingServices] = useState([]);
  const [savingServices, setSavingServices] = useState(false);

  const normalizeService = useCallback((raw, index) => {
    const data = raw ?? {};
    const serviceName = data.name ?? data.serviceName ?? data.service_name ?? '';
    const serviceUnit = data.unit ?? data.unitType ?? data.unit_type ?? data.unitName ?? '';
    const rawPrice = data.price ?? data.unitPrice ?? data.unit_price ?? data.servicePrice ?? 0;
    const rawEnabled = data.enabled ?? data.isEnabled ?? data.active;

    const enabled =
      rawEnabled === undefined || rawEnabled === null
        ? true
        : rawEnabled === true || rawEnabled === 1 || rawEnabled === '1' || rawEnabled === 'true' || rawEnabled === 'Y' || rawEnabled === 'y';

    return {
      ...data,
      id: data.id ?? data.serviceId ?? index,
      serviceId: data.serviceId ?? data.id ?? null,
      name: serviceName,
      unit: serviceUnit,
      price: Number(rawPrice) || 0,
      enabled,
    };
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const serviceRes = await propertyManagementService.getPropertyServices(id);
      const rawList = serviceRes?.items ?? serviceRes?.data?.items ?? serviceRes?.data ?? serviceRes ?? [];
      const list = Array.isArray(rawList) ? rawList : [];
      if (list.length > 0) {
        setServices(list.map(normalizeService));
      } else {
        setServices([
          { id: '1', name: 'Điện', unit: 'kWh', price: 3500, enabled: true },
          { id: '2', name: 'Nước', unit: 'm³', price: 15000, enabled: true },
          { id: '3', name: 'Wifi', unit: 'Phòng', price: 100000, enabled: true },
          { id: '4', name: 'Rác & Vệ sinh', unit: 'Phòng', price: 50000, enabled: true },
          { id: '5', name: 'Thang máy', unit: 'Người', price: 50000, enabled: true },
          { id: '6', name: 'Gửi xe', unit: 'Xe', price: 100000, enabled: true },
        ]);
      }
    } catch {
      setServices([
        { id: '1', name: 'Điện', unit: 'kWh', price: 3500, enabled: true },
        { id: '2', name: 'Nước', unit: 'm³', price: 15000, enabled: true },
        { id: '3', name: 'Wifi', unit: 'Phòng', price: 100000, enabled: true },
        { id: '4', name: 'Rác & Vệ sinh', unit: 'Phòng', price: 50000, enabled: true },
        { id: '5', name: 'Thang máy', unit: 'Người', price: 50000, enabled: true },
        { id: '6', name: 'Gửi xe', unit: 'Xe', price: 100000, enabled: true },
      ]);
    }
  }, [id, normalizeService]);

  const fetchBuildingData = useCallback(async () => {
    setLoading(true);
    try {
      const propResponse = await propertyManagementService.getPropertyById(id);
      setBuildingInfo(propResponse?.data || propResponse);

      const roomResponse = await propertyManagementService.getRoomMatrix(id);
      setRooms(Array.isArray(roomResponse?.data?.items) ? roomResponse.data.items : Array.isArray(roomResponse) ? roomResponse : []);

      await fetchServices();
    } catch (error) {
      console.error('Lỗi khi tải thông tin tòa nhà:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchServices, id]);

  useEffect(() => {
    fetchBuildingData();
  }, [fetchBuildingData]);

  const handleOpenServiceDialog = () => {
    setEditingServices(JSON.parse(JSON.stringify(services)));
    setOpenServiceDialog(true);
  };

  const handleCloseServiceDialog = () => {
    if (!savingServices) setOpenServiceDialog(false);
  };

  const handleUpdateEditingService = (index, field, value) => {
    const updated = [...editingServices];
    const next = { ...updated[index], [field]: value };
    if (field === 'price') next.unitPrice = value;
    if (field === 'unit') next.unitType = value;
    if (field === 'enabled') next.isEnabled = value;
    updated[index] = next;
    setEditingServices(updated);
  };

  const handleSaveServices = async () => {
    setSavingServices(true);
    try {
      await propertyManagementService.updatePropertyServices(id, editingServices);
      setServices(editingServices);
      setOpenServiceDialog(false);
    } catch (error) {
      console.error('Lỗi khi lưu dịch vụ:', error);
      alert('Không thể lưu cấu hình dịch vụ. Vui lòng thử lại.');
    } finally {
      setSavingServices(false);
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price) || 0);
  };

  const getStatusDisplay = (status) => {
    const config = statusConfig[status] || { color: 'default', label: status || 'N/A' };
    return <Chip label={config.label} color={config.color} size="small" variant="outlined" sx={{ fontWeight: 900 }} />;
  };

  const getTypeDisplay = (type) => {
    const config = typeConfig[type] || { color: 'default', label: type || 'N/A' };
    return <Chip label={config.label} color={config.color} size="small" variant="outlined" sx={{ fontWeight: 900 }} />;
  };

  const building = buildingInfo || { name: 'Không tìm thấy', address: 'Chưa cập nhật' };

  const roomStats = useMemo(() => {
    const occupied = rooms.filter((r) => r.statusRoom === 'OCCUPIED').length;
    const available = rooms.filter((r) => r.statusRoom === 'AVAILABLE').length;
    const maintenance = rooms.filter((r) => r.statusRoom === 'MAINTENANCE').length;
    return { occupied, available, maintenance, total: rooms.length };
  }, [rooms]);

  const enabledServices = useMemo(() => services.filter((s) => s.enabled !== false), [services]);

  if (loading && !buildingInfo) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title={`Chi tiết ${building.name || 'Tòa nhà'}`}
        breadcrumbs={[{ label: 'Quản lý Tài sản' }, { label: 'Tòa nhà', path: ROUTES.HOST_BUILDINGS }, { label: building.name || 'Chi tiết' }]}
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(ROUTES.HOST_BUILDINGS)}
              sx={{ borderRadius: 2.5, fontWeight: 900 }}
            >
              Quay lại
            </Button>
            <Button
              variant="outlined"
              startIcon={<Settings />}
              onClick={handleOpenServiceDialog}
              sx={{ borderRadius: 2.5, fontWeight: 900 }}
            >
              Cấu hình dịch vụ
            </Button>
            <Button
              variant="contained"
              startIcon={<AddBox />}
              onClick={() => navigate(`${ROUTES.HOST_ROOM_CREATE}?buildingId=${id}`)}
              sx={{ borderRadius: 2.5, fontWeight: 900, boxShadow: '0 8px 18px rgba(37, 99, 235, 0.18)' }}
            >
              Thêm phòng
            </Button>
          </Stack>
        }
      />

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          mb: 3,
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          background: 'linear-gradient(180deg, rgba(37,99,235,0.08), #ffffff 55%)',
        }}
      >
        <Grid container spacing={3} alignItems="stretch" sx={{ width: '100%', m: 0 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2.25}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: alpha('#2563eb', 0.14),
                    color: '#2563eb',
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    boxShadow: '0 10px 20px rgba(37, 99, 235, 0.15)',
                  }}
                >
                  <Business sx={{ fontSize: 32 }} />
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h4" fontWeight={900} sx={{ color: '#0f172a', lineHeight: 1.1 }}>
                    {building.name}
                  </Typography>
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: 'text.secondary', mt: 0.75 }}>
                    <LocationOn sx={{ fontSize: 16 }} />
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {building.address || 'Chưa cập nhật địa chỉ'}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper elevation={0} sx={{ p: 1.75, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Layers sx={{ color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Quy mô tòa nhà
                        </Typography>
                        <Typography fontWeight={900} sx={{ color: '#0f172a' }}>
                          {building.totalFloors || 0} tầng
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper elevation={0} sx={{ p: 1.75, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <MeetingRoom sx={{ color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Tổng số phòng
                        </Typography>
                        <Typography fontWeight={900} sx={{ color: '#0f172a' }}>
                          {roomStats.total} phòng
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper elevation={0} sx={{ p: 1.75, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Elevator sx={{ color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Thang máy
                        </Typography>
                        <Typography fontWeight={900} sx={{ color: '#0f172a' }}>
                          {building.hasElevator !== false ? 'Có thang máy' : 'Không có'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper elevation={0} sx={{ p: 1.75, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <DirectionsCar sx={{ color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          Chỗ để xe
                        </Typography>
                        <Typography fontWeight={900} sx={{ color: '#0f172a' }}>
                          {building.hasParking !== false ? 'Có chỗ để xe' : 'Không có'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 4,
                border: '1px dashed',
                borderColor: alpha('#2563eb', 0.35),
                bgcolor: alpha('#2563eb', 0.05),
                height: '100%',
              }}
            >
              <Typography variant="subtitle2" fontWeight={900} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box component="span" sx={{ width: 4, height: 16, bgcolor: '#2563eb', borderRadius: 999 }} />
                Trạng thái phòng
              </Typography>

              <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
                <Grid size={{ xs: 4 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={900} sx={{ color: '#2563eb' }}>
                      {roomStats.occupied}
                    </Typography>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 10 }}>
                      Đang thuê
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={900} sx={{ color: '#10b981' }}>
                      {roomStats.available}
                    </Typography>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 10 }}>
                      Trống
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight={900} sx={{ color: '#f59e0b' }}>
                      {roomStats.maintenance}
                    </Typography>
                    <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: 10 }}>
                      Bảo trì
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2.5, borderStyle: 'dashed' }} />

              <Stack spacing={1.25}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddBox />}
                  onClick={() => navigate(`${ROUTES.HOST_ROOM_CREATE}?buildingId=${id}`)}
                  sx={{ borderRadius: 2.5, py: 1.1, fontWeight: 900, boxShadow: '0 8px 18px rgba(37, 99, 235, 0.18)' }}
                >
                  Thêm phòng
                </Button>
                <Button fullWidth variant="outlined" startIcon={<Settings />} onClick={handleOpenServiceDialog} sx={{ borderRadius: 2.5, py: 1.1, fontWeight: 900 }}>
                  Cấu hình dịch vụ
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={900} sx={{ mb: 0.5 }}>
          Dịch vụ chung của tòa nhà
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Chỉ hiển thị các dịch vụ đang bật
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ width: '100%', m: 0, mb: 3 }}>
        {enabledServices.map((service, index) => {
          const name = service.name ?? service.serviceName ?? '';
          const unit = service.unit ?? service.unitType ?? '';
          const price = service.price ?? service.unitPrice ?? 0;

          const color = colorMap[name] || '#2563eb';
          const icon = iconMap[name] || <Payments />;
          return (
            <Grid key={service.id || service.serviceId || index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.25,
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  bgcolor: '#ffffff',
                  transition: 'all 120ms ease',
                  '&:hover': { transform: 'translateY(-1px)', boxShadow: `0 12px 28px ${alpha(color, 0.12)}`, borderColor: alpha(color, 0.35) },
                }}
              >
                <Box sx={{ p: 1.25, borderRadius: 3, bgcolor: alpha(color, 0.12), color, display: 'grid', placeItems: 'center' }}>{icon}</Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight={900} sx={{ color: '#0f172a' }}>
                    {name}
                  </Typography>
                  <Typography variant="body2" fontWeight={900} sx={{ color }}>
                    {formatPrice(price)}
                    <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                      /{unit}
                    </Typography>
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
        {enabledServices.length === 0 && (
          <Grid size={{ xs: 12 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Chưa có dịch vụ nào được bật.
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Dialog open={openServiceDialog} onClose={handleCloseServiceDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 900, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={900} sx={{ lineHeight: 1.2 }}>
              Cấu hình dịch vụ
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {building.name}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseServiceDialog} size="small" disabled={savingServices}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ py: 0.5 }}>
            {editingServices.map((service, index) => {
              const name = service.name ?? service.serviceName ?? '';
              const unit = service.unitType ?? service.unit ?? '';
              const price = service.unitPrice ?? service.price ?? 0;

              const color = colorMap[name] || '#2563eb';
              const icon = iconMap[name] || <Payments fontSize="small" />;
              const disabled = service.enabled === false;
              return (
                <Box key={service.id || service.serviceId || index}>
                  <Stack direction="row" spacing={1.25} alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
                      <Box sx={{ p: 1, borderRadius: 2.5, bgcolor: alpha(color, 0.12), color, display: 'grid', placeItems: 'center', flex: '0 0 auto' }}>
                        {icon}
                      </Box>
                      <Typography variant="subtitle1" fontWeight={900} sx={{ color: '#0f172a' }}>
                        {name}
                      </Typography>
                    </Stack>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={service.enabled !== false}
                          onChange={(e) => handleUpdateEditingService(index, 'enabled', e.target.checked)}
                          disabled={savingServices}
                        />
                      }
                      label={<Typography variant="body2" fontWeight={800}>{service.enabled !== false ? 'Bật' : 'Tắt'}</Typography>}
                      sx={{ m: 0 }}
                    />
                  </Stack>

                  <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        label="Đơn giá"
                        type="number"
                        size="small"
                        value={price}
                        disabled={savingServices || disabled}
                        onChange={(e) => handleUpdateEditingService(index, 'price', Number(e.target.value))}
                        InputProps={{ endAdornment: <InputAdornment position="end">đ</InputAdornment> }}
                      />
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        fullWidth
                        label="Đơn vị"
                        size="small"
                        value={unit}
                        disabled={savingServices || disabled}
                        onChange={(e) => handleUpdateEditingService(index, 'unit', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  {index < editingServices.length - 1 && <Divider sx={{ mt: 2.5 }} />}
                </Box>
              );
            })}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={handleCloseServiceDialog} variant="outlined" color="inherit" disabled={savingServices} sx={{ borderRadius: 2.5, fontWeight: 900 }}>
            Hủy
          </Button>
          <Button
            onClick={handleSaveServices}
            variant="contained"
            startIcon={savingServices ? <CircularProgress size={20} color="inherit" /> : <Save />}
            disabled={savingServices}
            sx={{ borderRadius: 2.5, fontWeight: 900, px: 3, boxShadow: '0 8px 18px rgba(37, 99, 235, 0.18)' }}
          >
            {savingServices ? 'Đang lưu…' : 'Lưu cấu hình'}
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={900}>
            Danh sách phòng
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {roomStats.total} phòng
          </Typography>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: '#fcfcfd' }}>
                  <TableCell sx={{ fontWeight: 900 }}>Phòng</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Loại phòng</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Giá thuê</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>Khách thuê</TableCell>
                  <TableCell sx={{ fontWeight: 900 }} align="center">
                    Trạng thái
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900 }} align="right">
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((room, index) => (
                  <TableRow key={room.roomId || room.id || index} hover>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={900}
                        color="primary"
                        sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                        onClick={() => navigate(ROUTES.HOST_ROOM_DETAIL.replace(':id', room.roomId))}
                      >
                        {room.roomNumber || `Phòng ${room.id}`}
                      </Typography>
                    </TableCell>
                    <TableCell>{getTypeDisplay(room.typeRoom)}</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>{formatPrice(room.price)}</TableCell>
                    <TableCell>
                      {room.tenantName ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {room.tenantName}
                          </Typography>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                          Chưa có khách
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">{getStatusDisplay(room.status)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Xem chi tiết">
                          <IconButton size="small" onClick={() => navigate(ROUTES.HOST_ROOM_DETAIL.replace(':id', room.roomId))}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton size="small" color="info" onClick={() => navigate(ROUTES.HOST_ROOM_EDIT.replace(':id', room.roomId))}>
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
                          sx={{ mt: 1, fontWeight: 900, textTransform: 'none' }}
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
              sx={{ borderTop: '1px solid #f1f5f9' }}
            />
          </>
        )}
      </TableContainer>
    </Box>
  );
};

export default BuildingDetail;
