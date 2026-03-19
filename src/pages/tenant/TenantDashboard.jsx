import React from 'react';
import Grid from '@mui/material/Grid';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  alpha,
} from '@mui/material';
import { ReportProblem, InsertDriveFile, DirectionsCar, Notifications, ArrowForwardIos, ReceiptLong } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants';

const QuickAction = ({ icon, title, description, color, onClick }) => {
  return (
    <Paper
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
      elevation={0}
      sx={{
        p: 2.25,
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        cursor: 'pointer',
        transition: 'all 120ms ease',
        '&:hover': { transform: 'translateY(-1px)', boxShadow: `0 12px 28px ${alpha(color, 0.15)}`, borderColor: alpha(color, 0.35) },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.5,
            bgcolor: alpha(color, 0.12),
            color,
            display: 'grid',
            placeItems: 'center',
            flex: '0 0 auto',
          }}
        >
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight={900} sx={{ lineHeight: 1.2 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            {description}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

const TenantDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader title="Trang chủ" breadcrumbs={[{ label: 'Tenant' }, { label: 'Trang chủ' }]} />

      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        <Grid size={{ xs: 12 }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #60a5fa 100%)',
              color: 'white',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Số tiền cần đóng tháng 03/2026
                  </Typography>
                  <Typography variant="h3" fontWeight={900} sx={{ my: 0.75, letterSpacing: -0.5 }}>
                    4.850.000 đ
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                    <Chip label="Hạn chót: 10/03" sx={{ bgcolor: alpha('#ef4444', 0.9), color: 'white', fontWeight: 800 }} />
                    <Chip label="Chưa thanh toán" sx={{ bgcolor: alpha('#0b1220', 0.25), color: 'white', fontWeight: 800 }} />
                  </Stack>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(ROUTES.TENANT_INVOICES)}
                    endIcon={<ArrowForwardIos sx={{ fontSize: 14 }} />}
                    sx={{
                      borderRadius: 2.5,
                      textTransform: 'none',
                      fontWeight: 900,
                      borderColor: alpha('#ffffff', 0.55),
                      color: 'white',
                      '&:hover': { borderColor: 'white', bgcolor: alpha('#ffffff', 0.12) },
                    }}
                  >
                    Xem hóa đơn
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate(ROUTES.TENANT_INVOICES)}
                    sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 900, bgcolor: 'white', color: '#1e3a8a', '&:hover': { bgcolor: '#f8fafc' } }}
                  >
                    Thanh toán ngay
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" fontWeight={900} sx={{ mb: 1.5 }}>
            Thao tác nhanh
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <QuickAction
            icon={<ReportProblem sx={{ fontSize: 22 }} />}
            title="Báo sự cố"
            description="Gửi yêu cầu bảo trì/sửa chữa"
            color="#ef4444"
            onClick={() => navigate(ROUTES.TENANT_MAINTENANCE)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <QuickAction
            icon={<ReceiptLong sx={{ fontSize: 22 }} />}
            title="Hóa đơn của tôi"
            description="Xem lịch sử & trạng thái thanh toán"
            color="#2563eb"
            onClick={() => navigate(ROUTES.TENANT_INVOICES)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <QuickAction
            icon={<InsertDriveFile sx={{ fontSize: 22 }} />}
            title="Tiện ích & Nội quy"
            description="Tài liệu chung của tòa nhà"
            color="#0ea5e9"
            onClick={() => navigate(ROUTES.TENANT_DOCUMENTS)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <QuickAction
            icon={<DirectionsCar sx={{ fontSize: 22 }} />}
            title="Đăng ký xe"
            description="Đăng ký biển số & loại xe"
            color="#10b981"
            onClick={() => {}}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden', height: '100%' }}>
            <Box sx={{ px: 3, py: 2.5, bgcolor: '#fcfcfd', borderBottom: '1px solid #f1f5f9' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" fontWeight={900}>
                    Thông báo mới nhất
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Các thông tin quan trọng từ quản lý
                  </Typography>
                </Box>
                <Button size="small" variant="text" sx={{ textTransform: 'none', fontWeight: 900 }} endIcon={<ArrowForwardIos sx={{ fontSize: 14 }} />}>
                  Xem tất cả
                </Button>
              </Stack>
            </Box>

            <List sx={{ p: 0 }}>
              <ListItem sx={{ px: 3, py: 2 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Notifications color="primary" />
                </ListItemIcon>
                <ListItemText primary={<Typography fontWeight={900}>Thông báo phun thuốc muỗi</Typography>} secondary="Thời gian: 09:00 • Chủ nhật tuần này" />
              </ListItem>
              <Dividerish />
              <ListItem sx={{ px: 3, py: 2 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <InsertDriveFile color="info" />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography fontWeight={900}>Cập nhật nội quy PCCC</Typography>}
                  secondary="Vui lòng đọc kỹ nội quy mới tại khu vực thang máy"
                />
                <ArrowForwardIos sx={{ fontSize: 16, color: 'text.disabled' }} />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: '1px dashed',
              borderColor: alpha('#0ea5e9', 0.55),
              bgcolor: alpha('#0ea5e9', 0.06),
              height: '100%',
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2.5,
                  bgcolor: alpha('#0ea5e9', 0.14),
                  color: '#0369a1',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <ReceiptLong sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography fontWeight={900} sx={{ color: '#0369a1', lineHeight: 1.2 }}>
                  Bạn muốn gia hạn hợp đồng?
                </Typography>
                <Typography variant="caption" sx={{ color: '#0369a1' }}>
                  Hợp đồng của bạn còn 45 ngày.
                </Typography>
              </Box>
            </Stack>

            <Button
              fullWidth
              size="large"
              variant="contained"
              sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 900, bgcolor: '#0369a1' }}
            >
              Gửi yêu cầu
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const Dividerish = () => <Box sx={{ height: 1, bgcolor: '#f1f5f9' }} />;

export default TenantDashboard;

