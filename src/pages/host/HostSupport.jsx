import React, { useMemo, useState } from 'react';
import Grid from '@mui/material/Grid';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  alpha,
} from '@mui/material';
import { AddCircleOutline, SupportAgent, ArrowForwardIos, CheckCircle, PendingActions, ErrorOutline } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';

const mockTickets = [
  { id: 'SUP-001', subject: 'Không tạo được hóa đơn', category: 'Tài chính', priority: 'HIGH', status: 'OPEN', createdAt: '18/03/2026' },
  { id: 'SUP-002', subject: 'Cần hướng dẫn phân quyền nhân viên', category: 'Tài khoản', priority: 'MEDIUM', status: 'IN_PROGRESS', createdAt: '16/03/2026' },
  { id: 'SUP-003', subject: 'Góp ý giao diện mobile', category: 'Góp ý', priority: 'LOW', status: 'RESOLVED', createdAt: '10/03/2026' },
];

const statusMeta = {
  OPEN: { label: 'Mới', color: '#2563eb', icon: <PendingActions sx={{ fontSize: 18 }} /> },
  IN_PROGRESS: { label: 'Đang xử lý', color: '#f59e0b', icon: <SupportAgent sx={{ fontSize: 18 }} /> },
  RESOLVED: { label: 'Đã xử lý', color: '#10b981', icon: <CheckCircle sx={{ fontSize: 18 }} /> },
};

const priorityMeta = {
  LOW: { label: 'Thấp', color: '#10b981' },
  MEDIUM: { label: 'Vừa', color: '#f59e0b' },
  HIGH: { label: 'Cao', color: '#ef4444' },
};

const HostSupport = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ subject: '', category: 'Tài khoản', priority: 'MEDIUM', message: '' });

  const tickets = useMemo(() => mockTickets, []);

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Yêu cầu Hỗ trợ"
        breadcrumbs={[{ label: 'Host' }, { label: 'Yêu cầu Hỗ trợ' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<AddCircleOutline />}
            onClick={() => setOpenDialog(true)}
            sx={{ borderRadius: 2.5, fontWeight: 900, boxShadow: '0 8px 18px rgba(37, 99, 235, 0.18)' }}
          >
            Tạo yêu cầu
          </Button>
        }
      />

      <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
              <Box>
                <Typography variant="h6" fontWeight={900}>
                  Trung tâm hỗ trợ (UI)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Host gửi yêu cầu để Admin hỗ trợ và theo dõi trạng thái xử lý.
                </Typography>
              </Box>
              <Button variant="outlined" endIcon={<ArrowForwardIos sx={{ fontSize: 14 }} />} sx={{ borderRadius: 2.5, fontWeight: 900 }}>
                Xem hướng dẫn
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2.5, bgcolor: '#fcfcfd', borderBottom: '1px solid #f1f5f9' }}>
              <Typography variant="h6" fontWeight={900}>
                Danh sách yêu cầu
              </Typography>
              <Typography variant="caption" color="text.secondary">
                3 yêu cầu gần nhất (demo)
              </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
              <Stack spacing={1.25}>
                {tickets.map((t) => {
                  const s = statusMeta[t.status] || { label: t.status, color: '#64748b', icon: <ErrorOutline sx={{ fontSize: 18 }} /> };
                  const p = priorityMeta[t.priority] || { label: t.priority, color: '#64748b' };
                  return (
                    <Paper
                      key={t.id}
                      elevation={0}
                      sx={{
                        p: 2.25,
                        borderRadius: 3,
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 2,
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2.5,
                            bgcolor: alpha(s.color, 0.12),
                            color: s.color,
                            display: 'grid',
                            placeItems: 'center',
                            flex: '0 0 auto',
                          }}
                        >
                          {s.icon}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                            <Typography fontWeight={900} sx={{ color: '#0f172a' }}>
                              {t.subject}
                            </Typography>
                            <Chip size="small" label={t.id} sx={{ fontWeight: 900 }} />
                          </Stack>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                            {t.category} • Tạo ngày {t.createdAt}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                            <Chip size="small" label={s.label} sx={{ fontWeight: 900, bgcolor: alpha(s.color, 0.12), color: s.color }} />
                            <Chip size="small" label={`Ưu tiên: ${p.label}`} sx={{ fontWeight: 900, bgcolor: alpha(p.color, 0.1), color: p.color }} />
                          </Stack>
                        </Box>
                      </Stack>

                      <Button variant="text" sx={{ textTransform: 'none', fontWeight: 900, whiteSpace: 'nowrap' }} endIcon={<ArrowForwardIos sx={{ fontSize: 14 }} />}>
                        Chi tiết
                      </Button>
                    </Paper>
                  );
                })}
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900 }}>Tạo yêu cầu hỗ trợ</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Tiêu đề"
              value={form.subject}
              onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
              fullWidth
            />
            <TextField
              select
              label="Danh mục"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              fullWidth
            >
              {['Tài khoản', 'Tài chính', 'Kỹ thuật', 'Góp ý'].map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Mức ưu tiên"
              value={form.priority}
              onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
              fullWidth
            >
              {[
                { value: 'LOW', label: 'Thấp' },
                { value: 'MEDIUM', label: 'Vừa' },
                { value: 'HIGH', label: 'Cao' },
              ].map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Nội dung"
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
              fullWidth
              multiline
              minRows={4}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="outlined" onClick={() => setOpenDialog(false)} sx={{ borderRadius: 2.5, fontWeight: 900 }}>
            Hủy
          </Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)} sx={{ borderRadius: 2.5, fontWeight: 900 }}>
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HostSupport;

