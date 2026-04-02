import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {
  Alert,
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { ArrowBack, Edit, HomeWork, Person, Phone, SquareFoot, Layers, AttachMoney, Inventory2, Refresh, ReceiptLong, NotificationsActive, Send } from '@mui/icons-material';
import dayjs from 'dayjs';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants';
import roomManagementService from '../../services/host/roomManagement/service';
import { billingService, hostDashboardService, normalizeDashboardNotifications } from '../../services/host';

const fallbackRoomDetail = {
  roomId: 0,
  propertyId: null,
  propertyName: '',
  propertyAddress: '',
  tenantId: null,
  tenantFullName: null,
  contactPhone: null,
  area: null,
  floor: null,
  price: 0,
  roomNumber: '',
  status: 'AVAILABLE',
  type: '1BR',
  assets: [],
  servicePrices: [],
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

const invoiceStatusMeta = {
  PAID: { label: 'Đã thanh toán', color: '#10b981' },
  UNPAID: { label: 'Chưa thanh toán', color: '#f59e0b' },
  PENDING: { label: 'Chờ thanh toán', color: '#f59e0b' },
  OVERDUE: { label: 'Quá hạn', color: '#ef4444' },
};

const notificationSeverityMeta = {
  high: { label: 'Cao', color: '#ef4444' },
  medium: { label: 'Trung bình', color: '#f59e0b' },
  low: { label: 'Thấp', color: '#10b981' },
};

const sourceMeta = {
  api: { label: 'Backend', color: '#2563eb' },
  local: { label: 'Cục bộ', color: '#7c3aed' },
};

const ROOM_INVOICE_STORAGE_KEY = 'host_room_invoices';
const ROOM_NOTIFICATION_STORAGE_KEY = 'host_room_notifications';

const asArray = (value) => (Array.isArray(value) ? value : []);

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value ?? '');
  } catch {
    return fallback;
  }
};

const readStorageMap = (key) => {
  if (typeof window === 'undefined') return {};
  return safeParse(window.localStorage.getItem(key), {});
};

const writeStorageMap = (key, value) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const getRoomStorageItems = (key, roomId) => {
  const map = readStorageMap(key);
  return Array.isArray(map[String(roomId)]) ? map[String(roomId)] : [];
};

const appendRoomStorageItem = (key, roomId, item) => {
  const map = readStorageMap(key);
  const current = Array.isArray(map[String(roomId)]) ? map[String(roomId)] : [];
  map[String(roomId)] = [item, ...current];
  writeStorageMap(key, map);
  return map[String(roomId)];
};

const getCollectionItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.content)) return payload.data.content;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
};

const sameValue = (a, b) => String(a ?? '') !== '' && String(a ?? '') === String(b ?? '');

const normalizeInvoice = (raw, room) => {
  const data = raw?.data ?? raw ?? {};
  const billingMonth = Number(data.billingMonth ?? data.month ?? 0) || null;
  const billingYear = Number(data.billingYear ?? data.year ?? 0) || null;

  return {
    id: data.id ?? data.invoiceId ?? `INV-${Date.now()}-${Math.random()}`,
    roomId: data.roomId ?? data.room?.id ?? null,
    roomNumber: data.roomNumber ?? data.roomNo ?? data.room?.roomNumber ?? '',
    tenantId: data.tenantId ?? data.tenant?.id ?? null,
    totalAmount: Number(data.totalAmount ?? data.amount ?? data.total ?? data.grandTotal ?? 0) || 0,
    dueDate: data.dueDate ?? data.deadline ?? data.paymentDueDate ?? '',
    status: data.status ?? 'UNPAID',
    note: data.note ?? data.description ?? '',
    source: data.source ?? 'api',
    createdAt: data.createdAt ?? data.createdDate ?? data.invoiceDate ?? data.dueDate ?? '',
    periodLabel:
      data.periodLabel ??
      data.monthLabel ??
      (billingMonth && billingYear ? `T${String(billingMonth).padStart(2, '0')}/${billingYear}` : room?.roomNumber ? `Phòng ${room.roomNumber}` : 'Không rõ kỳ'),
  };
};

