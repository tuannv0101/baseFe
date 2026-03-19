import React, { useEffect, useState, useCallback } from 'react';
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
  TextField,
  Chip,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import PageHeader from '../../components/common/PageHeader';
import { ROUTES } from '../../constants';
import { contractManagementService } from '../../services/host/contractManagement';
import dayjs from 'dayjs';

const statusConfig = {
  ACTIVE: { label: 'Đang hiệu lực', color: 'success' },
  PENDING: { label: 'Chờ xử lý', color: 'warning' },
  EXPIRED: { label: 'Hết hạn', color: 'default' },
  CANCELLED: { label: 'Đã hủy', color: 'error' },
};

const HostContracts = () => {
  const navigate = useNavigate();
  
  // State for data and pagination
  const [contracts, setContracts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Query params state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [textSearch, setTextSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        size: rowsPerPage,
        textSearch: textSearch || undefined,
      };
      
      const response = await contractManagementService.getContracts(params);
      
      const data = response?.data || response;
      const items = data?.content || data?.items || [];
      const total = data?.totalElements ?? data?.totalCount ?? data?.total ?? 0;
      
      setContracts(items);
      setTotalElements(total || items.length);
    } catch (error) {
      console.error('Lỗi khi tải danh sách hợp đồng:', error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, textSearch]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setTextSearch(searchInput);
      setPage(0);
    }
  };

  const handleSearchClick = () => {
    setTextSearch(searchInput);
    setPage(0);
  };

  const formatPrice = (price) => {
    if (price === '' || price === null || price === undefined) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price));
  };

  const handleOpenCreate = () => {
    navigate(ROUTES.HOST_CONTRACT_CREATE);
  };

  const handleOpenEdit = (id) => {
    navigate(`${ROUTES.HOST_CONTRACTS}/${id}/edit`);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Bạn có chắc chắn muốn xóa hợp đồng này?');
    if (!ok) return;
    
    try {
      // await contractManagementService.deleteContract(id);
      fetchContracts();
    } catch (error) {
      console.error('Lỗi khi xóa hợp đồng:', error);
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Quản lý hợp đồng"
        breadcrumbs={[{ label: 'Chủ trọ' }, { label: 'Hợp đồng thuê' }]}
      />

      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2} 
        sx={{ mb: 3 }}
      >
        <TextField
          placeholder="Tìm kiếm mã HĐ, tên khách, số phòng..."
          size="small"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearch}
          sx={{ width: { xs: '100%', sm: 350 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size="small" />
              </InputAdornment>
            ),
          }}
        />
        
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={handleSearchClick}>Tìm kiếm</Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
            Thêm hợp đồng
          </Button>
        </Stack>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.06)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Mã HĐ</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Tòa nhà / Phòng</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Người thuê</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Thời hạn</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Tiền thuê</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Tiền cọc</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }} align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <CircularProgress size={32} />
                  <Typography sx={{ mt: 1 }} color="text.secondary">Đang tải dữ liệu...</Typography>
                </TableCell>
              </TableRow>
            ) : contracts.length > 0 ? (
              contracts.map((contract) => (
                <TableRow key={contract.id} hover>
                  <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {contract.contractCode || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{contract.propertyName}</Typography>
                    <Typography variant="caption" color="text.secondary">Phòng: {contract.roomNumber}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{contract.tenantName}</Typography>
                    <Typography variant="caption" color="text.secondary">{contract.tenantIdCardNumber}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {contract.startDate ? dayjs(contract.startDate).format('DD/MM/YYYY') : '-'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      đến {contract.endDate ? dayjs(contract.endDate).format('DD/MM/YYYY') : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatPrice(contract.actualRent || contract.rentAmount)}</TableCell>
                  <TableCell>{formatPrice(contract.depositAmount)}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={statusConfig[contract.status]?.label || contract.status}
                      color={statusConfig[contract.status]?.color || 'default'}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <IconButton size="small" onClick={() => handleOpenEdit(contract.id)} title="Chỉnh sửa">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(contract.id)} title="Xóa">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                  <Typography variant="body1" color="text.secondary">Không tìm thấy hợp đồng nào</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Số dòng mỗi trang:"
        />
      </TableContainer>
    </Box>
  );
};

export default HostContracts;
