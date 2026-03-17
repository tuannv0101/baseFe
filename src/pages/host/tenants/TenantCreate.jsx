import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import PageHeader from '../../../components/common/PageHeader';
import { ROUTES } from '../../../constants';
import tenantManagementService from '../../../services/host/tenantManagement/service';

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  idCardNumber: '',
  portraitImageUrl: '',
  temporaryResidenceDeclared: false,
};

const TenantCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const fullName = (form.fullName || '').trim();
    if (!fullName) {
      setError('Vui long nhap ho ten.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const payload = {
        fullName,
        phone: (form.phone || '').trim() || undefined,
        email: (form.email || '').trim() || undefined,
        idCardNumber: (form.idCardNumber || '').trim() || undefined,
        portraitImageUrl: (form.portraitImageUrl || '').trim() || undefined,
        temporaryResidenceDeclared: Boolean(form.temporaryResidenceDeclared),
      };

      const res = await tenantManagementService.createTenant(payload);
      const created =
        res?.data?.data ??
        res?.data ??
        res?.tenant ??
        res?.result ??
        res;
      const id = created?.tenantId ?? created?.id ?? created?.userId ?? null;

      if (id) {
        navigate(ROUTES.HOST_TENANT_DETAIL.replace(':id', id));
      } else {
        navigate(ROUTES.HOST_TENANTS);
      }
    } catch (err) {
      console.error(err);
      setError('Tao khach thue that bai. Vui long thu lai.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Them khach thue"
        breadcrumbs={[{ label: 'Chu tro' }, { label: 'Khach thue' }, { label: 'Them' }]}
        action={{
          label: 'Quay lai',
          icon: <ArrowBack />,
          onClick: () => navigate(ROUTES.HOST_TENANTS),
        }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2.5, borderRadius: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Ho ten"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="So dien thoai"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
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
          <TextField
            label="Anh chan dung (URL)"
            name="portraitImageUrl"
            value={form.portraitImageUrl}
            onChange={handleChange}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(form.temporaryResidenceDeclared)}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, temporaryResidenceDeclared: e.target.checked }))
                }
              />
            }
            label="Da khai bao tam tru"
          />

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate(ROUTES.HOST_TENANTS)} disabled={saving}>
              Huy
            </Button>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save />}
              onClick={handleSave}
              disabled={saving}
            >
              Luu
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default TenantCreate;
