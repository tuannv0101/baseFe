import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  Divider,
  Avatar,
} from '@mui/material';
import { Save, ArrowBack, Person, ContactPhone, Info } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants';

const TenantEdit = ({ isCreate = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    idCard: '',
    dob: '',
    address: '',
    status: 'active',
    note: '',
  });

  useEffect(() => {
    if (!isCreate && id) {
      // Mock fetch existing data - In real app would fetch from API
      setForm({
        fullName: 'Nguyễn Văn A',
        email: 'vana@gmail.com',
        phone: '0901234567',
        idCard: '012345678901',
        dob: '1995-05-20',
        address: 'Hà Nội',
        status: 'active',
        note: 'Khách hàng thân thiết',
      });
    }
  }, [id, isCreate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving tenant:', form);
    // TODO: Call API
    navigate(ROUTES.HOST_TENANTS);
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader 
        title={isCreate ? "Thêm mới Khách thuê" : "Chỉnh sửa Khách thuê"} 
        breadcrumbs={[
          { label: 'Khách thuê', path: ROUTES.HOST_TENANTS }, 
          { label: isCreate ? 'Thêm mới' : form.fullName }
        ]}
      />

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
          {/* Left Column - Main Info */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person color="primary" /> Thông tin cơ bản
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={2.5} sx={{ width: '100%', m: 0 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    placeholder="VD: Nguyễn Văn A"
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Số CCCD/CMND"
                    name="idCard"
                    value={form.idCard}
                    onChange={handleChange}
                    required
                    placeholder="12 chữ số"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    name="dob"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={form.dob}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Giới tính"
                    name="gender"
                    select
                    defaultValue="male"
                    onChange={handleChange}
                  >
                    <MenuItem value="male">Nam</MenuItem>
                    <MenuItem value="female">Nữ</MenuItem>
                    <MenuItem value="other">Khác</MenuItem>
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Địa chỉ thường trú"
                    name="address"
                    multiline
                    rows={2}
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Số nhà, đường, phường/xã..."
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 4 }}>
                <ContactPhone color="primary" /> Liên hệ
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2.5} sx={{ width: '100%', m: 0 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="09xx xxx xxx"
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Right Column - Status & Extra */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Info color="primary" /> Trạng thái & Ghi chú
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Trạng thái khách"
                    name="status"
                    select
                    value={form.status}
                    onChange={handleChange}
                  >
                    <MenuItem value="active">Đang thuê</MenuItem>
                    <MenuItem value="inactive">Đã rời đi</MenuItem>
                    <MenuItem value="pending">Chờ duyệt</MenuItem>
                  </TextField>

                  <TextField
                    fullWidth
                    label="Ghi chú thêm"
                    name="note"
                    multiline
                    rows={4}
                    value={form.note}
                    onChange={handleChange}
                    placeholder="Đặc điểm nhận dạng, thói quen..."
                  />
                </Stack>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'primary.light', color: 'primary.contrastText', border: '1px dashed', borderColor: 'primary.main' }}>
                 <Typography variant="body2" sx={{ color: 'primary.main', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Info fontSize="small" /> Lưu ý: Thông tin CCCD sẽ được dùng để đối chiếu trong hợp đồng pháp lý.
                 </Typography>
              </Paper>

              <Box sx={{ mt: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Button 
                    fullWidth
                    variant="outlined" 
                    startIcon={<ArrowBack />} 
                    onClick={() => navigate(-1)}
                    sx={{ borderRadius: 2, py: 1.5 }}
                  >
                    Hủy
                  </Button>
                  <Button 
                    fullWidth
                    type="submit" 
                    variant="contained" 
                    startIcon={<Save />}
                    sx={{ borderRadius: 2, py: 1.5, boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)' }}
                  >
                    {isCreate ? "Tạo mới" : "Cập nhật"}
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default TenantEdit;
