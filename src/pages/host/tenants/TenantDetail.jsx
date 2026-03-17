import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Divider,
  Avatar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Edit, ArrowBack } from '@mui/icons-material';
import PageHeader from '../../../components/common/PageHeader';
import { ROUTES } from '../../../constants';
import tenantManagementService from '../../../services/host/tenantManagement/service';

const unwrapTenant = (payload) => {
  return payload?.data?.data ?? payload?.data ?? payload?.tenant ?? payload?.result ?? payload ?? null;
};

const normalizeTenant = (raw) => {
  if (!raw) return null;
  const id = raw?.tenantId ?? raw?.id ?? raw?.userId ?? null;
  const fullName = raw?.tenantFullName ?? raw?.fullName ?? raw?.name ?? raw?.displayName ?? '';
  const phone = raw?.phoneNumber ?? raw?.phone ?? raw?.mobile ?? raw?.contactPhone ?? '';
  const email = raw?.email ?? raw?.mail ?? '';
  const idCardNumber = raw?.idCardNumber ?? raw?.cccd ?? raw?.identityNumber ?? '';
  const portraitImageUrl = raw?.portraitImageUrl ?? raw?.avatarUrl ?? raw?.imageUrl ?? '';
  const temporaryResidenceDeclared = raw?.temporaryResidenceDeclared ?? raw?.declaredTemporaryResidence ?? null;
  const temporaryResidenceDeclaredAt = raw?.temporaryResidenceDeclaredAt ?? raw?.declaredAt ?? '';

  return {
    id,
    fullName,
    phone,
    email,
    idCardNumber,
    portraitImageUrl,
    temporaryResidenceDeclared,
    temporaryResidenceDeclaredAt,
    raw,
  };
};

const InfoRow = ({ label, value }) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '220px 1fr' }, gap: 1, py: 1 }}>
      <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>{label}</Typography>
      <Typography sx={{ wordBreak: 'break-word' }}>{value || '-'}</Typography>
    </Box>
  );
};

const TenantDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tenant, setTenant] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError('');
        const payload = await tenantManagementService.getTenantById(String(id));
        const raw = unwrapTenant(payload);
        const normalized = normalizeTenant(raw);
        if (!active) return;
        setTenant(normalized);
      } catch (err) {
        console.error(err);
        if (!active) return;
        setError('Khong tai duoc thong tin khach thue. Vui long thu lai.');
        setTenant(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [id]);

  const avatarText = useMemo(() => {
    const name = tenant?.fullName || '';
    return (name.trim().charAt(0) || '?').toUpperCase();
  }, [tenant]);

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Chi tiet khach thue"
        breadcrumbs={[{ label: 'Chu tro' }, { label: 'Khach thue' }, { label: 'Chi tiet' }]}
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
        {loading && (
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 2 }}>
            <CircularProgress size={18} />
            <Typography sx={{ color: 'text.secondary' }}>Loading...</Typography>
          </Stack>
        )}

        {!loading && tenant && (
          <>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Avatar
                src={tenant.portraitImageUrl || undefined}
                sx={{ width: 64, height: 64, bgcolor: 'primary.light', color: 'primary.main', fontWeight: 800 }}
              >
                {avatarText}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {tenant.fullName || '-'}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>ID: {tenant.id}</Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => navigate(ROUTES.HOST_TENANT_EDIT.replace(':id', tenant.id))}
              >
                Sua
              </Button>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <InfoRow label="So dien thoai" value={tenant.phone} />
            <InfoRow label="Email" value={tenant.email} />
            <InfoRow label="CCCD/CMND" value={tenant.idCardNumber} />
            <InfoRow
              label="Da khai bao tam tru"
              value={
                tenant.temporaryResidenceDeclared === null
                  ? '-'
                  : tenant.temporaryResidenceDeclared
                    ? 'Co'
                    : 'Khong'
              }
            />
            <InfoRow label="Thoi gian khai bao" value={tenant.temporaryResidenceDeclaredAt} />
          </>
        )}

        {!loading && !tenant && !error && (
          <Typography sx={{ color: 'text.secondary', py: 2 }}>No data.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default TenantDetail;
