import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
  Tabs,
  Tab,
  Chip,
  alpha,
  TableContainer,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, Edit, HomeWork, Person, Phone, SquareFoot, Layers, AttachMoney, Inventory2, Refresh } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants';
import roomManagementService from '../../services/host/roomManagement/service';

const fallbackRoomDetail = {
  roomId: 0,
  propertyId: null,
  propertyName: '',
  propertyAddress: '',
  tenantId: null,
  tenantFullName: null,
  contactPhone: null,
  area: null,
  floor: null,
  price: 0,
  roomNumber: '',
  status: 'AVAILABLE',
  type: '1BR',
  assets: [],
  servicePrices: [],
};

const statusMeta = {
  AVAILABLE: { label: 'Trống', color: '#10b981' },
  OCCUPIED: { label: 'Đang thuê', color: '#2563eb' },
  MAINTENANCE: { label: 'Bảo trì', color: '#f59e0b' },
};

const assetStatusMeta = {
  NEW: { label: 'Mới', color: '#10b981' },
  GOOD: { label: 'Tốt', color: '#2563eb' },
  BROKEN: { label: 'Hỏng', color: '#ef4444' },
};

const asArray = (value) => (Array.isArray(value) ? value : []);

const normalizeRoomDetail = (raw, roomId) => {
  const data = raw?.data ?? raw ?? {};

  const propertyId = data.propertyId ?? null;
  const propertyName = data.propertyName ?? '';
  const propertyAddress = data.propertyAddress ?? '';

  const tenantId = data.tenantId ?? null;
  const tenantFullName = data.tenantFullName ?? null;
  const contactPhone = data.contactPhone ?? null;

  const assets = asArray(data.assets).map((a, idx) => ({
    id: a.id ?? idx,
    name: a.name ?? '',
    brand: a.brand ?? '',
    serialNumber: a.serialNumber ?? '',
    status: a.status ?? 'GOOD',
  }));

  const servicePrices = asArray(data.services).map((s, idx) => ({
    id: s.serviceId ?? idx,
    name: s.serviceName ?? '',
    unit: s.unitType ?? '',
    price: Number(s.unitPrice ?? 0) || 0,
  }));

  return {
    ...fallbackRoomDetail,
    roomId: data.roomId ?? (Number(roomId) || fallbackRoomDetail.roomId),
    propertyId,
    propertyName,
    propertyAddress,
    tenantId,
    tenantFullName,
    contactPhone,
    area: data.area ?? null,
    floor: data.floor ?? null,
    price: Number(data.price ?? 0) || 0,
    roomNumber: data.roomNumber ?? (roomId ? `P.${roomId}` : ''),
    status: data.status ?? fallbackRoomDetail.status,
    type: data.type ?? fallbackRoomDetail.type,
    assets,
    servicePrices,
  };
};

