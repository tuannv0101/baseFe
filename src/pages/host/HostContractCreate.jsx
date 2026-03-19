import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import {
  Box,
  Paper,
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants';
import propertyManagementService from '../../services/host/propertyManagement/service';
import tenantManagementService from '../../services/host/tenantManagement/service';
import { contractManagementService } from '../../services/host/contractManagement';
import fileService from '../../services/fileService';

const initialForm = {
  propertyId: '',
  roomId: '',
  tenantId: '',
  tenantName: '',
  idCardNumber: '',
  startDate: null,
  endDate: null,
  actualRent: '',
  depositAmount: '',
  status: 'ACTIVE',
  contractFiles: [],
};

const statusConfig = {
  'AVAILABLE': 'Trống',
  'OCCUPIED': 'Đang thuê',
  'MAINTENANCE': 'Bảo trì',
};

const normalizeList = (response) => {
  const list =
    response?.data?.items ??
    response?.data ??
    response?.content ??
    response?.data?.content ??
    response?.items ??
    response?.rooms ??
    [];

  return Array.isArray(list) ? list : [];
};

const HostContractCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loadingProps, setLoadingProps] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingProps(true);
        setLoadingTenants(true);
        const [propsRes, tenantsRes] = await Promise.all([
          propertyManagementService.getAllProperties(),
          tenantManagementService.getTenants({ size: 9999 })
        ]);
        setProperties(normalizeList(propsRes));
        setTenants(normalizeList(tenantsRes));
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu ban đầu:', error);
      } finally {
        setLoadingProps(false);
        setLoadingTenants(false);
      }
    };
    loadInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePropertyChange = async (e) => {
    const propertyId = e.target.value;
    setForm(prev => ({ ...prev, propertyId, roomId: '' }));
    setRooms([]);
    if (!propertyId) return;

    try {
      setLoadingRooms(true);
      const response = await propertyManagementService.getRoomMatrix(propertyId);
      setRooms(normalizeList(response));
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleTenantChange = (e) => {
    const tenantId = e.target.value;
    const selectedTenant = tenants.find(t => t.id === tenantId);
    if (selectedTenant) {
      setForm(prev => ({ 
        ...prev, 
        tenantId, 
        tenantName: selectedTenant.fullName,
        idCardNumber: selectedTenant.idCardNumber || ''
      }));
    } else {
      setForm(prev => ({ ...prev, tenantId: '', tenantName: '', idCardNumber: '' }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setForm(prev => ({
      ...prev,
      contractFiles: [...(prev.contractFiles || []), ...files],
    }));
    e.target.value = '';
  };

  const handleRemoveFile = (index) => {
    setForm(prev => ({
      ...prev,
      contractFiles: prev.contractFiles.filter((_, i) => i !== index),
    }));
  };

  const handlePreviewFile = (file) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleCancel = () => {
    navigate(ROUTES.HOST_CONTRACTS);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // 1. Prepare payload for creating contract first
      const payload = {
        propertyId: form.propertyId,
        roomId: form.roomId,
        tenantId: form.tenantId,
        tenantName: form.tenantName,
        idCardNumber: form.idCardNumber,
        actualRent: Number(form.actualRent),
        depositAmount: Number(form.depositAmount),
        status: form.status,
        startDate: form.startDate ? dayjs(form.startDate).format('YYYY-MM-DD') : undefined,
        endDate: form.endDate ? dayjs(form.endDate).format('YYYY-MM-DD') : undefined,
      };

      // 2. Create the contract to get an ID
      const response = await contractManagementService.createContract(payload);
      
      // Get the new contract ID from response
      // Check different common response structures
      const contractId = response?.data?.id ?? response?.id;

      if (!contractId) {
        throw new Error('Không lấy được ID hợp đồng sau khi tạo.');
      }

      // 3. Upload all files with refId = contractId
      if (form.contractFiles && form.contractFiles.length > 0) {
        try {
          // Upload all files in one go
          await fileService.upload(form.contractFiles, contractId);
        } catch (uploadError) {
          console.error('Lỗi khi tải lên các file:', uploadError);
          // Optional: Inform user about upload failure even if contract was created
        }
      }

      navigate(ROUTES.HOST_CONTRACTS);
    } catch (error) {
      console.error('Lỗi khi lưu hợp đồng:', error);
      // Bạn có thể thêm thông báo lỗi cho người dùng ở đây (như dùng Snackbar)
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Thêm hợp đồng mới"
        breadcrumbs={[{ label: 'Chủ trọ' }, { label: 'Hợp đồng thuê' }, { label: 'Thêm mới' }]}
      />

      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2.5} sx={{ width: '100%', m: 0 }}>
            {/* Phần 1: Thông tin phòng */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" fontWeight={700} color="primary" sx={{ mb: 1 }}>
                Thông tin phòng trọ
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Chọn tòa nhà"
                name="propertyId"
                select
                value={form.propertyId}
                onChange={handlePropertyChange}
                fullWidth
                required
              >
                <MenuItem value="">-- Chọn tòa nhà --</MenuItem>
                {properties.map((item) => (
                  <MenuItem key={item.id ?? item.propertyId} value={item.id ?? item.propertyId}>
                    {item.name || item.propertyName || item.code || item.id}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Chọn phòng"
                name="roomId"
                select
                value={form.roomId}
                onChange={handleChange}
                fullWidth
                required
                disabled={!form.propertyId || loadingRooms}
              >
                <MenuItem value="">{loadingRooms ? 'Đang tải danh sách phòng...' : '-- Chọn phòng --'}</MenuItem>
                {rooms.map((room) => {
                  const roomValue = room.roomId ?? room.id;
                  const roomLabel = room.roomNumber || room.roomNo || room.code || room.roomId || room.id;
                  const roomStatus = statusConfig[room.status] || room.status || 'N/A';
                  return (
                    <MenuItem key={roomValue} value={roomValue}>
                      {roomLabel} ({roomStatus})
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            {/* Phần 2: Thông tin khách thuê */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" fontWeight={700} color="primary" sx={{ mt: 2, mb: 1 }}>
                Thông tin khách thuê
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Người đại diện"
                name="tenantId"
                select
                value={form.tenantId}
                onChange={handleTenantChange}
                fullWidth
                required
                disabled={loadingTenants}
              >
                <MenuItem value="">{loadingTenants ? 'Đang tải...' : '-- Chọn người đại diện --'}</MenuItem>
                {tenants.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.fullName} {t.phone ? `- ${t.phone}` : ''}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="CCCD/CMND"
                name="idCardNumber"
                value={form.idCardNumber}
                onChange={handleChange}
                fullWidth
                placeholder="Tự động điền hoặc nhập tay"
              />
            </Grid>

            {/* Phần 3: Thông tin hợp đồng */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" fontWeight={700} color="primary" sx={{ mt: 2, mb: 1 }}>
                Chi tiết hợp đồng
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {/* Bắt đầu và kết thúc chung 1 grid item để thành 1 "cột" logic */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={2}>
                <DatePicker
                  label="Ngày bắt đầu"
                  value={form.startDate ? dayjs(form.startDate) : null}
                  onChange={(value) => setForm(prev => ({ ...prev, startDate: value }))}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
                <DatePicker
                  label="Ngày kết thúc"
                  value={form.endDate ? dayjs(form.endDate) : null}
                  onChange={(value) => setForm(prev => ({ ...prev, endDate: value }))}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Giá thuê (VND)"
                name="actualRent"
                type="number"
                value={form.actualRent}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                label="Tiền cọc (VND)"
                name="depositAmount"
                type="number"
                value={form.depositAmount}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Trạng thái"
                name="status"
                select
                value={form.status}
                onChange={handleChange}
                fullWidth
              >
                <MenuItem value="ACTIVE">Kích hoạt (Active)</MenuItem>
                <MenuItem value="PENDING">Chờ xử lý (Pending)</MenuItem>
                <MenuItem value="EXPIRED">Hết hạn (Expired)</MenuItem>
              </TextField>
            </Grid>

            {/* Phần 4: Hình ảnh/Tài liệu */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>Hình ảnh hợp đồng</Typography>
              <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 2, textAlign: 'center' }}>
                <Button variant="outlined" component="label" sx={{ mb: 1 }}>
                  Tải ảnh lên
                  <input type="file" multiple hidden accept="image/*" onChange={handleFileChange} />
                </Button>
                <Typography variant="caption" display="block" color="text.secondary">
                  Hỗ trợ định dạng .jpg, .png. Tối đa 5 file.
                </Typography>
              </Box>

              {form.contractFiles?.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {form.contractFiles.map((file, index) => (
                    <Chip
                      key={`${file.name}-${index}`}
                      label={file.name}
                      onDelete={() => handleRemoveFile(index)}
                      onClick={() => handlePreviewFile(file)}
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </LocalizationProvider>

        <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button variant="outlined" size="large" onClick={handleCancel} sx={{ px: 4 }} disabled={isSaving}>
            Hủy bỏ
          </Button>
          <Button 
            variant="contained" 
            size="large" 
            onClick={handleSave} 
            disabled={loadingProps || isSaving} 
            sx={{ px: 4 }}
          >
            {isSaving ? 'Đang lưu...' : 'Lưu hợp đồng'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default HostContractCreate;
