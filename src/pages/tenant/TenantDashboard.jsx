import React from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, Button, Stack, Chip, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Payments, ReportProblem, InsertDriveFile, DirectionsCar, Notifications, ArrowForwardIos } from '@mui/icons-material';

const TenantDashboard = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Bill Card - Focus on what to pay */}
      <Card sx={{ borderRadius: 4, mb: 3, bgcolor: '#1a237e', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        <CardContent sx={{ p: 4 }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Số tiền cần đóng tháng 03/2026</Typography>
          <Typography variant="h3" fontWeight={800} sx={{ my: 1 }}>4.850.000 đ</Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
             <Chip label="Hạn chót: 10/03" sx={{ bgcolor: '#ff5252', color: 'white', fontWeight: 700 }} />
             <Typography variant="caption" sx={{ opacity: 0.7 }}>Chưa thanh toán</Typography>
          </Stack>
          <Button variant="contained" fullWidth size="large" sx={{ bgcolor: 'white', color: '#1a237e', fontWeight: 700, '&:hover': { bgcolor: '#f5f5f5' } }}>
            Thanh toán ngay
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3, cursor: 'pointer' }}>
            <ReportProblem color="error" sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="body2" fontWeight={600}>Báo sự cố</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 3, cursor: 'pointer' }}>
            <DirectionsCar color="primary" sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="body2" fontWeight={600}>Đăng ký xe</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Notifications */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2, px: 1 }}>Thông báo mới nhất</Typography>
      <Paper sx={{ borderRadius: 3, mb: 3 }}>
        <List>
          <ListItem sx={{ py: 2 }}>
            <ListItemIcon><Notifications color="primary" /></ListItemIcon>
            <ListItemText 
              primary="Thông báo phun thuốc muỗi" 
              secondary="Thời gian: 09:00 AM Chủ nhật tuần này" 
            />
          </ListItem>
          <ListItem sx={{ py: 2, borderTop: '1px solid #f1f5f9' }}>
            <ListItemIcon><InsertDriveFile color="info" /></ListItemIcon>
            <ListItemText 
              primary="Cập nhật nội quy phòng cháy chữa cháy" 
              secondary="Vui lòng đọc kỹ nội quy mới tại khu vực thang máy" 
            />
            <ArrowForwardIos sx={{ fontSize: 16, color: 'text.disabled' }} />
          </ListItem>
        </List>
      </Paper>

      {/* Quick Services */}
      <Paper sx={{ p: 2, borderRadius: 3, bgcolor: '#f0f9ff', border: '1px dashed #0ea5e9' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" fontWeight={700} color="#0369a1">Bạn muốn gia hạn hợp đồng?</Typography>
            <Typography variant="caption" color="#0369a1">Hợp đồng của bạn còn 45 ngày.</Typography>
          </Box>
          <Button size="small" variant="contained" sx={{ bgcolor: '#0369a1' }}>Yêu cầu ngay</Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default TenantDashboard;
