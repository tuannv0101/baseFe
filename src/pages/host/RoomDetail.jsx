import React, { useMemo, useState } from 'react';
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
} from '@mui/material';
import { ArrowBack, Edit, HomeWork, Person, Phone, SquareFoot, Layers, AttachMoney, Inventory2 } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants';

const roomDetailMock = {
  roomId: 13,
  propertyId: 1,
  propertyName: 'name1',
  propertyAddress: '123',
  tenantId: null,
  tenantFullName: null,
  contactPhone: null,
  area: 40.0,
  floor: 3,
  price: '6600000',
  roomNumber: 'P.401',
  status: 'AVAILABLE',
  type: '2BR',
  assets: [
    { id: 171, name: 'Giường đôi', brand: 'IKEA', serialNumber: 'BED-IK-7788', status: 'NEW' },
    { id: 172, name: 'Đệm', brand: 'Everon', serialNumber: 'MAT-EV-1122', status: 'NEW' },
    { id: 173, name: 'Tủ quần áo', brand: 'IKEA', serialNumber: 'WARD-IK-9911', status: 'GOOD' },
    { id: 174, name: 'Bàn làm việc', brand: 'IKEA', serialNumber: 'DESK-IK-5566', status: 'GOOD' },
    { id: 175, name: 'Ghế', brand: 'Hòa Phát', serialNumber: 'CHAIR-HP-7781', status: 'GOOD' },
    { id: 176, name: 'Điều hòa', brand: 'Daikin', serialNumber: 'AC-DK-3321', status: 'GOOD' },
    { id: 177, name: 'Tủ lạnh', brand: 'Panasonic', serialNumber: 'FR-PN-8891', status: 'GOOD' },
    { id: 178, name: 'Máy giặt', brand: 'LG', serialNumber: 'WM-LG-2211', status: 'GOOD' },
    { id: 179, name: 'Bình nóng lạnh', brand: 'Ariston', serialNumber: 'WH-AR-3321', status: 'GOOD' },
    { id: 180, name: 'TV', brand: 'Samsung', serialNumber: 'TV-SS-9001', status: 'GOOD' },
    { id: 181, name: 'Quạt', brand: 'Asia', serialNumber: 'FAN-AS-7711', status: 'GOOD' },
    { id: 182, name: 'Đèn trần', brand: 'Philips', serialNumber: 'LAMP-PH-2201', status: 'NEW' },
    { id: 183, name: 'Router Wifi', brand: 'TP-Link', serialNumber: 'WF-TP-7781', status: 'GOOD' },
    { id: 185, name: 'Bếp điện', brand: 'Sunhouse', serialNumber: 'ST-SH-1123', status: 'GOOD' },
  ],
  servicePrices: [
    { id: 1, name: 'Điện', unit: 'kWh', price: 3500 },
    { id: 2, name: 'Nước', unit: 'm³', price: 15000 },
    { id: 3, name: 'Internet', unit: 'tháng', price: 200000 },
    { id: 4, name: 'Giữ xe', unit: 'tháng', price: 80000 },
  ],
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

  const detail = useMemo(() => {
    if (!id) return roomDetailMock;
    return {
      ...roomDetailMock,
      roomId: Number(id) || roomDetailMock.roomId,
      roomNumber: `P.${id}`,
    };
  }, [id]);

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const status = statusMeta[detail.status] || { label: detail.status, color: '#64748b' };
  const tenantName = detail.tenantFullName || 'Trống';
  const tenantPhone = detail.contactPhone || '—';

  const handleBack = () => navigate(ROUTES.HOST_ROOMS);
  const handleEdit = () => navigate(ROUTES.HOST_ROOM_EDIT.replace(':id', String(detail.roomId)));

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title={`Chi tiết phòng ${detail.roomNumber}`}
        breadcrumbs={[{ label: 'Host' }, { label: 'Danh sách phòng' }, { label: detail.roomNumber }]}
        actions={
          <Stack direction="row" spacing={1.25}>
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={handleBack} sx={{ borderRadius: 2.5, fontWeight: 900 }}>
              Quay lại
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

      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              background: `linear-gradient(180deg, ${alpha(status.color, 0.08)}, #ffffff 55%)`,
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                  <Typography variant="h5" fontWeight={900} sx={{ color: '#0f172a' }}>
                    {detail.roomNumber}
                  </Typography>
                  <Chip label={status.label} sx={{ fontWeight: 900, bgcolor: alpha(status.color, 0.12), color: status.color }} />
                  <Chip label={detail.type} variant="outlined" sx={{ fontWeight: 900 }} />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  Tòa nhà: <Box component="span" sx={{ fontWeight: 900, color: '#0f172a' }}>{detail.propertyName}</Box> • {detail.propertyAddress}
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Paper elevation={0} sx={{ px: 2, py: 1.5, borderRadius: 3, border: '1px solid #e2e8f0', minWidth: 220 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 2.25,
                        bgcolor: alpha('#10b981', 0.12),
                        color: '#10b981',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <AttachMoney sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Giá thuê
                      </Typography>
                      <Typography fontWeight={900} sx={{ color: '#0f172a' }}>
                        {formatPrice(Number(detail.price))}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
                <Paper elevation={0} sx={{ px: 2, py: 1.5, borderRadius: 3, border: '1px solid #e2e8f0', minWidth: 220 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 2.25,
                        bgcolor: alpha('#2563eb', 0.12),
                        color: '#2563eb',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <SquareFoot sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Diện tích
                      </Typography>
                      <Typography fontWeight={900} sx={{ color: '#0f172a' }}>
                        {detail.area} m² • Tầng {detail.floor}
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
              <InfoItem icon={<Inventory2 sx={{ fontSize: 20 }} />} label="Mã phòng" value={detail.roomId} />
              <InfoItem icon={<HomeWork sx={{ fontSize: 20 }} />} label="Mã tòa nhà" value={detail.propertyId} />
              <InfoItem icon={<Layers sx={{ fontSize: 20 }} />} label="Loại phòng" value={detail.type} />
              <InfoItem icon={<SquareFoot sx={{ fontSize: 20 }} />} label="Diện tích" value={`${detail.area} m²`} />
              <InfoItem icon={<Layers sx={{ fontSize: 20 }} />} label="Tầng" value={detail.floor} />
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
              <InfoItem icon={<Person sx={{ fontSize: 20 }} />} label="Họ và tên" value={tenantName} />
              <InfoItem icon={<Phone sx={{ fontSize: 20 }} />} label="Số điện thoại liên hệ" value={tenantPhone} />
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
                      {detail.assets.map((asset) => {
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
                      {detail.servicePrices.map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell sx={{ fontWeight: 800 }}>{item.name}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 900 }}>
                            {formatPrice(item.price)}
                          </TableCell>
                        </TableRow>
                      ))}
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

