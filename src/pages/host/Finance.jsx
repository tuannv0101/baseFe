import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Avatar,
  LinearProgress,
  Tooltip,
  MenuItem,
  TextField,
  Divider,
  Card,
  CardContent,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  alpha,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  Receipt,
  FilterList,
  Search,
  MoreVert,
  CalendarToday,
  FileDownloadOutlined,
  AddCircleOutline,
  KeyboardArrowRight,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants';

dayjs.extend(customParseFormat);

// Mock data
const summaryData = [
  { 
    title: 'Tổng thu tháng này', 
    value: '150.280.000 ₫', 
    change: '+12.5%', 
    isPositive: true,
    icon: <TrendingUp />, 
    color: '#10b981', // Success green
    bg: 'rgba(16, 185, 129, 0.1)'
  },
  { 
    title: 'Tổng chi tháng này', 
    value: '45.150.000 ₫', 
    change: '+2.1%', 
    isPositive: false,
    icon: <TrendingDown />, 
    color: '#ef4444', // Error red
    bg: 'rgba(239, 68, 68, 0.1)'
  },
  { 
    title: 'Lợi nhuận dự tính', 
    value: '105.130.000 ₫', 
    change: '+8.4%', 
    isPositive: true,
    icon: <AccountBalanceWallet />, 
    color: '#3b82f6', // Info blue
    bg: 'rgba(59, 130, 246, 0.1)'
  },
  { 
    title: 'Chưa thanh toán', 
    value: '25.500.000 ₫', 
    count: '8 hóa đơn', 
    icon: <Receipt />, 
    color: '#f59e0b', // Warning amber
    bg: 'rgba(245, 158, 11, 0.1)'
  },
];

const recentTransactions = [
  { id: 'INV-001', tenant: 'Nguyễn Văn Anh', room: 'P.101 - Tòa A1', amount: 5500000, date: '15/03/2024', status: 'PAID', type: 'INCOME' },
  { id: 'EXP-001', tenant: 'Công ty Điện lực (EVN)', room: 'Hệ thống tòa nhà', amount: 12450000, date: '14/03/2024', status: 'PAID', type: 'EXPENSE' },
  { id: 'INV-002', tenant: 'Trần Thị Bảo', room: 'P.202 - Tòa A1', amount: 4800000, date: '14/03/2024', status: 'PENDING', type: 'INCOME' },
  { id: 'INV-003', tenant: 'Lê Văn Cường', room: 'P.305 - Tòa B2', amount: 6200000, date: '13/03/2024', status: 'PAID', type: 'INCOME' },
  { id: 'EXP-002', tenant: 'Công ty Nước sạch', room: 'Hệ thống tòa nhà', amount: 3200000, date: '12/03/2024', status: 'PAID', type: 'EXPENSE' },
  { id: 'INV-004', tenant: 'Phạm Văn Dũng', room: 'P.104 - Tòa B1', amount: 5100000, date: '11/03/2024', status: 'OVERDUE', type: 'INCOME' },
];

