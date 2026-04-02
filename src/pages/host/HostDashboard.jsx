import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import {
  ArrowForwardIos,
  Autorenew,
  BuildCircle,
  HomeWork,
  NotificationsActive,
  Payments,
  Receipt,
  TrendingDown,
  TrendingUp,
  WarningAmber,
} from '@mui/icons-material';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import dayjs from 'dayjs';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants';
import { formatCurrency } from '../../utils/helpers';
import { hostDashboardService, normalizeDashboardNotifications, normalizeDashboardOverview } from '../../services/host';

const StatCard = ({ title, value, subtitle, icon, color }) => (
  <Card
    elevation={0}
    sx={{
      height: '100%',
      borderRadius: 4,
      border: '1px solid #e2e8f0',
      background: `linear-gradient(180deg, ${alpha(color, 0.1)}, #ffffff 62%)`,
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={900} sx={{ color: '#0f172a', mt: 0.5 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            {subtitle}
          </Typography>
        </Box>
        <Avatar
          variant="rounded"
          sx={{
            width: 52,
            height: 52,
            borderRadius: 3,
            bgcolor: alpha(color, 0.12),
            color,
            boxShadow: `0 10px 20px ${alpha(color, 0.16)}`,
          }}
        >
          {icon}
        </Avatar>
      </Stack>
    </CardContent>
  </Card>
);

const notificationTypeConfig = {
  billing: { label: 'Công nợ', color: '#ef4444', icon: <WarningAmber /> },
  contract: { label: 'Hợp đồng', color: '#2563eb', icon: <Autorenew /> },
  maintenance: { label: 'Bảo trì', color: '#f59e0b', icon: <BuildCircle /> },
  general: { label: 'Thông báo', color: '#64748b', icon: <NotificationsActive /> },
};

const formatPeriod = (value) => dayjs(`${value}-01`).isValid() ? dayjs(`${value}-01`).format('MM/YYYY') : value;

const formatDateTime = (value) => {
  if (!value) return 'Mới cập nhật';
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('DD/MM/YYYY HH:mm') : String(value);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const income = payload.find((entry) => entry.dataKey === 'income')?.value ?? 0;
  const expense = payload.find((entry) => entry.dataKey === 'expense')?.value ?? 0;
  const net = payload.find((entry) => entry.dataKey === 'net')?.value ?? 0;

  return (
    <Paper elevation={3} sx={{ p: 1.5, borderRadius: 3, border: '1px solid #e2e8f0' }}>
      <Typography variant="subtitle2" fontWeight={900} sx={{ color: '#0f172a', mb: 1 }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ display: 'block', color: '#10b981' }}>
        Thu: {formatCurrency(income)}
      </Typography>
      <Typography variant="caption" sx={{ display: 'block', color: '#ef4444' }}>
        Chi: {formatCurrency(expense)}
      </Typography>
      <Typography variant="caption" sx={{ display: 'block', color: '#2563eb' }}>
        Dòng tiền ròng: {formatCurrency(net)}
      </Typography>
    </Paper>
  );
};

const HostDashboard = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState(dayjs().format('YYYY-MM'));
  const [overview, setOverview] = useState(() => normalizeDashboardOverview(null));
  const [notifications, setNotifications] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [overviewError, setOverviewError] = useState('');
  const [notificationsError, setNotificationsError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    const period = dayjs(`${selectedPeriod}-01`);
    const month = period.isValid() ? period.month() + 1 : undefined;
    const year = period.isValid() ? period.year() : undefined;

    setLoadingOverview(true);
    setLoadingNotifications(true);
    setOverviewError('');
    setNotificationsError('');

    const [overviewResult, notificationsResult] = await Promise.allSettled([
      hostDashboardService.getOverview({ month, year }),
      hostDashboardService.getNotifications({ limit: 5 }),
    ]);

    if (overviewResult.status === 'fulfilled') {
      setOverview(normalizeDashboardOverview(overviewResult.value));
    } else {
      setOverview(normalizeDashboardOverview(null));
      setOverviewError('Không tải được dữ liệu tổng quan từ backend.');
    }

    if (notificationsResult.status === 'fulfilled') {
      setNotifications(normalizeDashboardNotifications(notificationsResult.value));
    } else {
      setNotifications([]);
      setNotificationsError('Không tải được danh sách cảnh báo mới nhất.');
    }

    setLoadingOverview(false);
    setLoadingNotifications(false);
  }, [selectedPeriod]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = useMemo(
    () => [
      {
        title: 'Tổng thu',
        value: formatCurrency(overview.totalIncome),
        subtitle: `Doanh thu kỳ ${formatPeriod(selectedPeriod)}`,
        color: '#10b981',
        icon: <TrendingUp />,
      },
      {
        title: 'Tổng chi',
        value: formatCurrency(overview.totalExpense),
        subtitle: 'Chi phí vận hành đã ghi nhận',
        color: '#ef4444',
        icon: <TrendingDown />,
      },
      {
        title: 'Dòng tiền ròng',
        value: formatCurrency(overview.netCashflow),
        subtitle: overview.netCashflow >= 0 ? 'Đang duy trì dương' : 'Cần theo dõi thêm',
        color: '#2563eb',
        icon: <Payments />,
      },
      {
        title: 'Tỷ lệ lấp đầy',
        value: `${Math.round(overview.occupancyRate)}%`,
        subtitle:
          overview.totalRooms > 0
            ? `${overview.occupiedRooms}/${overview.totalRooms} phòng đang có khách`
            : 'Chưa có dữ liệu phòng',
        color: '#f59e0b',
        icon: <HomeWork />,
      },
    ],
    [overview, selectedPeriod]
  );

  const notificationCounts = useMemo(() => {
    const counts = { billing: 0, contract: 0, maintenance: 0, general: 0 };
    notifications.forEach((item) => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return counts;
  }, [notifications]);

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Tổng quan Host"
        breadcrumbs={[{ label: 'Host' }, { label: 'Tổng quan' }]}
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
            <Button
              variant="outlined"
              onClick={fetchDashboardData}
              startIcon={<Autorenew />}
              sx={{ borderRadius: 2.5, fontWeight: 900 }}
            >
              Làm mới
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(ROUTES.HOST_NOTIFICATIONS)}
              startIcon={<NotificationsActive />}
              sx={{ borderRadius: 2.5, fontWeight: 900 }}
            >
              Xem cảnh báo
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate(ROUTES.HOST_INVOICE_CREATE)}
              startIcon={<Receipt />}
              sx={{ borderRadius: 2.5, fontWeight: 900, boxShadow: '0 8px 18px rgba(37, 99, 235, 0.18)' }}
            >
              Tạo hóa đơn
            </Button>
          </Stack>
        }
      />

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          background: 'linear-gradient(180deg, rgba(37,99,235,0.08), #ffffff 58%)',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ md: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight={900} sx={{ color: '#0f172a' }}>
              Hiệu suất vận hành theo tháng
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Tổng hợp thu, chi, công suất phòng và các cảnh báo quan trọng cho chủ trọ.
            </Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ sm: 'center' }}>
            <Typography variant="body2" fontWeight={800} color="text.secondary">
              Kỳ báo cáo
            </Typography>
            <Box
              component="input"
              type="month"
              value={selectedPeriod}
              onChange={(event) => setSelectedPeriod(event.target.value)}
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: 2,
                border: '1px solid #cbd5e1',
                bgcolor: '#ffffff',
                color: '#0f172a',
                font: 'inherit',
              }}
            />
          </Stack>
        </Stack>
      </Paper>

      {(overviewError || notificationsError) && (
        <Stack spacing={1.25} sx={{ mb: 3 }}>
          {overviewError && <Alert severity="warning">{overviewError}</Alert>}
          {notificationsError && <Alert severity="warning">{notificationsError}</Alert>}
        </Stack>
      )}

      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        {stats.map((item) => (
          <Grid key={item.title} size={{ xs: 12, sm: 6, xl: 3 }}>
            <StatCard {...item} />
          </Grid>
        ))}

        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
              <Box>
                <Typography variant="h6" fontWeight={900}>
                  Dòng tiền 6 tháng
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  So sánh thu, chi và dòng tiền ròng theo dữ liệu backend.
                </Typography>
              </Box>
              {loadingOverview && <CircularProgress size={24} />}
            </Stack>

            {loadingOverview ? (
              <Box sx={{ py: 12, display: 'grid', placeItems: 'center' }}>
                <CircularProgress />
              </Box>
            ) : overview.chart.length > 0 ? (
              <Box sx={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={overview.chart} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.24} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.22} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `${Math.round(value / 1000000)}M`} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2.5} fill="url(#incomeFill)" name="Thu" />
                    <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2.5} fill="url(#expenseFill)" name="Chi" />
                    <Line type="monotone" dataKey="net" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} name="Ròng" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box sx={{ py: 10, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body2">Chưa có dữ liệu biểu đồ trong kỳ đã chọn.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3} sx={{ height: '100%' }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
              <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
                Công suất phòng
              </Typography>

              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                  <Typography variant="h3" fontWeight={900} sx={{ color: '#0f172a' }}>
                    {Math.round(overview.occupancyRate)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {overview.occupiedRooms}/{overview.totalRooms || 0} phòng đang thuê
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.max(0, Math.min(100, overview.occupancyRate))}
                  sx={{
                    height: 10,
                    borderRadius: 999,
                    bgcolor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': { borderRadius: 999, bgcolor: '#2563eb' },
                  }}
                />
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  <Chip label={`Đang thuê: ${overview.occupiedRooms}`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 800 }} />
                  <Chip label={`Còn trống: ${overview.availableRooms}`} size="small" color="success" variant="outlined" sx={{ fontWeight: 800 }} />
                </Stack>
              </Stack>
            </Paper>

            <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden', flexGrow: 1 }}>
              <Box sx={{ px: 3, py: 2.5, bgcolor: '#fcfcfd', borderBottom: '1px solid #f1f5f9' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6" fontWeight={900}>
                      Cảnh báo gần đây
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Quá hạn hóa đơn, hợp đồng sắp hết hạn và yêu cầu bảo trì mới.
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="text"
                    endIcon={<ArrowForwardIos sx={{ fontSize: 14 }} />}
                    onClick={() => navigate(ROUTES.HOST_NOTIFICATIONS)}
                    sx={{ textTransform: 'none', fontWeight: 900 }}
                  >
                    Xem tất cả
                  </Button>
                </Stack>
              </Box>

              <Box sx={{ px: 3, py: 2 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={`Công nợ ${notificationCounts.billing || 0}`} size="small" sx={{ fontWeight: 800 }} />
                  <Chip label={`Hợp đồng ${notificationCounts.contract || 0}`} size="small" sx={{ fontWeight: 800 }} />
                  <Chip label={`Bảo trì ${notificationCounts.maintenance || 0}`} size="small" sx={{ fontWeight: 800 }} />
                </Stack>
              </Box>

              {loadingNotifications ? (
                <Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : notifications.length > 0 ? (
                <Stack divider={<Divider flexItem />} sx={{ px: 3, pb: 1 }}>
                  {notifications.map((item) => {
                    const config = notificationTypeConfig[item.type] || notificationTypeConfig.general;
                    return (
                      <Stack key={item.id} direction="row" spacing={1.5} sx={{ py: 2 }}>
                        <Avatar sx={{ bgcolor: alpha(config.color, 0.12), color: config.color, width: 42, height: 42 }}>
                          {config.icon}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, flexWrap: 'wrap' }}>
                            <Typography variant="subtitle2" fontWeight={900} sx={{ color: '#0f172a' }}>
                              {item.title}
                            </Typography>
                            <Chip
                              label={config.label}
                              size="small"
                              sx={{ fontWeight: 800, bgcolor: alpha(config.color, 0.12), color: config.color }}
                            />
                          </Stack>
                          {item.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                              {item.description}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {[item.propertyName, item.roomNumber && `Phòng ${item.roomNumber}`, formatDateTime(item.createdAt)].filter(Boolean).join(' • ')}
                          </Typography>
                        </Box>
                      </Stack>
                    );
                  })}
                </Stack>
              ) : (
                <Box sx={{ py: 8, px: 3, textAlign: 'center', color: 'text.secondary' }}>
                  <Typography variant="body2">Hiện chưa có cảnh báo nào cần xử lý.</Typography>
                </Box>
              )}
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HostDashboard;
