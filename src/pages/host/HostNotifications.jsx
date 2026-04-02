import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import {
  Autorenew,
  BuildCircle,
  NotificationsActive,
  ReceiptLong,
  Search,
  WarningAmber,
  WorkspacePremium,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import PageHeader from '../../components/common/PageHeader';
import { hostDashboardService, normalizeDashboardNotifications } from '../../services/host';

const typeConfig = {
  all: { label: 'Tất cả', color: '#2563eb', icon: <NotificationsActive /> },
  billing: { label: 'Công nợ', color: '#ef4444', icon: <ReceiptLong /> },
  contract: { label: 'Hợp đồng', color: '#2563eb', icon: <WorkspacePremium /> },
  maintenance: { label: 'Bảo trì', color: '#f59e0b', icon: <BuildCircle /> },
  general: { label: 'Khác', color: '#64748b', icon: <WarningAmber /> },
};

const severityOptions = [
  { value: 'ALL', label: 'Tất cả mức độ' },
  { value: 'high', label: 'Cao' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'low', label: 'Thấp' },
];

const getSeverityTone = (severity) => {
  const value = String(severity || '').toLowerCase();
  if (value.includes('high') || value.includes('urgent') || value.includes('critical')) return { label: 'Cao', color: 'error' };
  if (value.includes('low')) return { label: 'Thấp', color: 'success' };
  return { label: 'Trung bình', color: 'warning' };
};

const formatDateTime = (value) => {
  if (!value) return 'Mới phát sinh';
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('DD/MM/YYYY HH:mm') : String(value);
};

const NotificationCard = ({ item }) => {
  const config = typeConfig[item.type] || typeConfig.general;
  const severity = getSeverityTone(item.severity);
  const metaLine = [item.propertyName, item.roomNumber && `Phòng ${item.roomNumber}`, formatDateTime(item.createdAt)].filter(Boolean).join(' • ');

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.25,
        borderRadius: 4,
        border: '1px solid #e2e8f0',
        transition: 'all 140ms ease',
        '&:hover': {
          borderColor: alpha(config.color, 0.35),
          boxShadow: `0 12px 28px ${alpha(config.color, 0.12)}`,
          transform: 'translateY(-1px)',
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Avatar sx={{ width: 44, height: 44, bgcolor: alpha(config.color, 0.12), color: config.color }}>
          {config.icon}
        </Avatar>

        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} sx={{ mb: 0.75 }}>
            <Typography variant="subtitle1" fontWeight={900} sx={{ color: '#0f172a' }}>
              {item.title}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              <Chip
                label={config.label}
                size="small"
                sx={{ fontWeight: 800, bgcolor: alpha(config.color, 0.12), color: config.color }}
              />
              <Chip label={`Mức độ: ${severity.label}`} size="small" color={severity.color} variant="outlined" sx={{ fontWeight: 800 }} />
              {item.status && <Chip label={item.status} size="small" variant="outlined" sx={{ fontWeight: 800 }} />}
            </Stack>
          </Stack>

          {item.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {item.description}
            </Typography>
          )}

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {metaLine || 'Thông tin chi tiết sẽ hiển thị khi backend trả về dữ liệu đầy đủ.'}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

const HostNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [searchText, setSearchText] = useState('');

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await hostDashboardService.getNotifications({ limit: 50 });
      setNotifications(normalizeDashboardNotifications(response));
    } catch (fetchError) {
      setNotifications([]);
      setError('Không tải được danh sách cảnh báo từ backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const summary = useMemo(() => {
    const counts = { all: notifications.length, billing: 0, contract: 0, maintenance: 0, general: 0 };
    notifications.forEach((item) => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return counts;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return notifications.filter((item) => {
      if (selectedType !== 'all' && item.type !== selectedType) return false;

      const severityValue = String(item.severity || '').toLowerCase();
      if (severityFilter !== 'ALL' && !severityValue.includes(severityFilter.toLowerCase())) return false;

      if (!query) return true;
      const haystack = [item.title, item.description, item.propertyName, item.roomNumber, item.status]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [notifications, selectedType, severityFilter, searchText]);

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Thông báo vận hành"
        breadcrumbs={[{ label: 'Host' }, { label: 'Thông báo' }]}
        actions={
          <Button
            variant="outlined"
            startIcon={<Autorenew />}
            onClick={fetchNotifications}
            sx={{ borderRadius: 2.5, fontWeight: 900 }}
          >
            Làm mới
          </Button>
        }
      />

      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden', mb: 3 }}>
        <Box sx={{ px: 3, py: 2.5, bgcolor: '#fcfcfd', borderBottom: '1px solid #f1f5f9' }}>
          <Typography variant="h6" fontWeight={900}>
            Hộp thư cảnh báo cho chủ trọ
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Tổng hợp hóa đơn quá hạn, hợp đồng sắp hết hạn và yêu cầu bảo trì mới phát sinh.
          </Typography>
        </Box>

        <Box sx={{ px: 3, py: 2.5 }}>
          <Grid container spacing={2} sx={{ width: '100%', m: 0 }} alignItems="center">
            <Grid size={{ xs: 12, lg: 7 }}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {Object.entries(typeConfig)
                  .filter(([key]) => ['all', 'billing', 'contract', 'maintenance'].includes(key))
                  .map(([key, config]) => (
                    <Chip
                      key={key}
                      clickable
                      icon={config.icon}
                      label={`${config.label} (${summary[key] || 0})`}
                      onClick={() => setSelectedType(key)}
                      variant={selectedType === key ? 'filled' : 'outlined'}
                      sx={{
                        fontWeight: 900,
                        bgcolor: selectedType === key ? alpha(config.color, 0.12) : '#fff',
                        color: selectedType === key ? config.color : 'text.primary',
                        borderColor: alpha(config.color, 0.35),
                      }}
                    />
                  ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Mức độ"
                value={severityFilter}
                onChange={(event) => setSeverityFilter(event.target.value)}
              >
                {severityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Tìm cảnh báo..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {error && <Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <Box sx={{ px: 3, py: 2, bgcolor: '#fcfcfd', borderBottom: '1px solid #f1f5f9' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="subtitle1" fontWeight={900}>
                Danh sách cảnh báo
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {filteredNotifications.length} mục phù hợp với bộ lọc hiện tại
              </Typography>
            </Box>
            <Tooltip title="Nạp lại dữ liệu">
              <IconButton onClick={fetchNotifications} size="small">
                <Autorenew fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {loading ? (
          <Box sx={{ py: 10, display: 'grid', placeItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : filteredNotifications.length > 0 ? (
          <Stack spacing={0} divider={<Divider flexItem />} sx={{ p: 2 }}>
            {filteredNotifications.map((item) => (
              <NotificationCard key={item.id} item={item} />
            ))}
          </Stack>
        ) : (
          <Box sx={{ py: 10, px: 3, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">Không có cảnh báo nào khớp với bộ lọc hiện tại.</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default HostNotifications;