const invoiceBelongsToRoom = (invoice, room) => {
  if (!room) return false;
  if (sameValue(invoice.roomId, room.roomId)) return true;
  if (sameValue(invoice.roomNumber, room.roomNumber)) return true;
  if (room.tenantId && sameValue(invoice.tenantId, room.tenantId)) return true;
  return false;
};

const dedupeInvoices = (items) => {
  const map = new Map();
  items.forEach((item) => {
    const key = item.id ?? `${item.roomId}-${item.periodLabel}-${item.totalAmount}-${item.status}`;
    if (!map.has(key)) map.set(key, item);
  });
  return Array.from(map.values()).sort((a, b) => dayjs(b.createdAt || b.dueDate || 0).valueOf() - dayjs(a.createdAt || a.dueDate || 0).valueOf());
};

const normalizeRoomNotification = (raw, room) => {
  const data = raw?.raw ?? raw ?? {};

  return {
    id: raw?.id ?? data.id ?? data.notificationId ?? `NTF-${Date.now()}-${Math.random()}`,
    roomId: raw?.roomId ?? data.roomId ?? data.room?.id ?? null,
    roomNumber: raw?.roomNumber ?? data.roomNumber ?? data.roomNo ?? data.roomCode ?? data.room?.roomNumber ?? '',
    propertyName: raw?.propertyName ?? data.propertyName ?? data.buildingName ?? data.property ?? room?.propertyName ?? '',
    title:
      raw?.title ??
      data.title ??
      data.message ??
      data.summary ??
      `Thông báo phòng ${room?.roomNumber || room?.roomId || ''}`.trim(),
    message: raw?.message ?? raw?.description ?? data.message ?? data.description ?? data.content ?? data.note ?? '',
    createdAt: raw?.createdAt ?? data.createdAt ?? data.createdDate ?? data.timestamp ?? data.date ?? '',
    status: raw?.status ?? data.status ?? data.state ?? '',
    severity: String(raw?.severity ?? data.severity ?? data.priority ?? data.level ?? 'medium'),
    type: raw?.type ?? data.type ?? data.notificationType ?? data.category ?? 'general',
    source: raw?.source ?? 'api',
  };
};

const notificationBelongsToRoom = (notification, room) => {
  if (!room) return false;
  if (sameValue(notification.roomId, room.roomId)) return true;
  if (sameValue(notification.roomNumber, room.roomNumber)) return true;
  return false;
};

const dedupeNotifications = (items) => {
  const map = new Map();
  items.forEach((item) => {
    const key = item.id ?? `${item.roomId}-${item.roomNumber}-${item.title}-${item.createdAt}`;
    if (!map.has(key)) map.set(key, item);
  });
  return Array.from(map.values()).sort((a, b) => dayjs(b.createdAt || 0).valueOf() - dayjs(a.createdAt || 0).valueOf());
};

