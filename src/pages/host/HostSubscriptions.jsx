import React from 'react';
import Grid from '@mui/material/Grid';
import { Box, Card, CardContent, Chip, Stack, Typography, Button, alpha } from '@mui/material';
import { CheckCircle, Star, RocketLaunch, WorkspacePremium } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';

const plans = [
  {
    key: 'starter',
    name: 'Starter',
    price: '0đ',
    desc: 'Phù hợp thử nghiệm / quy mô nhỏ',
    color: '#2563eb',
    icon: <Star />,
    features: ['Quản lý 1 tòa nhà', 'Tối đa 30 phòng', 'Báo cáo cơ bản', 'Hỗ trợ qua email'],
    recommended: false,
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '299.000đ / tháng',
    desc: 'Tối ưu cho chủ trọ đang vận hành',
    color: '#10b981',
    icon: <RocketLaunch />,
    features: ['Quản lý nhiều tòa nhà', 'Không giới hạn phòng', 'Báo cáo nâng cao', 'Nhắc thu tiền tự động'],
    recommended: true,
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    price: 'Liên hệ',
    desc: 'Tùy biến theo nhu cầu doanh nghiệp',
    color: '#f59e0b',
    icon: <WorkspacePremium />,
    features: ['SLA & hỗ trợ ưu tiên', 'Tích hợp API', 'Phân quyền nâng cao', 'Dashboard tùy biến'],
    recommended: false,
  },
];

const HostSubscriptions = () => {
  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader title="Gói dịch vụ" breadcrumbs={[{ label: 'Host' }, { label: 'Gói dịch vụ' }]} />

      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        <Grid size={{ xs: 12 }}>
          <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
                <Box>
                  <Typography variant="h6" fontWeight={900}>
                    Gói hiện tại: Starter
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Bạn có thể nâng cấp để mở khóa thêm tính năng (UI demo).
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" sx={{ borderRadius: 2.5, fontWeight: 900 }}>
                    Xem lịch sử thanh toán
                  </Button>
                  <Button variant="contained" sx={{ borderRadius: 2.5, fontWeight: 900, boxShadow: '0 8px 18px rgba(37, 99, 235, 0.18)' }}>
                    Nâng cấp gói
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {plans.map((plan) => (
          <Grid key={plan.key} size={{ xs: 12, md: 4 }}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid',
                borderColor: plan.recommended ? alpha(plan.color, 0.5) : '#e2e8f0',
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {plan.recommended && (
                <Chip
                  label="Khuyên dùng"
                  size="small"
                  sx={{ position: 'absolute', top: 14, right: 14, fontWeight: 900, bgcolor: alpha(plan.color, 0.12), color: plan.color }}
                />
              )}
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      bgcolor: alpha(plan.color, 0.12),
                      color: plan.color,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {plan.icon}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={900}>{plan.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {plan.desc}
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="h5" fontWeight={900} sx={{ color: '#0f172a' }}>
                    {plan.price}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Đã bao gồm VAT (demo)
                  </Typography>
                </Box>

                <Stack spacing={1} sx={{ mt: 2.5 }}>
                  {plan.features.map((f) => (
                    <Stack key={f} direction="row" spacing={1} alignItems="center">
                      <CheckCircle sx={{ fontSize: 18, color: plan.color }} />
                      <Typography variant="body2" fontWeight={700} sx={{ color: '#0f172a' }}>
                        {f}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                  <Button fullWidth variant={plan.recommended ? 'contained' : 'outlined'} sx={{ borderRadius: 2.5, fontWeight: 900 }}>
                    {plan.key === 'enterprise' ? 'Liên hệ' : 'Mua gói'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HostSubscriptions;