const InfoItem = ({ icon, label, value }) => (
  <Stack direction="row" spacing={1.5} alignItems="flex-start">
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: 2.25,
        bgcolor: 'rgba(37, 99, 235, 0.08)',
        color: '#2563eb',
        display: 'grid',
        placeItems: 'center',
        flex: '0 0 auto',
        mt: 0.25,
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={800} sx={{ color: '#0f172a', wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Box>
  </Stack>
);

const RoomDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tab, setTab] = useState(0);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');

  const fetchRoomDetail = useCallback(async () => {
    if (!id) {
      setDetail(fallbackRoomDetail);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorText('');
    try {
      const res = await roomManagementService.getRoomDetail(id);
      setDetail(normalizeRoomDetail(res, id));
    } catch (err) {
      console.error(err);
      setErrorText('Không thể tải chi tiết phòng từ API. Đang hiển thị dữ liệu dự phòng.');
      setDetail(normalizeRoomDetail(fallbackRoomDetail, id));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRoomDetail();
  }, [fetchRoomDetail]);

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price) || 0);

  const computed = useMemo(() => {
    const d = detail || fallbackRoomDetail;
    const status = statusMeta[d.status] || { label: d.status, color: '#64748b' };
    const tenantName = d.tenantFullName || 'Trống';
    const tenantPhone = d.contactPhone || '—';
    return { d, status, tenantName, tenantPhone };
  }, [detail]);

  const handleBack = () => navigate(ROUTES.HOST_ROOMS);
  const handleEdit = () => navigate(ROUTES.HOST_ROOM_EDIT.replace(':id', String(computed.d.roomId || id || '')));

  if (loading && !detail) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title={`Chi tiết phòng ${computed.d.roomNumber || ''}`.trim()}
        breadcrumbs={[{ label: 'Host' }, { label: 'Danh sách phòng' }, { label: computed.d.roomNumber || `#${computed.d.roomId}` }]}
        actions={
          <Stack direction="row" spacing={1.25} sx={{ flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={handleBack} sx={{ borderRadius: 2.5, fontWeight: 900 }}>
              Quay lại
            </Button>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchRoomDetail} sx={{ borderRadius: 2.5, fontWeight: 900 }}>
              Tải lại
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleEdit}
              sx={{ borderRadius: 2.5, fontWeight: 900, boxShadow: '0 8px 18px rgba(37, 99, 235, 0.18)' }}
            >
              Chỉnh sửa
            </Button>
          </Stack>
        }
      />

      {errorText && (
        <Paper elevation={0} sx={{ p: 2, mb: 2.5, borderRadius: 3, border: '1px solid', borderColor: alpha('#f59e0b', 0.5), bgcolor: alpha('#f59e0b', 0.08) }}>
          <Typography variant="body2" fontWeight={800} sx={{ color: '#92400e' }}>
            {errorText}
          </Typography>
        </Paper>
      )}

      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              background: `linear-gradient(180deg, ${alpha(computed.status.color, 0.08)}, #ffffff 55%)`,
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                  <Typography variant="h5" fontWeight={900} sx={{ color: '#0f172a' }}>
                    {computed.d.roomNumber || `Phòng #${computed.d.roomId}`}
                  </Typography>
                  <Chip label={computed.status.label} sx={{ fontWeight: 900, bgcolor: alpha(computed.status.color, 0.12), color: computed.status.color }} />
                  <Chip label={computed.d.type || '—'} variant="outlined" sx={{ fontWeight: 900 }} />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  Tòa nhà: <Box component="span" sx={{ fontWeight: 900, color: '#0f172a' }}>{computed.d.propertyName || '—'}</Box> • {computed.d.propertyAddress || '—'}
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Paper elevation={0} sx={{ px: 2, py: 1.5, borderRadius: 3, border: '1px solid #e2e8f0', minWidth: 220 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box sx={{ width: 38, height: 38, borderRadius: 2.25, bgcolor: alpha('#10b981', 0.12), color: '#10b981', display: 'grid', placeItems: 'center' }}>
                      <AttachMoney sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Giá thuê
                      </Typography>
                      <Typography fontWeight={900} sx={{ color: '#0f172a' }}>
                        {formatPrice(computed.d.price)}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                <Paper elevation={0} sx={{ px: 2, py: 1.5, borderRadius: 3, border: '1px solid #e2e8f0', minWidth: 220 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box sx={{ width: 38, height: 38, borderRadius: 2.25, bgcolor: alpha('#2563eb', 0.12), color: '#2563eb', display: 'grid', placeItems: 'center' }}>
                      <SquareFoot sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Diện tích / Tầng
                      </Typography>
                      <Typography fontWeight={900} sx={{ color: '#0f172a' }}>
                        {computed.d.area ? `${computed.d.area} m²` : '—'} • Tầng {computed.d.floor ?? '—'}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
            <Typography variant="h6" fontWeight={900} sx={{ mb: 0.5 }}>
              Thông tin phòng
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Các thông tin cơ bản
            </Typography>

            <Stack spacing={2.25} sx={{ mt: 2.5 }}>
              <InfoItem icon={<Inventory2 sx={{ fontSize: 20 }} />} label="Mã phòng" value={computed.d.roomId ?? '—'} />
              <InfoItem icon={<HomeWork sx={{ fontSize: 20 }} />} label="Mã tòa nhà" value={computed.d.propertyId ?? '—'} />
              <InfoItem icon={<Layers sx={{ fontSize: 20 }} />} label="Loại phòng" value={computed.d.type || '—'} />
              <InfoItem icon={<SquareFoot sx={{ fontSize: 20 }} />} label="Diện tích" value={computed.d.area ? `${computed.d.area} m²` : '—'} />
              <InfoItem icon={<Layers sx={{ fontSize: 20 }} />} label="Tầng" value={computed.d.floor ?? '—'} />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
            <Typography variant="h6" fontWeight={900} sx={{ mb: 0.5 }}>
              Người thuê
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Thông tin liên hệ hiện tại
            </Typography>

            <Stack spacing={2.25} sx={{ mt: 2.5 }}>
              <InfoItem icon={<Person sx={{ fontSize: 20 }} />} label="Họ và tên" value={computed.tenantName} />
              <InfoItem icon={<Phone sx={{ fontSize: 20 }} />} label="Số điện thoại liên hệ" value={computed.tenantPhone} />
            </Stack>

            <Divider sx={{ my: 2.5 }} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
              <Button variant="outlined" sx={{ borderRadius: 2.5, fontWeight: 900 }}>
                Tạo hợp đồng
              </Button>
              <Button variant="outlined" sx={{ borderRadius: 2.5, fontWeight: 900 }}>
                Gửi thông báo
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              <Button variant="contained" sx={{ borderRadius: 2.5, fontWeight: 900 }}>
                Tạo hóa đơn
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2.5, bgcolor: '#fcfcfd', borderBottom: '1px solid #f1f5f9' }}>
              <Typography variant="h6" fontWeight={900}>
                Tiện nghi & Giá dịch vụ
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Danh sách tài sản trong phòng và đơn giá dịch vụ chung
              </Typography>
            </Box>

            <Box sx={{ px: 2.5, pt: 1.5 }}>
              <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ minHeight: 44 }}>
                <Tab label="Tiện nghi / tài sản" sx={{ fontWeight: 900, textTransform: 'none', minHeight: 44 }} />
                <Tab label="Giá dịch vụ chung" sx={{ fontWeight: 900, textTransform: 'none', minHeight: 44 }} />
              </Tabs>
            </Box>

            <Box sx={{ p: 2.5, pt: 2 }}>
              {tab === 0 && (
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#fcfcfd' }}>
                        <TableCell sx={{ fontWeight: 900 }}>Tài sản</TableCell>
                        <TableCell sx={{ fontWeight: 900 }}>Hãng</TableCell>
                        <TableCell sx={{ fontWeight: 900 }}>Serial</TableCell>
                        <TableCell sx={{ fontWeight: 900 }}>Trạng thái</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {computed.d.assets.map((asset) => {
                        const s = assetStatusMeta[asset.status] || { label: asset.status, color: '#64748b' };
                        return (
                          <TableRow key={asset.id} hover>
                            <TableCell sx={{ fontWeight: 800 }}>{asset.name}</TableCell>
                            <TableCell>{asset.brand}</TableCell>
                            <TableCell sx={{ fontFamily: 'monospace' }}>{asset.serialNumber}</TableCell>
                            <TableCell>
                              <Chip size="small" label={s.label} sx={{ fontWeight: 900, bgcolor: alpha(s.color, 0.12), color: s.color }} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {computed.d.assets.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              Chưa có tài sản
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {tab === 1 && (
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#fcfcfd' }}>
                        <TableCell sx={{ fontWeight: 900 }}>Dịch vụ</TableCell>
                        <TableCell sx={{ fontWeight: 900 }}>Đơn vị</TableCell>
                        <TableCell sx={{ fontWeight: 900 }} align="right">
                          Giá
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {computed.d.servicePrices.map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell sx={{ fontWeight: 800 }}>{item.name}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 900 }}>
                            {formatPrice(item.price)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {computed.d.servicePrices.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              Chưa có dữ liệu dịch vụ
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoomDetail;
