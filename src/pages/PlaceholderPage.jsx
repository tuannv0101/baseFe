import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Engineering } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';

const PlaceholderPage = ({ title, breadcrumbs }) => {
  const navigate = useNavigate();

  return (
    <Box>
      <PageHeader title={title} breadcrumbs={breadcrumbs} />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 10,
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)'
      }}>
        <Engineering sx={{ fontSize: 80, color: 'primary.light', mb: 2 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Tính năng đang phát triển
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4, maxWidth: 400 }}>
          Trang "{title}" hiện đang được xây dựng. Vui lòng quay lại sau hoặc liên hệ bộ phận hỗ trợ.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Quay về Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default PlaceholderPage;
