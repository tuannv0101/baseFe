import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  HomeWork,
  People,
  Receipt,
  NotificationsActive,
  WarningAmber,
  CheckCircleOutline,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const data = [
  { name: 'T1', thu: 4000, chi: 2400 },
  { name: 'T2', thu: 3000, chi: 1398 },
  { name: 'T3', thu: 2000, chi: 9800 },
  { name: 'T4', thu: 2780, chi: 3908 },
  { name: 'T5', thu: 1890, chi: 4800 },
  { name: 'T6', thu: 2390, chi: 3800 },
];

const pieData = [
  { name: 'Đang thuê', value: 45 },
  { name: 'Trống', value: 10 },
  { name: 'Bảo trì', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const StatCard = ({ title, value, icon, color, trend }) => (
  <Card sx={{ height: '100%', borderRadius: 2, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="text.secondary" variant="body2" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ my: 1, fontWeight: 700 }}>
            {value}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend > 0 ? (
                <TrendingUp sx={{ color: 'success.main', fontSize: '1rem' }} />
              ) : (
                <TrendingDown sx={{ color: 'error.main', fontSize: '1rem' }} />
              )}
              <Typography
                variant="caption"
                sx={{ color: trend > 0 ? 'success.main' : 'error.main', fontWeight: 600 }}
              >
                {Math.abs(trend)}% so với tháng trước
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.main`, borderRadius: 2 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const Home = () => {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Tổng quan hệ thống
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng doanh thu"
            value="125,000,000 đ"
            icon={<TrendingUp />}
            color="primary"
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tỷ lệ lấp đầy"
            value="85%"
            icon={<HomeWork />}
            color="success"
            trend={2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng khách thuê"
            value="128"
            icon={<People />}
            color="info"
            trend={5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Hóa đơn chưa thanh toán"
            value="12"
            icon={<Receipt />}
            color="warning"
            trend={-8}
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Biểu đồ Thu - Chi
            </Typography>
            <Box sx={{ height: 300, width: '100%' }}>
              <ResponsiveContainer>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="thu" fill="#0088FE" name="Thu" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="chi" fill="#FFBB28" name="Chi" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)', height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Trạng thái phòng
            </Typography>
            <Box sx={{ height: 250, width: '100%' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Stack spacing={1}>
              {pieData.map((item, index) => (
                <Box key={item.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS[index] }} />
                    <Typography variant="body2">{item.name}</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>{item.value} phòng</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Notifications & Reminders */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Thông báo & Nhắc nhở
              </Typography>
              <Chip label="Mới" color="error" size="small" />
            </Box>
            <List sx={{ p: 0 }}>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <WarningAmber color="error" />
                </ListItemIcon>
                <ListItemText
                  primary="Nguyễn Văn A (P.102) quá hạn tiền nhà 3 ngày"
                  secondary="Hóa đơn: 4,500,000 đ"
                />
                <Chip label="Khẩn cấp" color="error" variant="outlined" size="small" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <NotificationsActive color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Hợp đồng P.305 sắp hết hạn"
                  secondary="Ngày hết hạn: 15/03/2026"
                />
                <Chip label="Gia hạn" color="primary" variant="outlined" size="small" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <BuildIcon color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="Yêu cầu sửa chữa mới: Vòi nước hỏng (P.204)"
                  secondary="Người gửi: Trần Thị B - 10:30 AM"
                />
                <Chip label="Xử lý" color="warning" variant="outlined" size="small" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Hoạt động gần đây
            </Typography>
            <Stack spacing={2}>
              {[
                { text: 'Đã thu tiền nhà P.101', time: '5 phút trước', icon: <CheckCircleOutline color="success" /> },
                { text: 'Tạo mới hợp đồng P.402', time: '1 giờ trước', icon: <Description color="info" /> },
                { text: 'Đã xử lý xong yêu cầu sửa chữa P.205', time: '3 giờ trước', icon: <CheckCircleOutline color="success" /> },
                { text: 'Khách thuê P.105 báo tạm trú thành công', time: '5 giờ trước', icon: <AssignmentTurnedIn color="primary" /> },
              ].map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'grey.50', color: 'inherit' }}>{item.icon}</Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>{item.text}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.time}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
