import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { ROUTES } from '../constants';
import propertyManagementService from '../services/host/propertyManagement/service';

const initialForm = {
  propertyId: '',
  roomId: '',
  tenantName: '',
  idCardNumber: '',
  startDate: null,
  endDate: null,
  rent: '',
  deposit: '',
  status: 'ACTIVE',
  contractFiles: [],
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
  const [loadingProps, setLoadingProps] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoadingProps(true);
        const response = await propertyManagementService.getAllProperties();
        setProperties(normalizeList(response));
      } finally {
        setLoadingProps(false);
      }
    };
    loadProperties();
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
      console.log(response);
      
      setRooms(normalizeList(response));
    } finally {
      setLoadingRooms(false);
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

  const handleSave = () => {
    // TODO: call API create and upload file
    navigate(ROUTES.HOST_CONTRACTS);
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Them hop dong"
        breadcrumbs={[{ label: 'Chu tro' }, { label: 'Hop dong thue' }, { label: 'Them hop dong' }]}
      />

      <Paper sx={{ p: 2.5, borderRadius: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Toa nha"
              name="propertyId"
              select
              value={form.propertyId}
              onChange={handlePropertyChange}
              fullWidth
            >
              <MenuItem value="">Chon toa nha</MenuItem>
              {properties.map((item) => (
                <MenuItem key={item.id ?? item.propertyId} value={item.id ?? item.propertyId}>
                  {item.name || item.propertyName || item.code || item.id}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Phong"
              name="roomId"
              select
              value={form.roomId}
              onChange={handleChange}
              fullWidth
              disabled={!form.propertyId || loadingRooms}
            >
              <MenuItem value="">{loadingRooms ? 'Dang tai phong...' : 'Chon phong'}</MenuItem>
              {rooms.map((room) => {
                const roomValue = room.roomId ?? room.id;
                const roomLabel = room.roomNumber || room.roomNo || room.code || room.roomId || room.id;
                return (
                  <MenuItem key={roomValue} value={roomValue}>
                    {roomLabel}
                  </MenuItem>
                );
              })}
            </TextField>
            <TextField
              label="Nguoi thue"
              name="tenantName"
              value={form.tenantName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="CCCD/CMND"
              name="idCardNumber"
              value={form.idCardNumber}
              onChange={handleChange}
              fullWidth
            />
            <DatePicker
              label="Bat dau"
              value={form.startDate ? dayjs(form.startDate) : null}
              onChange={(value) => setForm(prev => ({ ...prev, startDate: value }))}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DatePicker
              label="Ket thuc"
              value={form.endDate ? dayjs(form.endDate) : null}
              onChange={(value) => setForm(prev => ({ ...prev, endDate: value }))}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <TextField
              label="Tien thue"
              name="rent"
              type="number"
              value={form.rent}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Tien coc"
              name="deposit"
              type="number"
              value={form.deposit}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Trang thai"
              name="status"
              select
              value={form.status}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="EXPIRED">EXPIRED</MenuItem>
            </TextField>
          </Box>
        </LocalizationProvider>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Upload anh hop dong</Typography>
          <Button variant="outlined" component="label">
            Chon file
            <input type="file" multiple hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {form.contractFiles?.length > 0 && (
            <Box sx={{ mt: 1 }}>
              {form.contractFiles.map((file, index) => (
                <Stack key={`${file.name}-${index}`} direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                  <Button variant="text" size="small" onClick={() => handlePreviewFile(file)}>
                    {file.name}
                  </Button>
                  <Button variant="text" color="error" size="small" onClick={() => handleRemoveFile(index)}>
                    Xoa
                  </Button>
                </Stack>
              ))}
            </Box>
          )}
        </Box>

        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button variant="outlined" onClick={handleCancel}>Quay lai</Button>
          <Button variant="contained" onClick={handleSave} disabled={loadingProps}>Luu</Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default HostContractCreate;