const normalizeRoomDetail = (raw, roomId) => {
  const data = raw?.data ?? raw ?? {};

  const propertyId = data.propertyId ?? null;
  const propertyName = data.propertyName ?? '';
  const propertyAddress = data.propertyAddress ?? '';

  const tenantId = data.tenantId ?? null;
  const tenantFullName = data.tenantFullName ?? null;
  const contactPhone = data.contactPhone ?? null;

  const assets = asArray(data.assets).map((a, idx) => ({
    id: a.id ?? idx,
    name: a.name ?? '',
    brand: a.brand ?? '',
    serialNumber: a.serialNumber ?? '',
    status: a.status ?? 'GOOD',
  }));

  const servicePrices = asArray(data.services).map((s, idx) => ({
    id: s.serviceId ?? idx,
    name: s.serviceName ?? '',
    unit: s.unitType ?? '',
    price: Number(s.unitPrice ?? 0) || 0,
  }));

  return {
    ...fallbackRoomDetail,
    roomId: data.roomId ?? (Number(roomId) || fallbackRoomDetail.roomId),
    propertyId,
    propertyName,
    propertyAddress,
    tenantId,
    tenantFullName,
    contactPhone,
    area: data.area ?? null,
    floor: data.floor ?? null,
    price: Number(data.price ?? 0) || 0,
    roomNumber: data.roomNumber ?? (roomId ? `P.${roomId}` : ''),
    status: data.status ?? fallbackRoomDetail.status,
    type: data.type ?? fallbackRoomDetail.type,
    assets,
    servicePrices,
  };
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
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [roomInvoices, setRoomInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [roomNotifications, setRoomNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
  const [savingInvoice, setSavingInvoice] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    amount: '',
    status: 'UNPAID',
    period: dayjs().format('YYYY-MM'),
    dueDate: dayjs().endOf('month').format('YYYY-MM-DD'),
    note: '',
  });
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
  });

  const fetchRoomDetail = useCallback(async () => {
    if (!id) {
      setDetail(fallbackRoomDetail);
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorText('');
    try {
      const res = await roomManagementService.getRoomDetail(id);
      setDetail(normalizeRoomDetail(res, id));
    } catch (err) {
      console.error(err);
      setErrorText('Không thể tải chi tiết phòng từ API. Đang hiển thị dữ liệu dự phòng.');
      setDetail(normalizeRoomDetail(fallbackRoomDetail, id));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRoomDetail();
  }, [fetchRoomDetail]);

  const fetchRoomInvoices = useCallback(async (room) => {
    if (!room?.roomId && !room?.roomNumber) {
      setRoomInvoices([]);
      return;
    }

    setLoadingInvoices(true);
    const localInvoices = getRoomStorageItems(ROOM_INVOICE_STORAGE_KEY, room.roomId).map((item) => normalizeInvoice({ ...item, source: 'local' }, room));

    try {
      const now = dayjs();
      const [currentMonthRes, overdueRes] = await Promise.allSettled([
        billingService.getCurrentMonthInvoices({ month: now.month() + 1, year: now.year() }),
        billingService.getOverdueInvoices(),
      ]);

      const apiInvoices = [];

      if (currentMonthRes.status === 'fulfilled') {
        getCollectionItems(currentMonthRes.value)
          .map((item) => normalizeInvoice(item, room))
          .filter((item) => invoiceBelongsToRoom(item, room))
          .forEach((item) => apiInvoices.push(item));
      }

      if (overdueRes.status === 'fulfilled') {
        getCollectionItems(overdueRes.value)
          .map((item) => normalizeInvoice(item, room))
          .filter((item) => invoiceBelongsToRoom(item, room))
          .forEach((item) => apiInvoices.push(item));
      }

      setRoomInvoices(dedupeInvoices([...localInvoices, ...apiInvoices]));
    } catch (err) {
      console.error(err);
      setRoomInvoices(dedupeInvoices(localInvoices));
      setFeedback({
        severity: 'warning',
        message: 'Không thể tải hóa đơn từ backend. Đang dùng dữ liệu cục bộ của phòng.',
      });
    } finally {
      setLoadingInvoices(false);
    }
  }, []);

  const fetchRoomNotifications = useCallback(async (room) => {
    if (!room?.roomId && !room?.roomNumber) {
      setRoomNotifications([]);
      return;
    }

    setLoadingNotifications(true);
    const localNotifications = getRoomStorageItems(ROOM_NOTIFICATION_STORAGE_KEY, room.roomId).map((item) =>
      normalizeRoomNotification({ ...item, source: 'local' }, room)
    );

    try {
      const response = await hostDashboardService.getNotifications({ limit: 50 });
      const apiNotifications = normalizeDashboardNotifications(response)
        .map((item) => normalizeRoomNotification({ ...item, source: 'api' }, room))
        .filter((item) => notificationBelongsToRoom(item, room));

      setRoomNotifications(dedupeNotifications([...localNotifications, ...apiNotifications]));
    } catch (err) {
      console.error(err);
      setRoomNotifications(dedupeNotifications(localNotifications));
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price) || 0);
  const formatDateTime = (value, fallback = '—') => {
    if (!value) return fallback;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format('DD/MM/YYYY HH:mm') : String(value);
  };
  const formatDate = (value, fallback = '—') => {
    if (!value) return fallback;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format('DD/MM/YYYY') : String(value);
  };

  const computed = useMemo(() => {
    const d = detail || fallbackRoomDetail;
    const status = statusMeta[d.status] || { label: d.status, color: '#64748b' };
    const tenantName = d.tenantFullName || 'Trống';
    const tenantPhone = d.contactPhone || '—';
    return { d, status, tenantName, tenantPhone };
  }, [detail]);

  const handleBack = () => navigate(ROUTES.HOST_ROOMS);
  const handleEdit = () => navigate(ROUTES.HOST_ROOM_EDIT.replace(':id', String(computed.d.roomId || id || '')));
  const handleCreateContract = () => navigate(ROUTES.HOST_CONTRACT_CREATE);

  useEffect(() => {
    if (!detail?.roomId) return;
    fetchRoomInvoices(detail);
    fetchRoomNotifications(detail);
  }, [detail, fetchRoomInvoices, fetchRoomNotifications]);

  useEffect(() => {
    if (!feedback || typeof window === 'undefined') return undefined;
    const timer = window.setTimeout(() => setFeedback(null), 5000);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const handleOpenInvoiceDialog = () => {
    setInvoiceForm({
      amount: computed.d.price || '',
      status: 'UNPAID',
      period: dayjs().format('YYYY-MM'),
      dueDate: dayjs().endOf('month').format('YYYY-MM-DD'),
      note: '',
    });
    setOpenInvoiceDialog(true);
  };

  const handleOpenNotificationDialog = () => {
    setNotificationForm({
      title: `Thông báo phòng ${computed.d.roomNumber || computed.d.roomId}`,
      message: '',
    });
    setOpenNotificationDialog(true);
  };

  const handleCreateInvoice = async () => {
    const amount = Number(invoiceForm.amount);
    if (!(amount > 0)) return;

    setSavingInvoice(true);
    const periodDate = dayjs(`${invoiceForm.period}-01`);
    const localInvoice = {
      id: `LOCAL-${Date.now()}`,
      roomId: computed.d.roomId,
      roomNumber: computed.d.roomNumber,
      tenantId: computed.d.tenantId,
      totalAmount: amount,
      dueDate: invoiceForm.dueDate,
      status: invoiceForm.status,
      note: invoiceForm.note.trim(),
      source: 'local',
      createdAt: dayjs().toISOString(),
      periodLabel: `T${String(periodDate.month() + 1).padStart(2, '0')}/${periodDate.year()}`,
    };

    try {
      await billingService.createInvoice({
        roomId: computed.d.roomId,
        roomNumber: computed.d.roomNumber,
        propertyId: computed.d.propertyId,
        tenantId: computed.d.tenantId,
        tenantName: computed.d.tenantFullName,
        billingMonth: periodDate.month() + 1,
        billingYear: periodDate.year(),
        dueDate: invoiceForm.dueDate,
        amount,
        totalAmount: amount,
        status: invoiceForm.status,
        note: invoiceForm.note.trim(),
      });

      setFeedback({ severity: 'success', message: 'Đã tạo hóa đơn qua API cho phòng này.' });
      setOpenInvoiceDialog(false);
      await fetchRoomInvoices(computed.d);
    } catch (err) {
      console.error(err);
      const stored = appendRoomStorageItem(ROOM_INVOICE_STORAGE_KEY, computed.d.roomId, localInvoice);
      setRoomInvoices((prev) =>
        dedupeInvoices(stored.map((item) => normalizeInvoice(item, computed.d)).concat(prev.filter((item) => item.source === 'api')))
      );
      setFeedback({
        severity: 'warning',
        message: 'API tạo hóa đơn chưa khớp payload hiện tại. Hóa đơn đã được lưu cục bộ để tiếp tục thao tác.',
      });
      setOpenInvoiceDialog(false);
    } finally {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          'host_created_invoice',
          JSON.stringify({
            tenant: computed.d.tenantFullName || `Phòng ${computed.d.roomNumber}`,
            room: `${computed.d.propertyName || 'Tòa nhà'} - ${computed.d.roomNumber || computed.d.roomId}`,
            amount,
            date: dayjs(invoiceForm.dueDate || dayjs()).format('DD/MM/YYYY'),
            status: invoiceForm.status === 'UNPAID' ? 'PENDING' : invoiceForm.status,
            type: 'INCOME',
            note: invoiceForm.note.trim(),
          })
        );
      }
      setSavingInvoice(false);
    }
  };

  const handleSendNotification = async () => {
    if (!notificationForm.title.trim() || !notificationForm.message.trim()) return;

    setSendingNotification(true);
    const record = {
      id: `NTF-${Date.now()}`,
      title: notificationForm.title.trim(),
      message: notificationForm.message.trim(),
      roomId: computed.d.roomId,
      propertyName: computed.d.propertyName,
      roomNumber: computed.d.roomNumber,
      createdAt: dayjs().toISOString(),
      severity: 'medium',
      source: 'local',
    };

    const stored = appendRoomStorageItem(ROOM_NOTIFICATION_STORAGE_KEY, computed.d.roomId, record);
    setRoomNotifications((prev) =>
      dedupeNotifications(stored.map((item) => normalizeRoomNotification(item, computed.d)).concat(prev.filter((item) => item.source === 'api')))
    );
    setOpenNotificationDialog(false);
    setFeedback({
      severity: 'success',
      message: 'Đã lưu thông báo cho phòng trong frontend. Có thể nối API gửi thật khi backend bổ sung endpoint.',
    });
    setSendingNotification(false);
  };

  if (loading && !detail) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title={`Chi tiết phòng ${computed.d.roomNumber || ''}`.trim()}
        breadcrumbs={[{ label: 'Host' }, { label: 'Danh sách phòng' }, { label: computed.d.roomNumber || `#${computed.d.roomId}` }]}
        actions={
          <Stack direction="row" spacing={1.25} sx={{ flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<ArrowBack />} onClick={handleBack} sx={{ borderRadius: 2.5, fontWeight: 900 }}>
              Quay lại
            </Button>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchRoomDetail} sx={{ borderRadius: 2.5, fontWeight: 900 }}>
              Tải lại
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

      {errorText && (
        <Paper elevation={0} sx={{ p: 2, mb: 2.5, borderRadius: 3, border: '1px solid', borderColor: alpha('#f59e0b', 0.5), bgcolor: alpha('#f59e0b', 0.08) }}>
          <Typography variant="body2" fontWeight={800} sx={{ color: '#92400e' }}>
            {errorText}
          </Typography>
        </Paper>
      )}

      {feedback?.message && (
        <Alert severity={feedback.severity || 'info'} onClose={() => setFeedback(null)} sx={{ mb: 2.5, borderRadius: 3 }}>
          {feedback.message}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        <Grid size={{ xs: 12 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: 4,
              border: '1px solid #e2e8f0',
              background: `linear-gradient(180deg, ${alpha(computed.status.color, 0.08)}, #ffffff 55%)`,
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                  <Typography variant="h5" fontWeight={900} sx={{ color: '#0f172a' }}>
                    {computed.d.roomNumber || `Phòng #${computed.d.roomId}`}
                  </Typography>
                  <Chip label={computed.status.label} sx={{ fontWeight: 900, bgcolor: alpha(computed.status.color, 0.12), color: computed.status.color }} />
                  <Chip label={computed.d.type || '—'} variant="outlined" sx={{ fontWeight: 900 }} />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  Tòa nhà: <Box component="span" sx={{ fontWeight: 900, color: '#0f172a' }}>{computed.d.propertyName || '—'}</Box> • {computed.d.propertyAddress || '—'}
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ width: { xs: '100%', md: 'auto' } }}>
                <Paper elevation={0} sx={{ px: 2, py: 1.5, borderRadius: 3, border: '1px solid #e2e8f0', minWidth: 220 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box sx={{ width: 38, height: 38, borderRadius: 2.25, bgcolor: alpha('#10b981', 0.12), color: '#10b981', display: 'grid', placeItems: 'center' }}>
                      <AttachMoney sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Giá thuê
                      </Typography>
                      <Typography fontWeight={900} sx={{ color: '#0f172a' }}>
                        {formatPrice(computed.d.price)}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                <Paper elevation={0} sx={{ px: 2, py: 1.5, borderRadius: 3, border: '1px solid #e2e8f0', minWidth: 220 }}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box sx={{ width: 38, height: 38, borderRadius: 2.25, bgcolor: alpha('#2563eb', 0.12), color: '#2563eb', display: 'grid', placeItems: 'center' }}>
                      <SquareFoot sx={{ fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Diện tích / Tầng
                      </Typography>
                      <Typography fontWeight={900} sx={{ color: '#0f172a' }}>
                        {computed.d.area ? `${computed.d.area} m²` : '—'} • Tầng {computed.d.floor ?? '—'}
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
              <InfoItem icon={<Inventory2 sx={{ fontSize: 20 }} />} label="Mã phòng" value={computed.d.roomId ?? '—'} />
              <InfoItem icon={<HomeWork sx={{ fontSize: 20 }} />} label="Mã tòa nhà" value={computed.d.propertyId ?? '—'} />
              <InfoItem icon={<Layers sx={{ fontSize: 20 }} />} label="Loại phòng" value={computed.d.type || '—'} />
              <InfoItem icon={<SquareFoot sx={{ fontSize: 20 }} />} label="Diện tích" value={computed.d.area ? `${computed.d.area} m²` : '—'} />
              <InfoItem icon={<Layers sx={{ fontSize: 20 }} />} label="Tầng" value={computed.d.floor ?? '—'} />
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
              <InfoItem icon={<Person sx={{ fontSize: 20 }} />} label="Họ và tên" value={computed.tenantName} />
              <InfoItem icon={<Phone sx={{ fontSize: 20 }} />} label="Số điện thoại liên hệ" value={computed.tenantPhone} />
            </Stack>

            <Divider sx={{ my: 2.5 }} />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
              <Button variant="outlined" onClick={handleCreateContract} sx={{ borderRadius: 2.5, fontWeight: 900 }}>
                Tạo hợp đồng
              </Button>
              <Button variant="outlined" startIcon={<Send />} onClick={handleOpenNotificationDialog} sx={{ borderRadius: 2.5, fontWeight: 900 }}>
                Gửi thông báo
              </Button>
              <Box sx={{ flexGrow: 1 }} />
              <Button variant="contained" startIcon={<ReceiptLong />} onClick={handleOpenInvoiceDialog} sx={{ borderRadius: 2.5, fontWeight: 900 }}>
                Tạo hóa đơn
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden', height: '100%' }}>
            <Box sx={{ px: 3, py: 2.5, bgcolor: '#fcfcfd', borderBottom: '1px solid #f1f5f9' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Box>
                  <Typography variant="h6" fontWeight={900}>
                    Hóa đơn của phòng
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Theo dõi công nợ và kỳ thanh toán của riêng phòng này
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  <Chip label={`${roomInvoices.length} hóa đơn`} size="small" sx={{ fontWeight: 800 }} />
                  <Button variant="outlined" size="small" startIcon={<ReceiptLong />} onClick={handleOpenInvoiceDialog} sx={{ borderRadius: 2.5, fontWeight: 900 }}>
                    Tạo mới
                  </Button>
                </Stack>
              </Stack>
            </Box>

            <Box sx={{ p: 2.5 }}>
              {loadingInvoices ? (
                <Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}>
                  <CircularProgress size={28} />
                </Box>
              ) : roomInvoices.length > 0 ? (
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#fcfcfd' }}>
                        <TableCell sx={{ fontWeight: 900 }}>Kỳ hóa đơn</TableCell>
                        <TableCell sx={{ fontWeight: 900 }}>Hạn thanh toán</TableCell>
                        <TableCell sx={{ fontWeight: 900 }} align="right">
                          Số tiền
                        </TableCell>
                        <TableCell sx={{ fontWeight: 900 }}>Trạng thái</TableCell>
                        <TableCell sx={{ fontWeight: 900 }}>Nguồn</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {roomInvoices.map((invoice) => {
                        const status = invoiceStatusMeta[invoice.status] || { label: invoice.status, color: '#64748b' };
                        const source = sourceMeta[invoice.source] || sourceMeta.api;
                        return (
                          <TableRow key={invoice.id} hover>
                            <TableCell sx={{ minWidth: 180 }}>
                              <Typography variant="body2" fontWeight={800}>
                                {invoice.periodLabel}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {invoice.note || `Phòng ${invoice.roomNumber || computed.d.roomNumber}`}
                              </Typography>
                            </TableCell>
                            <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 900 }}>
                              {formatPrice(invoice.totalAmount)}
                            </TableCell>
                            <TableCell>
                              <Chip size="small" label={status.label} sx={{ fontWeight: 900, bgcolor: alpha(status.color, 0.12), color: status.color }} />
                            </TableCell>
                            <TableCell>
                              <Chip size="small" label={source.label} sx={{ fontWeight: 900, bgcolor: alpha(source.color, 0.12), color: source.color }} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ py: 8, px: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Chưa có hóa đơn nào cho phòng này. Bạn có thể tạo hóa đơn ngay từ màn hình chi tiết phòng.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden', height: '100%' }}>
            <Box sx={{ px: 3, py: 2.5, bgcolor: '#fcfcfd', borderBottom: '1px solid #f1f5f9' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Box>
                  <Typography variant="h6" fontWeight={900}>
                    Thông báo của phòng
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Gồm thông báo từ backend và thông báo gửi thủ công cho phòng
                  </Typography>
                </Box>
                <Button variant="outlined" size="small" startIcon={<NotificationsActive />} onClick={handleOpenNotificationDialog} sx={{ borderRadius: 2.5, fontWeight: 900 }}>
                  Gửi thông báo
                </Button>
              </Stack>
            </Box>

            <Box sx={{ p: 2.5 }}>
              {loadingNotifications ? (
                <Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}>
                  <CircularProgress size={28} />
                </Box>
              ) : roomNotifications.length > 0 ? (
                <Stack spacing={1.5}>
                  {roomNotifications.map((item) => {
                    const severityKey = String(item.severity || 'medium').toLowerCase().includes('high')
                      ? 'high'
                      : String(item.severity || 'medium').toLowerCase().includes('low')
                        ? 'low'
                        : 'medium';
                    const severity = notificationSeverityMeta[severityKey];
                    const source = sourceMeta[item.source] || sourceMeta.api;

                    return (
                      <Paper key={item.id} elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                        <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="flex-start">
                          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                            <Typography variant="body1" fontWeight={900} sx={{ color: '#0f172a' }}>
                              {item.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                              {[
                                item.propertyName || computed.d.propertyName,
                                item.roomNumber ? `Phòng ${item.roomNumber}` : null,
                                formatDateTime(item.createdAt, 'Mới tạo'),
                              ]
                                .filter(Boolean)
                                .join(' • ')}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={0.75} sx={{ ml: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <Chip size="small" label={severity.label} sx={{ fontWeight: 900, bgcolor: alpha(severity.color, 0.12), color: severity.color }} />
                            <Chip size="small" label={source.label} sx={{ fontWeight: 900, bgcolor: alpha(source.color, 0.12), color: source.color }} />
                          </Stack>
                        </Stack>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25, whiteSpace: 'pre-wrap' }}>
                          {item.message || 'Chưa có nội dung chi tiết.'}
                        </Typography>
                      </Paper>
                    );
                  })}
                </Stack>
              ) : (
                <Box sx={{ py: 8, px: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Chưa có thông báo nào gắn với phòng này.
                  </Typography>
                </Box>
              )}
            </Box>
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
                      {computed.d.assets.map((asset) => {
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
                      {computed.d.assets.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              Chưa có tài sản
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
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
                      {computed.d.servicePrices.map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell sx={{ fontWeight: 800 }}>{item.name}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 900 }}>
                            {formatPrice(item.price)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {computed.d.servicePrices.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              Chưa có dữ liệu dịch vụ
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openInvoiceDialog} onClose={() => !savingInvoice && setOpenInvoiceDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900 }}>Tạo hóa đơn cho phòng {computed.d.roomNumber || computed.d.roomId}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Người thuê"
                value={computed.tenantName}
                disabled
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Phòng"
                value={`${computed.d.propertyName || 'Tòa nhà'} - ${computed.d.roomNumber || computed.d.roomId}`}
                disabled
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Kỳ hóa đơn"
                type="month"
                value={invoiceForm.period}
                onChange={(event) => setInvoiceForm((prev) => ({ ...prev, period: event.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Trạng thái"
                value={invoiceForm.status}
                onChange={(event) => setInvoiceForm((prev) => ({ ...prev, status: event.target.value }))}
              >
                <MenuItem value="UNPAID">Chưa thanh toán</MenuItem>
                <MenuItem value="PENDING">Chờ thanh toán</MenuItem>
                <MenuItem value="PAID">Đã thanh toán</MenuItem>
                <MenuItem value="OVERDUE">Quá hạn</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Hạn thanh toán"
                type="date"
                value={invoiceForm.dueDate}
                onChange={(event) => setInvoiceForm((prev) => ({ ...prev, dueDate: event.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Số tiền (VND)"
                type="number"
                value={invoiceForm.amount}
                onChange={(event) => setInvoiceForm((prev) => ({ ...prev, amount: event.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                label="Ghi chú"
                multiline
                minRows={3}
                value={invoiceForm.note}
                onChange={(event) => setInvoiceForm((prev) => ({ ...prev, note: event.target.value }))}
                placeholder="Ví dụ: Tiền thuê tháng, điện nước, phụ phí..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenInvoiceDialog(false)} color="inherit" disabled={savingInvoice}>
            Hủy
          </Button>
          <Button variant="contained" onClick={handleCreateInvoice} disabled={savingInvoice || !(Number(invoiceForm.amount) > 0)}>
            {savingInvoice ? 'Đang tạo...' : 'Tạo hóa đơn'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openNotificationDialog} onClose={() => !sendingNotification && setOpenNotificationDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900 }}>Gửi thông báo cho phòng {computed.d.roomNumber || computed.d.roomId}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                label="Tiêu đề"
                value={notificationForm.title}
                onChange={(event) => setNotificationForm((prev) => ({ ...prev, title: event.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                label="Nội dung"
                multiline
                minRows={4}
                value={notificationForm.message}
                onChange={(event) => setNotificationForm((prev) => ({ ...prev, message: event.target.value }))}
                placeholder="Nhập nội dung bạn muốn gửi tới người thuê của phòng này"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenNotificationDialog(false)} color="inherit" disabled={sendingNotification}>
            Hủy
          </Button>
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={handleSendNotification}
            disabled={sendingNotification || !notificationForm.title.trim() || !notificationForm.message.trim()}
          >
            {sendingNotification ? 'Đang gửi...' : 'Lưu thông báo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomDetail;
