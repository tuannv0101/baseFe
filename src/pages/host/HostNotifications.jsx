import React, { useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Tabs,
  Tab,
  Chip,
  Divider,
  TextField,
  MenuItem,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from '@mui/material';
import {
  Build as BuildIcon,
  ReportProblem as ReportProblemIcon,
  CheckCircleOutline,
  HourglassEmpty,
  AssignmentTurnedIn,
} from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';

const mockRequests = [
  {
    id: 'REQ-001',
    building: 'Tòa A1',
    room: 'P.204',
    title: 'Sửa vòi nước bị rò',
    description: 'Vòi nước nhà tắm rò liên tục, đề nghị kiểm tra sớm.',
    createdAt: '18/03/2026',
    priority: 'HIGH',
    status: 'NEW',
    category: 'REPAIR',
    reporter: 'Trần Thị B',
  },
  {
    id: 'REQ-002',
    building: 'Tòa B1',
    room: 'P.102',
    title: 'Điều hòa không lạnh',
    description: 'Bật lâu nhưng không mát, có tiếng kêu nhẹ.',
    createdAt: '17/03/2026',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    category: 'MAINTENANCE',
    reporter: 'Nguyễn Văn A',
  },
  {
    id: 'REQ-003',
    building: 'Tòa A1',
    room: 'P.305',
    title: 'Đèn hành lang chập chờn',
    description: 'Đèn khu vực cửa phòng chập chờn vào buổi tối.',
    createdAt: '16/03/2026',
    priority: 'LOW',
    status: 'DONE',
    category: 'REPAIR',
    reporter: 'Lê Văn C',
  },
];

const priorityConfig = {
  HIGH: { label: 'Cao', color: 'error' },
  MEDIUM: { label: 'Trung bình', color: 'warning' },
  LOW: { label: 'Thấp', color: 'success' },
};

const statusConfig = {
  NEW: { label: 'Mới', color: 'info' },
  IN_PROGRESS: { label: 'Đang xử lý', color: 'warning' },
  DONE: { label: 'Hoàn tất', color: 'success' },
};

const categoryConfig = {
  REPAIR: { label: 'Sửa chữa', icon: <BuildIcon fontSize="small" /> },
  MAINTENANCE: { label: 'Bảo trì', icon: <ReportProblemIcon fontSize="small" /> },
};

const HostNotifications = () => {
  const [tab, setTab] = useState(0);
  const [requests, setRequests] = useState(mockRequests);
  const [searchText, setSearchText] = useState('');
  const [priority, setPriority] = useState('ALL');
  const [category, setCategory] = useState('ALL');

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return requests.filter((r) => {
      if (tab === 1 && r.status !== 'NEW') return false;
      if (tab === 2 && r.status !== 'IN_PROGRESS') return false;
      if (tab === 3 && r.status !== 'DONE') return false;

      if (priority !== 'ALL' && r.priority !== priority) return false;
      if (category !== 'ALL' && r.category !== category) return false;

      if (!q) return true;
      const haystack = [r.id, r.building, r.room, r.title, r.description, r.reporter].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [requests, tab, searchText, priority, category]);

  const countByStatus = useMemo(() => {
    const c = { NEW: 0, IN_PROGRESS: 0, DONE: 0 };
    requests.forEach((r) => {
      c[r.status] = (c[r.status] || 0) + 1;
    });
    return c;
  }, [requests]);

  const updateStatus = (id, next) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Thông báo"
        breadcrumbs={[{ label: 'Bảng điều khiển' }, { label: 'Thông báo' }]}
      />

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden', mb: 3 }}>
        <Box sx={{ px: 3, py: 2, bgcolor: '#fcfcfd', borderBottom: '1px solid #f1f5f9' }}>
          <Typography variant="h6" fontWeight={800}>
            Yêu cầu bảo trì & sửa chữa
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Danh sách yêu cầu từ các phòng — cập nhật trạng thái để theo dõi xử lý.
          </Typography>
        </Box>

        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f1f5f9' }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 800 } }}
          >
            <Tab label={`Tất cả (${requests.length})`} />
            <Tab label={`Mới (${countByStatus.NEW})`} />
            <Tab label={`Đang xử lý (${countByStatus.IN_PROGRESS})`} />
            <Tab label={`Hoàn tất (${countByStatus.DONE})`} />
          </Tabs>
        </Box>

        <Box sx={{ px: 3, py: 2 }}>
          <Grid container spacing={2} sx={{ width: '100%', m: 0 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Tìm theo mã, phòng, nội dung, người gửi..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Ưu tiên"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <MenuItem value="ALL">Tất cả</MenuItem>
                <MenuItem value="HIGH">Cao</MenuItem>
                <MenuItem value="MEDIUM">Trung bình</MenuItem>
                <MenuItem value="LOW">Thấp</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Loại yêu cầu"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="ALL">Tất cả</MenuItem>
                <MenuItem value="REPAIR">Sửa chữa</MenuItem>
                <MenuItem value="MAINTENANCE">Bảo trì</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <List sx={{ p: 0 }}>
          {filtered.map((r, idx) => {
            const pri = priorityConfig[r.priority] || { label: r.priority, color: 'default' };
            const st = statusConfig[r.status] || { label: r.status, color: 'default' };
            const cat = categoryConfig[r.category] || { label: r.category, icon: <BuildIcon fontSize="small" /> };

            return (
              <React.Fragment key={r.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{ px: 3, py: 2.25, bgcolor: idx % 2 === 0 ? 'white' : '#fcfcfd' }}
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <TooltipButton
                        title="Đang xử lý"
                        disabled={r.status === 'IN_PROGRESS'}
                        onClick={() => updateStatus(r.id, 'IN_PROGRESS')}
                        icon={<HourglassEmpty fontSize="small" />}
                      />
                      <TooltipButton
                        title="Hoàn tất"
                        disabled={r.status === 'DONE'}
                        onClick={() => updateStatus(r.id, 'DONE')}
                        icon={<CheckCircleOutline fontSize="small" />}
                      />
                    </Stack>
                  }
                >
                  <Avatar sx={{ bgcolor: 'grey.100', color: 'text.secondary', mr: 2 }}>
                    {cat.icon}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
                        <Typography variant="subtitle1" fontWeight={900} component="div">
                          {r.title}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip label={st.label} size="small" color={st.color} sx={{ fontWeight: 800 }} />
                          <Chip label={`Ưu tiên: ${pri.label}`} size="small" color={pri.color} variant="outlined" sx={{ fontWeight: 800 }} />
                        </Stack>
                      </Stack>
                    }
                    secondary={
                      <Box sx={{ mt: 0.75 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }} component="div">
                          {r.description}
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ sm: 'center' }}>
                          <Chip
                            size="small"
                            variant="outlined"
                            label={`${r.building} • ${r.room}`}
                            sx={{ fontWeight: 700 }}
                          />
                          <Chip
                            size="small"
                            variant="outlined"
                            label={`Người gửi: ${r.reporter}`}
                            sx={{ fontWeight: 700 }}
                          />
                          <Chip
                            size="small"
                            variant="outlined"
                            label={`Ngày: ${r.createdAt}`}
                            sx={{ fontWeight: 700 }}
                          />
                          <Chip
                            size="small"
                            variant="outlined"
                            label={cat.label}
                            sx={{ fontWeight: 700 }}
                          />
                          {r.status === 'DONE' && (
                            <Chip
                              size="small"
                              color="success"
                              icon={<AssignmentTurnedIn fontSize="small" />}
                              label="Đã xử lý"
                              sx={{ fontWeight: 800 }}
                            />
                          )}
                        </Stack>
                      </Box>
                    }
                  />
                </ListItem>
                {idx < filtered.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
          {filtered.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Không có yêu cầu nào phù hợp bộ lọc.
              </Typography>
            </Box>
          )}
        </List>
      </Paper>
    </Box>
  );
};

const TooltipButton = ({ title, icon, onClick, disabled }) => {
  return (
    <IconButton
      size="small"
      onClick={onClick}
      disabled={disabled}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'white',
      }}
      aria-label={title}
      title={title}
    >
      {icon}
    </IconButton>
  );
};

export default HostNotifications;