const Finance = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('month');
  const [transactions, setTransactions] = useState(() => {
    const STORAGE_KEY = 'host_created_invoice';
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return recentTransactions;
      localStorage.removeItem(STORAGE_KEY);
      const createdInvoice = JSON.parse(raw);

      const prefix = createdInvoice?.type === 'EXPENSE' ? 'EXP' : 'INV';
      const max = recentTransactions
        .filter((t) => typeof t.id === 'string' && t.id.startsWith(prefix + '-'))
        .map((t) => Number(String(t.id).split('-')[1]))
        .filter((n) => Number.isFinite(n))
        .reduce((acc, n) => Math.max(acc, n), 0);
      const nextId = createdInvoice?.id || (prefix + '-' + String(max + 1).padStart(3, '0'));

      const row = {
        id: nextId,
        tenant: createdInvoice?.tenant || '',
        room: createdInvoice?.room || '',
        amount: Number(createdInvoice?.amount) || 0,
        date: createdInvoice?.date || dayjs().format('DD/MM/YYYY'),
        status: createdInvoice?.status || 'PENDING',
        type: createdInvoice?.type || 'INCOME',
      };

      return [row, ...recentTransactions];
    } catch {
      return recentTransactions;
    }
  });
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    type: 'INCOME',
    tenant: '',
    room: '',
    amount: '',
    date: dayjs(),
    status: 'PENDING',
  });

  const [actionMenuEl, setActionMenuEl] = useState(null);
  const [actionRowId, setActionRowId] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const parseRowDate = (dateStr) => dayjs(dateStr, 'DD/MM/YYYY', true);

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = searchText.trim().toLowerCase();
    return transactions.filter((row) => {
      if (tabValue === 1 && row.type !== 'INCOME') return false;
      if (tabValue === 2 && row.type !== 'EXPENSE') return false;

      if (statusFilter !== 'ALL' && row.status !== statusFilter) return false;

      if (normalizedQuery) {
        const haystack = [row.id, row.tenant, row.room].join(' ').toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }

      const rowDate = parseRowDate(row.date);
      if (dateFrom) {
        const from = dayjs(dateFrom).startOf('day');
        if (rowDate.isValid() && rowDate.isBefore(from)) return false;
      }
      if (dateTo) {
        const to = dayjs(dateTo).endOf('day');
        if (rowDate.isValid() && rowDate.isAfter(to)) return false;
      }

      return true;
    });
  }, [transactions, tabValue, searchText, statusFilter, dateFrom, dateTo]);

  const generateInvoiceId = (type) => {
    const prefix = type === 'EXPENSE' ? 'EXP' : 'INV';
    const max = transactions
      .filter((t) => typeof t.id === 'string' && t.id.startsWith(prefix + '-'))
      .map((t) => Number(String(t.id).split('-')[1]))
      .filter((n) => Number.isFinite(n))
      .reduce((acc, n) => Math.max(acc, n), 0);
    return prefix + '-' + String(max + 1).padStart(3, '0');
  };

  const handleOpenInvoiceDialog = () => {
    setInvoiceForm({
      type: 'INCOME',
      tenant: '',
      room: '',
      amount: '',
      date: dayjs(),
      status: 'PENDING',
    });
    setOpenInvoiceDialog(true);
  };

  const handleCreateInvoice = () => {
    const amountNumber = Number(invoiceForm.amount);
    if (!invoiceForm.tenant.trim() || !invoiceForm.room.trim() || !Number.isFinite(amountNumber) || amountNumber <= 0) {
      return;
    }
    const newRow = {
      id: generateInvoiceId(invoiceForm.type),
      tenant: invoiceForm.tenant.trim(),
      room: invoiceForm.room.trim(),
      amount: amountNumber,
      date: dayjs(invoiceForm.date || dayjs()).format('DD/MM/YYYY'),
      status: invoiceForm.status,
      type: invoiceForm.type,
    };
    setTransactions((prev) => [newRow, ...prev]);
    setOpenInvoiceDialog(false);
  };

  const handleOpenActionMenu = (event, rowId) => {
    setActionMenuEl(event.currentTarget);
    setActionRowId(rowId);
  };

  const handleCloseActionMenu = () => {
    setActionMenuEl(null);
    setActionRowId(null);
  };

  const handleUpdateInvoiceStatus = (nextStatus) => {
    if (!actionRowId) return;
    setTransactions((prev) => prev.map((t) => (t.id === actionRowId ? { ...t, status: nextStatus } : t)));
    handleCloseActionMenu();
  };

  const getStatusChip = (status) => {
    const configs = {
      'PAID': { label: 'Đã thanh toán', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      'PENDING': { label: 'Chờ thanh toán', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      'OVERDUE': { label: 'Quá hạn', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    };
    const config = configs[status] || { label: status, color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)' };
    return (
      <Chip 
        label={config.label} 
        size="small" 
        sx={{ 
          fontWeight: 700, 
          color: config.color, 
          bgcolor: config.bg,
          border: '1px solid',
          borderColor: alpha(config.color, 0.2),
          borderRadius: '6px'
        }} 
      />
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ pb: 6 }}>
      <PageHeader 
        title="Quản lý Tài chính" 
        breadcrumbs={[{ label: 'Bảng điều khiển' }, { label: 'Tài chính' }]}
        actions={
          <Stack direction="row" spacing={1.5}>
            <Button 
              variant="outlined" 
              startIcon={<FileDownloadOutlined />} 
              sx={{ 
                borderRadius: 2, 
                textTransform: 'none', 
                fontWeight: 700,
                borderColor: 'divider',
                color: 'text.primary',
                bgcolor: 'white',
                '&:hover': { bgcolor: '#f1f5f9', borderColor: 'divider' }
              }}
            >
              Xuất báo cáo
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<AddCircleOutline />} 
              onClick={handleOpenInvoiceDialog}
              sx={{ 
                borderRadius: 2, 
                textTransform: 'none', 
                fontWeight: 700,
                borderColor: 'divider',
                color: 'text.primary',
                bgcolor: 'white',
                '&:hover': { bgcolor: '#f1f5f9', borderColor: 'divider' }
              }}
            >
              Tạo hóa đơn
            </Button>
          </Stack>
        }
      />

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ width: '100%', m: 0, mb: 4 }}>
        {summaryData.map((item, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card 
              elevation={0} 
              sx={{ 
                borderRadius: 4, 
                border: '1px solid #e2e8f0',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                  borderColor: alpha(item.color, 0.3)
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: item.bg, 
                      color: item.color, 
                      borderRadius: 2.5,
                      width: 48,
                      height: 48
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  {item.change && (
                    <Box 
                      sx={{ 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1.5, 
                        bgcolor: item.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        fontWeight={800} 
                        sx={{ color: item.isPositive ? '#10b981' : '#ef4444' }}
                      >
                        {item.change}
                      </Typography>
                    </Box>
                  )}
                </Stack>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {item.title}
                </Typography>
                <Typography variant="h5" fontWeight={800} sx={{ mt: 0.5, color: '#1e293b' }}>
                  {item.value}
                </Typography>
                {item.count && (
                  <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mt: 0.5, display: 'block' }}>
                    {item.count} cần xử lý
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        {/* Statistics Chart Section */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 4, 
              border: '1px solid #e2e8f0',
              height: '100%'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Box>
                <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>Biểu đồ doanh thu</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>Thống kê dòng tiền theo từng tháng trong năm 2024</Typography>
              </Box>
              <TextField
                select
                size="small"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                sx={{ 
                  width: 140,
                  '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8fafc' }
                }}
              >
                <MenuItem value="week">Tuần này</MenuItem>
                <MenuItem value="month">Tháng này</MenuItem>
                <MenuItem value="year">Năm nay</MenuItem>
              </TextField>
            </Stack>
            
            <Box sx={{ height: 320, display: 'flex', alignItems: 'flex-end', gap: 2, pt: 2, position: 'relative' }}>
              {[0, 25, 50, 75, 100].map((line) => (
                <Box key={line} sx={{ position: 'absolute', bottom: `${line}%`, left: 0, right: 0, height: '1px', bgcolor: '#f1f5f9' }} />
              ))}
              
              {[60, 45, 80, 55, 90, 70, 85, 40, 65, 75, 50, 95].map((h, i) => (
                <Tooltip key={i} title={`Tháng ${i+1}: ${h}tr VNĐ`} arrow>
                  <Box sx={{ flex: 1, position: 'relative', zIndex: 1, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <Box sx={{ 
                      width: '100%',
                      height: `${h}%`, 
                      bgcolor: i === 11 ? '#3b82f6' : alpha('#3b82f6', 0.2), 
                      borderRadius: '6px 6px 2px 2px',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': { 
                        bgcolor: '#2563eb', 
                        cursor: 'pointer',
                        transform: 'scaleX(1.1)',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                      }
                    }} />
                  </Box>
                </Tooltip>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, px: 1 }}>
              {['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'].map((m, i) => (
                <Typography key={m} variant="caption" color={i === 11 ? 'primary.main' : 'text.secondary'} fontWeight={700}>{m}</Typography>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Breakdown Section */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 4, 
              border: '1px solid #e2e8f0',
              height: '100%',
              background: 'linear-gradient(to bottom, #ffffff, #fcfcfc)'
            }}
          >
            <Typography variant="h6" fontWeight={800} sx={{ mb: 1, color: '#1e293b' }}>Phân tích khoản thu</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ display: 'block', mb: 4 }}>
              Tỷ lệ thanh toán đúng hạn trong tháng
            </Typography>

            <Stack spacing={4}>
              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                  <Typography variant="body2" fontWeight={700} sx={{ color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                    Đã thu tiền
                  </Typography>
                  <Typography variant="body2" fontWeight={800} color="#10b981">75%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={75} sx={{ height: 10, borderRadius: 5, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#10b981', borderRadius: 5 } }} />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                  <Typography variant="body2" fontWeight={700} sx={{ color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                    Chờ thanh toán
                  </Typography>
                  <Typography variant="body2" fontWeight={800} color="#f59e0b">20%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={20} sx={{ height: 10, borderRadius: 5, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b', borderRadius: 5 } }} />
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                  <Typography variant="body2" fontWeight={700} sx={{ color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444' }} />
                    Quá hạn
                  </Typography>
                  <Typography variant="body2" fontWeight={800} color="#ef4444">5%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={5} sx={{ height: 10, borderRadius: 5, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: '#ef4444', borderRadius: 5 } }} />
              </Box>
            </Stack>

            <Box sx={{ mt: 6, p: 2.5, bgcolor: alpha('#3b82f6', 0.05), borderRadius: 3, border: '1px dashed', borderColor: alpha('#3b82f6', 0.3) }}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Box sx={{ p: 1, bgcolor: 'white', borderRadius: 2, color: 'primary.main', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <CalendarToday fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} color="#1e293b">Nhắc nhở tự động</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', lineHeight: 1.5 }}>
                    Bật tính năng gửi SMS/Zalo nhắc nợ để giảm tỷ lệ quá hạn.
                  </Typography>
                  <Button size="small" sx={{ mt: 1, textTransform: 'none', fontWeight: 800, p: 0 }}>Kích hoạt ngay &rarr;</Button>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* Transactions Table Section */}
        <Grid size={{ xs: 12 }}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 4, 
              border: '1px solid #e2e8f0', 
              overflow: 'hidden',
              bgcolor: 'white'
            }}
          >
            <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Tabs 
                value={tabValue} 
                onChange={(e, v) => setTabValue(v)}
                sx={{ 
                  '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' },
                  '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.95rem', minWidth: 100 }
                }}
              >
                <Tab label="Tất cả giao dịch" />
                <Tab label="Các khoản thu" />
                <Tab label="Các khoản chi" />
              </Tabs>
              
              <Stack direction="row" spacing={1.5}>
                <TextField 
                  size="small"
                  placeholder="Tìm giao dịch..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ color: 'text.disabled', mr: 1, fontSize: 20 }} />,
                    sx: { borderRadius: 2, bgcolor: '#f8fafc', width: 240 }
                  }}
                />
                <Tooltip title="Bộ lọc ngày/tháng & trạng thái">
                  <IconButton
                    onClick={() => setShowFilters((v) => !v)}
                    sx={{ bgcolor: '#f8fafc', borderRadius: 2 }}
                    color={showFilters ? 'primary' : 'default'}
                  >
                    <FilterList fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>

            <Collapse in={showFilters}>
              <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid #f1f5f9', bgcolor: '#fcfcfd' }}>
                <Grid container spacing={2} sx={{ width: '100%', m: 0 }} alignItems="center">
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DatePicker
                      label="Từ ngày"
                      value={dateFrom}
                      onChange={(v) => setDateFrom(v)}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <DatePicker
                      label="Đến ngày"
                      value={dateTo}
                      onChange={(v) => setDateTo(v)}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                      select
                      label="Trạng thái"
                      size="small"
                      fullWidth
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <MenuItem value="ALL">Tất cả</MenuItem>
                      <MenuItem value="PAID">Đã thanh toán</MenuItem>
                      <MenuItem value="PENDING">Chờ thanh toán</MenuItem>
                      <MenuItem value="OVERDUE">Quá hạn</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => {
                          setDateFrom(null);
                          setDateTo(null);
                          setStatusFilter('ALL');
                          setSearchText('');
                        }}
                        sx={{ textTransform: 'none', fontWeight: 800 }}
                      >
                        Đặt lại
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setDateFrom(dayjs().startOf('month'));
                          setDateTo(dayjs().endOf('month'));
                        }}
                        sx={{ textTransform: 'none', fontWeight: 800, borderRadius: 2 }}
                      >
                        Tháng này
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
            
            <TableContainer>
              <Table sx={{ minWidth: 800 }}>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, color: '#64748b', py: 2 }}>MÃ GIAO DỊCH</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#64748b', py: 2 }}>ĐỐI TƯỢNG / NỘI DUNG</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#64748b', py: 2 }}>NGÀY THỰC HIỆN</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#64748b', py: 2 }}>SỐ TIỀN</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#64748b', py: 2 }}>TRẠNG THÁI</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, color: '#64748b', py: 2 }}>HÀNH ĐỘNG</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.map((row) => (
                    <TableRow key={row.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 700, color: '#3b82f6' }}>{row.id}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar 
                            variant="rounded"
                            sx={{ 
                              width: 38, 
                              height: 38, 
                              bgcolor: row.type === 'INCOME' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                              color: row.type === 'INCOME' ? '#10b981' : '#ef4444',
                              fontWeight: 800,
                              fontSize: '0.8rem'
                            }}
                          >
                            {row.type === 'INCOME' ? 'TH' : 'CH'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700} sx={{ color: '#1e293b' }}>{row.tenant}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>{row.room}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500} color="text.secondary">{row.date}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          fontWeight={800} 
                          sx={{ color: row.type === 'INCOME' ? '#10b981' : '#ef4444' }}
                        >
                          {row.type === 'INCOME' ? '+' : '-'}{formatPrice(row.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(row.status)}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" sx={{ color: '#94a3b8' }} onClick={(e) => handleOpenActionMenu(e, row.id)}>
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Divider />
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button 
                endIcon={<KeyboardArrowRight />} 
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 800,
                  color: '#64748b',
                  '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                }}
              >
                Xem tất cả lịch sử giao dịch
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      </Box>

      <Menu
        anchorEl={actionMenuEl}
        open={Boolean(actionMenuEl)}
        onClose={handleCloseActionMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => handleUpdateInvoiceStatus('PAID')}>Đánh dấu: Đã thanh toán</MenuItem>
        <MenuItem onClick={() => handleUpdateInvoiceStatus('PENDING')}>Đánh dấu: Chờ thanh toán</MenuItem>
        <MenuItem onClick={() => handleUpdateInvoiceStatus('OVERDUE')}>Đánh dấu: Quá hạn</MenuItem>
      </Menu>

      <Dialog open={openInvoiceDialog} onClose={() => setOpenInvoiceDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>Tạo hóa đơn</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ width: '100%', m: 0 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Loại"
                size="small"
                fullWidth
                value={invoiceForm.type}
                onChange={(e) => setInvoiceForm((p) => ({ ...p, type: e.target.value }))}
              >
                <MenuItem value="INCOME">Khoản thu</MenuItem>
                <MenuItem value="EXPENSE">Khoản chi</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Trạng thái"
                size="small"
                fullWidth
                value={invoiceForm.status}
                onChange={(e) => setInvoiceForm((p) => ({ ...p, status: e.target.value }))}
              >
                <MenuItem value="PENDING">Chờ thanh toán</MenuItem>
                <MenuItem value="PAID">Đã thanh toán</MenuItem>
                <MenuItem value="OVERDUE">Quá hạn</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Đối tượng / Người thuê / Nhà cung cấp"
                size="small"
                fullWidth
                value={invoiceForm.tenant}
                onChange={(e) => setInvoiceForm((p) => ({ ...p, tenant: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Nội dung / Phòng / Hàng mục"
                size="small"
                fullWidth
                value={invoiceForm.room}
                onChange={(e) => setInvoiceForm((p) => ({ ...p, room: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Số tiền (VND)"
                size="small"
                fullWidth
                type="number"
                value={invoiceForm.amount}
                onChange={(e) => setInvoiceForm((p) => ({ ...p, amount: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DatePicker
                label="Ngày tạo"
                value={invoiceForm.date}
                onChange={(v) => setInvoiceForm((p) => ({ ...p, date: v }))}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>
          </Grid>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            Ghi chú: Hiện tại đây là UI mock (chưa gọi API).
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenInvoiceDialog(false)} color="inherit">Hủy</Button>
          <Button
            variant="contained"
            onClick={handleCreateInvoice}
            disabled={!invoiceForm.tenant.trim() || !invoiceForm.room.trim() || !(Number(invoiceForm.amount) > 0)}
          >
            Tạo
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default Finance;
