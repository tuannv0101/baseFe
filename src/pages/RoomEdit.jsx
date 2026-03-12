import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import { ROUTES } from '../constants';
import hostService from '../services/host/service';

const roomDetailMock = {
  roomId: 13,
  propertyId: 1,
  propertyName: 'name1',
  propertyAddress: '123',
  tenantId: null,
  tenantFullName: null,
  idCardNumber: '',
  contactPhone: '',
  area: 40.0,
  floor: 3,
  price: '6600000',
  roomNumber: 'P.401',
  status: 'AVAILABLE',
  type: '2BR',
  assets: [
    { id: 171, name: 'Giuong doi', brand: 'IKEA', serialNumber: 'BED-IK-7788', status: 'NEW' },
    { id: 172, name: 'Dem', brand: 'Everon', serialNumber: 'MAT-EV-1122', status: 'NEW' },
    { id: 173, name: 'Tu quan ao', brand: 'IKEA', serialNumber: 'WARD-IK-9911', status: 'GOOD' },
    { id: 174, name: 'Ban lam viec', brand: 'IKEA', serialNumber: 'DESK-IK-5566', status: 'GOOD' },
    { id: 175, name: 'Ghe', brand: 'Hoa Phat', serialNumber: 'CHAIR-HP-7781', status: 'GOOD' },
    { id: 176, name: 'Dieu hoa', brand: 'Daikin', serialNumber: 'AC-DK-3321', status: 'GOOD' },
    { id: 177, name: 'Tu lanh', brand: 'Panasonic', serialNumber: 'FR-PN-8891', status: 'GOOD' },
    { id: 178, name: 'May giat', brand: 'LG', serialNumber: 'WM-LG-2211', status: 'GOOD' },
    { id: 179, name: 'Binh nong lanh', brand: 'Ariston', serialNumber: 'WH-AR-3321', status: 'GOOD' },
    { id: 180, name: 'TV', brand: 'Samsung', serialNumber: 'TV-SS-9001', status: 'GOOD' },
    { id: 181, name: 'Quat', brand: 'Asia', serialNumber: 'FAN-AS-7711', status: 'GOOD' },
    { id: 182, name: 'Den tran', brand: 'Philips', serialNumber: 'LAMP-PH-2201', status: 'NEW' },
    { id: 183, name: 'Router Wifi', brand: 'TP-Link', serialNumber: 'WF-TP-7781', status: 'GOOD' },
    { id: 185, name: 'Bep dien', brand: 'Sunhouse', serialNumber: 'ST-SH-1123', status: 'GOOD' },
  ],
  servicePrices: [
    { id: 1, name: 'Dien', unit: 'kWh', price: 3500 },
    { id: 2, name: 'Nuoc', unit: 'm3', price: 15000 },
    { id: 3, name: 'Internet', unit: 'thang', price: 200000 },
    { id: 4, name: 'Giu xe', unit: 'thang', price: 80000 },
  ],
};

const statusOptions = [
  { value: 'AVAILABLE', label: 'AVAILABLE' },
  { value: 'OCCUPIED', label: 'OCCUPIED' },
  { value: 'MAINTENANCE', label: 'MAINTENANCE' },
];

const typeOptions = [
  { value: 'Studio', label: 'Studio' },
  { value: '1BR', label: '1BR' },
  { value: '2BR', label: '2BR' },
  { value: 'Penthouse', label: 'Penthouse' },
];

const RoomEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  const initialForm = useMemo(() => {
    if (!id) return roomDetailMock;
    return {
      ...roomDetailMock,
      roomId: Number(id) || roomDetailMock.roomId,
      roomNumber: `P.${id}`,
    };
  }, [id]);

  const [form, setForm] = useState(initialForm);
  const [lookup, setLookup] = useState({ loading: false, error: '' });
  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [assetDraft, setAssetDraft] = useState({
    name: '',
    brand: '',
    serialNumber: '',
    status: 'NEW',
  });
  const [editingAssetId, setEditingAssetId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const idCardNumber = (form.idCardNumber || '').trim();
    if (!idCardNumber) {
      setLookup({ loading: false, error: '' });
      setForm(prev => ({ ...prev, tenantFullName: '', tenantId: null, contactPhone: '' }));
      return;
    }

    let active = true;
    setLookup({ loading: true, error: '' });

    const timer = setTimeout(async () => {
      try {
        const response = await hostService.getTenantByIdCardNumber(idCardNumber);
        const tenant = response?.data ?? response?.data?.data ?? null;
        const tenantFullName = tenant?.tenantFullName || tenant?.fullName || tenant?.name || '';
        const tenantId = tenant?.tenantId ?? tenant?.id ?? null;
        const contactPhone = tenant?.phoneNumber || tenant?.phone || tenant?.mobile || tenant?.contactPhone || '';

        if (!active) return;
        if (tenantFullName) {
          setForm(prev => ({ ...prev, tenantFullName, tenantId, contactPhone }));
          setLookup({ loading: false, error: '' });
        } else {
          setLookup({ loading: false, error: "Khong tim thay nguoi thue" });
        }
      } catch (error) {
        if (!active) return;
        setLookup({ loading: false, error: "Khong tim thay nguoi thue" });
      }
    }, 400);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [form.idCardNumber]);

  const handleSave = () => {
    // TODO: hook API update
    const detailPath = ROUTES.HOST_ROOM_DETAIL.replace(':id', form.roomId);
    navigate(detailPath);
  };

  const handleCancel = () => {
    const detailPath = ROUTES.HOST_ROOM_DETAIL.replace(':id', form.roomId);
    navigate(detailPath);
  };

  const handleOpenAddAsset = () => {
    setAssetDraft({ name: '', brand: '', serialNumber: '', status: 'NEW' });
    setEditingAssetId(null);
    setAssetDialogOpen(true);
  };

  const handleCloseAddAsset = () => {
    setAssetDialogOpen(false);
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

  const handleAssetDraftChange = (e) => {
    const { name, value } = e.target;
    setAssetDraft(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitAsset = () => {
    const name = assetDraft.name.trim();
    if (!name) return;

    if (editingAssetId) {
      setForm(prev => ({
        ...prev,
        assets: prev.assets.map(item =>
          item.id === editingAssetId
            ? {
                ...item,
                name,
                brand: assetDraft.brand.trim(),
                serialNumber: assetDraft.serialNumber.trim(),
                status: assetDraft.status,
              }
            : item
        ),
      }));
    } else {
      const newAsset = {
        id: Date.now(),
        name,
        brand: assetDraft.brand.trim(),
        serialNumber: assetDraft.serialNumber.trim(),
        status: assetDraft.status,
      };
      setForm(prev => ({ ...prev, assets: [newAsset, ...(prev.assets || [])] }));
    }

    setAssetDialogOpen(false);
    setEditingAssetId(null);
  };

  const handleEditAsset = (asset) => {
    handleOpenEditAsset(asset);
  };

  const handleDeleteAsset = (assetId) => {
    setForm(prev => ({
      ...prev,
      assets: prev.assets.filter(item => item.id !== assetId),
    }));
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Chinh sua phong"
        breadcrumbs={[{ label: 'Quan ly Tai san' }, { label: 'Danh sach Phong' }, { label: form.roomNumber }, { label: 'Chinh sua' }]}
      />

      <Paper sx={{ p: 2.5, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Ma phong"
              value={form.roomId}
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Phong"
              name="roomNumber"
              value={form.roomNumber}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Toa nha"
              name="propertyName"
              value={form.propertyName}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Dia chi"
              name="propertyAddress"
              value={form.propertyAddress}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="So CCCD/CMND"
              name="idCardNumber"
              value={form.idCardNumber || ''}
              onChange={handleChange}
              helperText={lookup.loading ? "Dang tim..." : lookup.error}
              error={Boolean(lookup.error)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Nguoi thue"
              name="tenantFullName"
              value={form.tenantFullName || ''}
              onChange={handleChange}
              disabled
              helperText="Tu dong theo so CCCD/CMND"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="So dien thoai lien he"
              name="contactPhone"
              value={form.contactPhone || ''}
              onChange={handleChange}
              disabled
              helperText="Tu dong theo so CCCD/CMND"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Loai phong"
              name="type"
              select
              value={form.type}
              onChange={handleChange}
            >
              {typeOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Trang thai"
              name="status"
              select
              value={form.status}
              onChange={handleChange}
            >
              {statusOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Gia"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 1 }}>
          <Tab label="Danh sach tien nghi" />
          <Tab label="Gia dich vu chung" />
        </Tabs>

        {tab === 0 && (
          <>
            <Stack direction="row" justifyContent="flex-end" sx={{ mb: 1 }}>
              <Button variant="outlined" startIcon={<Add />} onClick={handleOpenAddAsset}>
                Them tien nghi
              </Button>
            </Stack>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Tai san</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Hang</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Serial</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Trang thai</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Thao tac</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {form.assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>{asset.name}</TableCell>
                    <TableCell>{asset.brand}</TableCell>
                    <TableCell>{asset.serialNumber}</TableCell>
                    <TableCell>{asset.status}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEditAsset(asset)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteAsset(asset.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}

        {tab === 1 && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Dich vu</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Don vi</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Gia</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {form.servicePrices.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell align="right">{item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={handleCancel}>Quay lai</Button>
          <Button variant="contained" onClick={handleSave}>Luu</Button>
        </Stack>
      </Paper>

      <Dialog open={assetDialogOpen} onClose={handleCloseAddAsset} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAssetId ? 'Chinh sua tien nghi' : 'Them tien nghi'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Ten tai san"
                name="name"
                value={assetDraft.name}
                onChange={handleAssetDraftChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Hang"
                name="brand"
                value={assetDraft.brand}
                onChange={handleAssetDraftChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Serial"
                name="serialNumber"
                value={assetDraft.serialNumber}
                onChange={handleAssetDraftChange}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Trang thai"
                name="status"
                select
                value={assetDraft.status}
                onChange={handleAssetDraftChange}
              >
                <MenuItem value="NEW">NEW</MenuItem>
                <MenuItem value="GOOD">GOOD</MenuItem>
                <MenuItem value="USED">USED</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddAsset}>Huy</Button>
          <Button variant="contained" onClick={handleSubmitAsset}>
            {editingAssetId ? 'Luu' : 'Them'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomEdit;
