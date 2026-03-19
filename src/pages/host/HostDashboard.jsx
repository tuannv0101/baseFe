import React from 'react';
import Grid from '@mui/material/Grid';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  alpha,
  Button,
} from '@mui/material';
import { HomeWork, People, Receipt, WarningAmber, Build, CheckCircle, Notifications, ArrowForwardIos } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ChartTooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants';

const pieData = [
  { name: 'Đang thuê', value: 45 },
  { name: 'Trống', value: 10 },
  { name: 'Bảo trì', value: 5 },
];

const COLORS = ['#2563eb', '#10b981', '#f59e0b'];

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid #e2e8f0',
        height: '100%',
        background: `linear-gradient(180deg, ${alpha(color, 0.1)}, #ffffff 60%)`,
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
          </Box>
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: alpha(color, 0.14),
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
      </CardContent>
    </Card>
  );
};

const HostDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader title="Tổng quan Host" breadcrumbs={[{ label: 'Host' }, { label: 'Tổng quan' }]} />

      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="Tỷ lệ lấp đầy" value="85%" icon={<HomeWork />} color="#2563eb" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="Doanh thu tháng" value="125M" icon={<Receipt />} color="#10b981" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard title="Tiền nợ chưa thu" value="12.5M" icon={<People />} color="#f59e0b" />
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight={900}>
                  Trạng thái phòng
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Phân bổ theo tình trạng hiện tại
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate(ROUTES.HOST_ROOMS)}
                sx={{ textTransform: 'none', fontWeight: 800, borderRadius: 2 }}
              >
                Xem phòng
              </Button>
            </Stack>

            <Box sx={{ height: 260, display: 'flex', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={62} outerRadius={86} paddingAngle={5} dataKey="value">
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>

              <Stack spacing={1} sx={{ ml: 2 }}>
                {pieData.map((item, idx) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box component="span" sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[idx] }} />
                    <Typography variant="caption" fontWeight={700}>
                      {item.name}: {item.value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden', height: '100%' }}>
            <Box sx={{ px: 3, py: 2.5, bgcolor: '#fcfcfd', borderBottom: '1px solid #f1f5f9' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" fontWeight={900}>
                    Thông báo & nhắc việc
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Sự kiện quan trọng cần xử lý
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

            <List sx={{ p: 0 }}>
              <ListItem disablePadding sx={{ px: 3, py: 2 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <WarningAmber color="error" />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography fontWeight={900}>Phòng 204: Hợp đồng sắp hết hạn</Typography>}
                  secondary="Hết hạn vào ngày 15/03/2026"
                />
                <Chip label="Gia hạn" color="primary" size="small" sx={{ fontWeight: 800 }} />
              </ListItem>
              <Divider component="li" />
              <ListItem disablePadding sx={{ px: 3, py: 2 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Build color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography fontWeight={900}>Yêu cầu sửa chữa: P.102 hỏng vòi nước</Typography>}
                  secondary="Gửi lúc 09:30 bởi Nguyễn Văn A"
                />
                <Chip label="Phân công" color="warning" size="small" sx={{ fontWeight: 800 }} />
              </ListItem>
              <Divider component="li" />
              <ListItem disablePadding sx={{ px: 3, py: 2 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText primary={<Typography fontWeight={900}>Đã chốt xong số điện Tòa nhà A</Typography>} secondary="Tháng 03/2026" />
                <Chip label="Hoàn tất" color="success" size="small" sx={{ fontWeight: 800 }} />
              </ListItem>
              <Divider component="li" />
              <ListItem disablePadding sx={{ px: 3, py: 2 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Notifications color="primary" />
                </ListItemIcon>
                <ListItemText primary={<Typography fontWeight={900}>Cập nhật: Lịch bảo trì thang máy</Typography>} secondary="Chủ nhật tuần này • 09:00" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HostDashboard;

