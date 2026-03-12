import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
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
} from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import { ROUTES } from '../constants';

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleBack = () => {
    navigate(ROUTES.HOST_ROOMS);
  };

  const handleEdit = () => {
    const editPath = ROUTES.HOST_ROOM_EDIT.replace(':id', detail.roomId);
    navigate(editPath);
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Chi tiết phòng"
        breadcrumbs={[{ label: 'Quản lý Tài sản' }, { label: 'Danh sách Phòng' }, { label: detail.roomNumber }]}
      />

      <Paper sx={{ p: 2.5, borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Mã phòng</Typography>
            <Typography variant="body1" fontWeight={600}>{detail.roomId}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Phòng</Typography>
            <Typography variant="body1" fontWeight={600}>{detail.roomNumber}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Mã tện nghi</Typography>
            <Typography variant="body1" fontWeight={600}>{detail.propertyId}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Tòa nhà</Typography>
            <Typography variant="body1" fontWeight={600}>{detail.propertyName}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Địa chỉ</Typography>
            <Typography variant="body1" fontWeight={600}>{detail.propertyAddress}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Người thuê</Typography>
            <Typography variant="body1" fontWeight={600}>
              {detail.tenantFullName || 'Trống'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">So dien thoai lien he</Typography>
            <Typography variant="body1" fontWeight={600}>{detail.contactPhone || 'Trong'}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="text.secondary">Diện tích</Typography>
            <Typography variant="body1" fontWeight={600}>{detail.area} m2</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="text.secondary">Tầng</Typography>
            <Typography variant="body1" fontWeight={600}>{detail.floor}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="caption" color="text.secondary">Loại phòng</Typography>
            <Typography variant="body1" fontWeight={600}>{detail.type}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Trạng thái</Typography>
            <Typography variant="body1" fontWeight={600}>{detail.status}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary">Giá</Typography>
            <Typography variant="body1" fontWeight={600}>{formatPrice(Number(detail.price))}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 1 }}>
          <Tab label="Danh sach tien nghi" />
          <Tab label="Gia dich vu chung" />
        </Tabs>

        {tab === 0 && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Tai san</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Hang</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Serial</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trang thai</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detail.assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.brand}</TableCell>
                  <TableCell>{asset.serialNumber}</TableCell>
                  <TableCell>{asset.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
              {detail.servicePrices.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell align="right">{formatPrice(item.price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={handleBack}>Quay lại</Button>
          <Button variant="contained" onClick={handleEdit}>Chỉnh sửa</Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default RoomDetail;
