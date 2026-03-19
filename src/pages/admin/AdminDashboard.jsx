import React from 'react';
import Grid from '@mui/material/Grid';
import { Paper, Typography, Box, Card, CardContent, Avatar, Stack, LinearProgress, Button, alpha } from '@mui/material';
import { People, AccountBalance, TrendingUp, Storage, GroupAdd, Subscriptions, SupportAgent as SupportAgentIcon } from '@mui/icons-material';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import PageHeader from '../../components/common/PageHeader';

const data = [
  { name: 'Tuần 1', users: 40 },
  { name: 'Tuần 2', users: 70 },
  { name: 'Tuần 3', users: 120 },
  { name: 'Tuần 4', users: 200 },
];

const StatCard = ({ title, value, icon, color = '#2563eb', helper, footer }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid #e2e8f0',
        height: '100%',
        background: `linear-gradient(180deg, ${alpha(color, 0.08)}, #ffffff 60%)`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5, color: '#0f172a' }}>
              {value}
            </Typography>
            {helper && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                {helper}
              </Typography>
            )}
          </Box>
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: alpha(color, 0.12),
              color,
              width: 52,
              height: 52,
              borderRadius: 3,
              boxShadow: `0 10px 20px ${alpha(color, 0.15)}`,
            }}
          >
            {icon}
          </Avatar>
        </Stack>
        {footer && <Box sx={{ mt: 2 }}>{footer}</Box>}
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader title="Tổng quan Admin" breadcrumbs={[{ label: 'Admin' }, { label: 'Tổng quan' }]} />

      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Tổng chủ trọ" value="1,284" icon={<People />} color="#2563eb" helper="Tổng số tài khoản" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Doanh thu Sub" value="540M" icon={<AccountBalance />} color="#10b981" helper="Tháng này" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Tăng trưởng" value="+15%" icon={<TrendingUp />} color="#f59e0b" helper="So với tháng trước" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Server load"
            value="42%"
            icon={<Storage />}
            color="#ef4444"
            footer={<LinearProgress variant="determinate" value={42} color="error" sx={{ borderRadius: 999, height: 8 }} />}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={900}>
                  Tăng trưởng người dùng mới
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  4 tuần gần nhất
                </Typography>
              </Box>
              <Avatar variant="rounded" sx={{ bgcolor: alpha('#2563eb', 0.12), color: '#2563eb', borderRadius: 3 }}>
                <TrendingUp />
              </Avatar>
            </Stack>

            <Box sx={{ height: 320, mt: 1 }}>
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
            <Typography variant="h6" fontWeight={900}>
              Tác vụ nhanh
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Các thao tác thường dùng
            </Typography>

            <Stack spacing={1.25} sx={{ mt: 2.5 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GroupAdd />}
                sx={{ justifyContent: 'flex-start', py: 1.25, borderRadius: 2, textTransform: 'none', fontWeight: 800 }}
              >
                Duyệt chủ trọ mới (12)
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Subscriptions />}
                sx={{ justifyContent: 'flex-start', py: 1.25, borderRadius: 2, textTransform: 'none', fontWeight: 800 }}
              >
                Cấu hình gói dịch vụ
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SupportAgentIcon />}
                sx={{ justifyContent: 'flex-start', py: 1.25, borderRadius: 2, textTransform: 'none', fontWeight: 800 }}
              >
                Ticket chưa xử lý (5)
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;

