import React from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, Avatar, Stack, LinearProgress, Button } from '@mui/material';
import { 
  People, 
  AccountBalance, 
  TrendingUp, 
  Storage, 
  GroupAdd, 
  Subscriptions,
  SupportAgent as SupportAgentIcon 
} from '@mui/icons-material';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const data = [
  { name: 'Tuần 1', users: 40 },
  { name: 'Tuần 2', users: 70 },
  { name: 'Tuần 3', users: 120 },
  { name: 'Tuần 4', users: 200 },
];

const AdminDashboard = () => {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}><People /></Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">Tổng Chủ trọ</Typography>
                  <Typography variant="h5" fontWeight={700}>1,284</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}><AccountBalance /></Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">Doanh thu Sub</Typography>
                  <Typography variant="h5" fontWeight={700}>540M</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}><TrendingUp /></Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">Tăng trưởng</Typography>
                  <Typography variant="h5" fontWeight={700}>+15%</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'error.light', color: 'error.main' }}><Storage /></Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">Server Load</Typography>
                  <Typography variant="h5" fontWeight={700}>42%</Typography>
                </Box>
              </Stack>
              <LinearProgress variant="determinate" value={42} color="error" sx={{ mt: 1, borderRadius: 5 }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Tăng trưởng người dùng mới</Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#1976d2" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Tác vụ nhanh</Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Button fullWidth variant="outlined" startIcon={<GroupAdd />} sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                Duyệt chủ trọ mới (12)
              </Button>
              <Button fullWidth variant="outlined" startIcon={<Subscriptions />} sx={{ justifyContent: 'flex-start', py: 1.5 }}>
                Cấu hình gói dịch vụ
              </Button>
              <Button fullWidth variant="outlined" startIcon={<SupportAgentIcon />} sx={{ justifyContent: 'flex-start', py: 1.5 }}>
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
