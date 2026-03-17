import React from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, Avatar, Stack, Chip, Divider, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { HomeWork, People, Receipt, WarningAmber, Build, CheckCircle } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ChartTooltip } from 'recharts';

const pieData = [
  { name: 'Đang thuê', value: 45 },
  { name: 'Trống', value: 10 },
  { name: 'Bảo trì', value: 5 },
];
const COLORS = ['#1976d2', '#4caf50', '#ed6c02'];

const HostDashboard = () => {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}><HomeWork /></Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Tỷ lệ lấp đầy</Typography>
                  <Typography variant="h4" fontWeight={800}>85%</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}><Receipt /></Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Doanh thu tháng này</Typography>
                  <Typography variant="h4" fontWeight={800}>125M</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}><People /></Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Tiền nợ chưa thu</Typography>
                  <Typography variant="h4" fontWeight={800}>12.5M</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Room Status & Notifications */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Trạng thái phòng</Typography>
            <Box sx={{ height: 250, display: 'flex', alignItems: 'center' }}>
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
              <Stack spacing={1} sx={{ ml: 2 }}>
                {pieData.map((item, idx) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[idx] }} />
                    <Typography variant="caption">{item.name}: {item.value}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Thông báo khẩn cấp</Typography>
            <List>
              <ListItem disablePadding sx={{ py: 1.5 }}>
                <ListItemIcon><WarningAmber color="error" /></ListItemIcon>
                <ListItemText 
                  primary="Phòng 204: Hợp đồng sắp hết hạn" 
                  secondary="Hết hạn vào ngày 15/03/2026" 
                />
                <Chip label="Gia hạn" color="primary" size="small" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem disablePadding sx={{ py: 1.5 }}>
                <ListItemIcon><Build color="warning" /></ListItemIcon>
                <ListItemText 
                  primary="Yêu cầu sửa chữa: P.102 hỏng vòi nước" 
                  secondary="Gửi lúc 09:30 AM bởi Nguyễn Văn A" 
                />
                <Chip label="Phân công" color="warning" size="small" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem disablePadding sx={{ py: 1.5 }}>
                <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                <ListItemText 
                  primary="Đã chốt xong số điện Tòa nhà A" 
                  secondary="Tháng 03/2026 - Click để xem hóa đơn" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HostDashboard;
