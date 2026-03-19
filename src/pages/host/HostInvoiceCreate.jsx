import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Stack,
  Button,
  Divider,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { ArrowBack, Save } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants';

const HostInvoiceCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: 'INCOME',
    status: 'PENDING',
    date: dayjs(),
    tenant: '',
    room: '',
    amount: '',
    note: '',
  });

  const isValid = form.tenant.trim() && form.room.trim() && Number(form.amount) > 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!isValid) return;

    const createdInvoice = {
      id: null,
      tenant: form.tenant.trim(),
      room: form.room.trim(),
      amount: Number(form.amount),
      date: dayjs(form.date || dayjs()).format('DD/MM/YYYY'),
      status: form.status,
      type: form.type,
      note: form.note?.trim() || '',
    };

    localStorage.setItem('host_created_invoice', JSON.stringify(createdInvoice));
    navigate(ROUTES.HOST_FINANCE);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ pb: 4 }}>
        <PageHeader
          title="Thêm hóa đơn"
          breadcrumbs={[{ label: 'Bảng điều khiển' }, { label: 'Tài chính', path: ROUTES.HOST_FINANCE }, { label: 'Thêm hóa đơn' }]}
        />

        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Quay lại
        </Button>

        <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }} elevation={0}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
            Thông tin hóa đơn
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Màn hình này hiện đang lưu tạm vào state (mock) và đưa về trang Tài chính.
          </Typography>

          <Grid container spacing={2.5} sx={{ width: '100%', m: 0 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Loại"
                name="type"
                value={form.type}
                onChange={handleChange}
              >
                <MenuItem value="INCOME">Khoản thu</MenuItem>
                <MenuItem value="EXPENSE">Khoản chi</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Trạng thái"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <MenuItem value="PENDING">Chờ thanh toán</MenuItem>
                <MenuItem value="PAID">Đã thanh toán</MenuItem>
                <MenuItem value="OVERDUE">Quá hạn</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                label="Ngày hóa đơn"
                value={form.date}
                onChange={(v) => setForm((prev) => ({ ...prev, date: v }))}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Số tiền (VND)"
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                label="Đối tượng / Người thuê / Nhà cung cấp"
                name="tenant"
                value={form.tenant}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                label="Nội dung / Phòng / Hạng mục"
                name="room"
                value={form.room}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                label="Ghi chú"
                name="note"
                value={form.note}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" spacing={1.5} justifyContent="flex-end">
            <Button variant="outlined" color="inherit" onClick={() => navigate(-1)}>
              Hủy
            </Button>
            <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={!isValid}>
              Lưu hóa đơn
            </Button>
          </Stack>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default HostInvoiceCreate;
