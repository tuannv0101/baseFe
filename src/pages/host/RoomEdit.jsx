import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Divider,
  TextField,
  MenuItem,
  Button,
  Stack,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TableContainer,
} from '@mui/material';
import { Add, Edit, Delete, ArrowBack } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants';
import roomManagementService from '../../services/host/roomManagement/service';
import propertyManagementService from '../../services/host/propertyManagement/service';

const statusOptions = [
  { value: 'AVAILABLE', label: 'Trống' },
  { value: 'OCCUPIED', label: 'Đang thuê' },
  { value: 'MAINTENANCE', label: 'Bảo trì' },
];

const typeOptions = [
  { value: 'Studio', label: 'Studio' },
  { value: '1BR', label: '1 Phòng ngủ' },
  { value: '2BR', label: '2 Phòng ngủ' },
  { value: 'Penthouse', label: 'Penthouse' },
];

const RoomEdit = ({ isCreate = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const buildingIdFromQuery = queryParams.get('buildingId');

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  
  const [form, setForm] = useState({
    propertiesId: buildingIdFromQuery || '',
    roomNumber: '',
    type: 'Studio',
    price: 0,
    area: '',
    floor: '',
    status: 'AVAILABLE',
    assets: [],
  });

  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [assetDraft, setAssetDraft] = useState({
    name: '',
    brand: '',
    serialNumber: '',
    status: 'NEW',
  });
  const [editingAssetId, setEditingAssetId] = useState(null);

  useEffect(() => {
    fetchProperties();
    if (!isCreate && id) {
      fetchRoomDetail();
    }
  }, [id, isCreate]);

  const fetchProperties = async () => {
    try {
      const response = await propertyManagementService.getAllProperties();
      const data = response?.data?.items || response?.data || response || [];
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách tòa nhà:', error);
    }
  };

  const fetchRoomDetail = async () => {
    setLoading(true);
    try {
      const response = await roomManagementService.getRoomById(id);
      const data = response?.data || response;
      if (data) {
        setForm({
          propertiesId: data.propertyId || data.propertiesId || '',
          roomNumber: data.roomNumber || '',
          type: data.type || data.typeRoom || 'Studio',
          price: data.price || 0,
          area: data.area || '',
          floor: data.floor || '',
          status: data.status || data.statusRoom || 'AVAILABLE',
          assets: data.assets || data.roomAssetResDTOS || [],
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết phòng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        propertiesId: form.propertiesId,
        area: String(form.area),
        floor: String(form.floor),
        roomNumber: form.roomNumber,
        type: form.type,
        price: Number(form.price),
        roomAssetCreateReqDTOS: form.assets.map(a => ({
          name: a.name,
          brand: a.brand,
          serialNumber: a.serialNumber,
          status: a.status,
        })),
      };

      if (isCreate) {
        await roomManagementService.createRoom(payload);
      } else {
        await roomManagementService.updateRoom(id, payload);
      }
      
      // Quay lại màn hình trước đó hoặc danh sách phòng
      if (form.propertiesId) {
        navigate(ROUTES.HOST_BUILDING_DETAIL.replace(':id', form.propertiesId));
      } else {
        navigate(ROUTES.HOST_ROOMS);
      }
    } catch (error) {
      console.error('Lỗi khi lưu phòng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Asset handlers
  const handleOpenAddAsset = () => {
    setAssetDraft({ name: '', brand: '', serialNumber: '', status: 'NEW' });
    setEditingAssetId(null);
    setAssetDialogOpen(true);
  };

  const handleOpenEditAsset = (asset) => {
    setAssetDraft({
      name: asset.name || '',
      brand: asset.brand || '',
      serialNumber: asset.serialNumber || '',
      status: asset.status || 'NEW',
    });
    setEditingAssetId(asset.id);
    setAssetDialogOpen(true);
  };

  const handleSubmitAsset = () => {
    if (!assetDraft.name.trim()) return;

    if (editingAssetId) {
      setForm(prev => ({
        ...prev,
        assets: prev.assets.map(item =>
          item.id === editingAssetId ? { ...assetDraft, id: editingAssetId } : item
        ),
      }));
    } else {
      const newAsset = { ...assetDraft, id: Date.now() };
      setForm(prev => ({ ...prev, assets: [...prev.assets, newAsset] }));
    }
    setAssetDialogOpen(false);
  };

  const handleDeleteAsset = (assetId) => {
    setForm(prev => ({
      ...prev,
      assets: prev.assets.filter(item => item.id !== assetId),
    }));
  };

  if (loading && !isCreate) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title={isCreate ? 'Thêm phòng mới' : 'Chỉnh sửa phòng'}
        breadcrumbs={[
          { label: 'Quản lý tài sản' },
          { label: 'Tòa nhà', path: ROUTES.HOST_BUILDINGS },
          { label: isCreate ? 'Thêm phòng' : form.roomNumber }
        ]}
      />

      <Button 
        startIcon={<ArrowBack />} 
        onClick={handleCancel}
        sx={{ mb: 2 }}
      >
        Quay lại
      </Button>

      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>Thông tin cơ bản</Typography>
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tòa nhà"
              name="propertiesId"
              select
              value={form.propertiesId}
              onChange={handleChange}
              required
              size="small"
            >
              {properties.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Số phòng / Tên phòng"
              name="roomNumber"
              value={form.roomNumber}
              onChange={handleChange}
              required
              size="small"
              placeholder="Ví dụ: P.101"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Loại phòng"
              name="type"
              select
              value={form.type}
              onChange={handleChange}
              size="small"
            >
              {typeOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Giá thuê (VNĐ)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Trạng thái"
              name="status"
              select
              value={form.status}
              onChange={handleChange}
              size="small"
            >
              {statusOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Diện tích (m2)"
              name="area"
              type="number"
              value={form.area}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tầng"
              name="floor"
              type="number"
              value={form.floor}
              onChange={handleChange}
              size="small"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>Tiện nghi & Nội thất</Typography>
          <Button variant="outlined" size="small" startIcon={<Add />} onClick={handleOpenAddAsset}>
            Thêm tiện nghi
          </Button>
        </Box>

        <TableContainer variant="outlined" sx={{ borderRadius: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 700 }}>Tên tài sản</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Thương hiệu</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Số Serial</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tình trạng</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {form.assets.length > 0 ? form.assets.map((asset) => (
                <TableRow key={asset.id || asset.serialNumber}>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.brand || '-'}</TableCell>
                  <TableCell>{asset.serialNumber || '-'}</TableCell>
                  <TableCell>
                    <Chip label={asset.status} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenEditAsset(asset)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteAsset(asset.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                    <Typography variant="body2" color="text.secondary">Chưa có tiện nghi nào được thêm</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button variant="outlined" onClick={handleCancel} disabled={loading}>Hủy</Button>
          <Button variant="contained" onClick={handleSave} disabled={loading} sx={{ px: 4 }}>
            {loading ? <CircularProgress size={24} /> : (isCreate ? 'Tạo phòng' : 'Lưu thay đổi')}
          </Button>
        </Stack>
      </Paper>

      {/* Dialog thêm/sửa tài sản */}
      <Dialog open={assetDialogOpen} onClose={() => setAssetDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editingAssetId ? 'Sửa tiện nghi' : 'Thêm tiện nghi'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Tên tài sản"
              size="small"
              value={assetDraft.name}
              onChange={(e) => setAssetDraft({ ...assetDraft, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Thương hiệu"
              size="small"
              value={assetDraft.brand}
              onChange={(e) => setAssetDraft({ ...assetDraft, brand: e.target.value })}
            />
            <TextField
              fullWidth
              label="Số Serial"
              size="small"
              value={assetDraft.serialNumber}
              onChange={(e) => setAssetDraft({ ...assetDraft, serialNumber: e.target.value })}
            />
            <TextField
              fullWidth
              label="Tình trạng"
              size="small"
              select
              value={assetDraft.status}
              onChange={(e) => setAssetDraft({ ...assetDraft, status: e.target.value })}
            >
              <MenuItem value="NEW">Mới (NEW)</MenuItem>
              <MenuItem value="GOOD">Tốt (GOOD)</MenuItem>
              <MenuItem value="USED">Đã sử dụng (USED)</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssetDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmitAsset}>Xác nhận</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomEdit;
