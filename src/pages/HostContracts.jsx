import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  TablePagination,
  Button,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import { ROUTES } from '../constants';

const initialContracts = [
  {
    id: 1,
    contractCode: 'HD-001',
    roomNumber: 'P.401',
    tenantName: 'Nguyen Van A',
    idCardNumber: '012345678901',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    rent: 6600000,
    deposit: 6600000,
    status: 'ACTIVE',
  },
  {
    id: 2,
    contractCode: 'HD-002',
    roomNumber: 'P.402',
    tenantName: 'Tran Thi B',
    idCardNumber: '012345678902',
    startDate: '2025-03-01',
    endDate: '2026-02-28',
    rent: 5500000,
    deposit: 5500000,
    status: 'ACTIVE',
  },
  {
    id: 3,
    contractCode: 'HD-003',
    roomNumber: 'P.403',
    tenantName: 'Le Van C',
    idCardNumber: '012345678903',
    startDate: '2024-06-01',
    endDate: '2025-05-31',
    rent: 4500000,
    deposit: 4500000,
    status: 'EXPIRED',
  },
];

const statusConfig = {
  ACTIVE: { label: 'Active', color: 'success' },
  PENDING: { label: 'Pending', color: 'warning' },
  EXPIRED: { label: 'Expired', color: 'default' },
};

const emptyForm = {
  id: null,
  contractCode: '',
  roomNumber: '',
  tenantName: '',
  idCardNumber: '',
  startDate: '',
  endDate: '',
  rent: '',
  deposit: '',
  status: 'ACTIVE',
};

const HostContracts = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState(initialContracts);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const pagedContracts = useMemo(() => {
    return contracts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [contracts, page, rowsPerPage]);

  const formatPrice = (price) => {
    if (price === '' || price === null || price === undefined) return '';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price));
  };

  const handleOpenCreate = () => {
    navigate(ROUTES.HOST_CONTRACT_CREATE);
  };

  const handleOpenEdit = (contract) => {
    setForm({ ...contract });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.contractCode || !form.roomNumber || !form.tenantName) return;

    if (form.id) {
      setContracts(prev => prev.map(item => (item.id === form.id ? { ...form } : item)));
    } else {
      setContracts(prev => [{ ...form, id: Date.now() }, ...prev]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id) => {
    const ok = window.confirm('Xoa hop dong nay?');
    if (!ok) return;
    setContracts(prev => prev.filter(item => item.id !== id));
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Hop dong thue"
        breadcrumbs={[{ label: 'Chu tro' }, { label: 'Hop dong thue' }]}
      />

      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>Them hop dong</Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Ma HD</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Phong</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Nguoi thue</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>CCCD/CMND</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Bat dau</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Ket thuc</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Tien thue</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Trang thai</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }} align="right">Thao tac</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedContracts.map((contract) => (
              <TableRow key={contract.id} hover>
                <TableCell>{contract.contractCode}</TableCell>
                <TableCell>{contract.roomNumber}</TableCell>
                <TableCell>{contract.tenantName}</TableCell>
                <TableCell>{contract.idCardNumber}</TableCell>
                <TableCell>{contract.startDate}</TableCell>
                <TableCell>{contract.endDate}</TableCell>
                <TableCell>{formatPrice(contract.rent)}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={statusConfig[contract.status]?.label || contract.status}
                    color={statusConfig[contract.status]?.color || 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenEdit(contract)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(contract.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {pagedContracts.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                  <Typography variant="body1" color="text.secondary">Khong co hop dong</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={contracts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="So dong moi trang:"
        />
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{form.id ? 'Chinh sua hop dong' : 'Them hop dong'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Ma hop dong"
              name="contractCode"
              value={form.contractCode}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Phong"
              name="roomNumber"
              value={form.roomNumber}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Nguoi thue"
              name="tenantName"
              value={form.tenantName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="CCCD/CMND"
              name="idCardNumber"
              value={form.idCardNumber}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Bat dau"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Ket thuc"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Tien thue"
              name="rent"
              type="number"
              value={form.rent}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Tien coc"
              name="deposit"
              type="number"
              value={form.deposit}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Trang thai"
              name="status"
              select
              value={form.status}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="PENDING">PENDING</MenuItem>
              <MenuItem value="EXPIRED">EXPIRED</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Huy</Button>
          <Button variant="contained" onClick={handleSave}>Luu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HostContracts;
