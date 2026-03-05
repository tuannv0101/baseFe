import React from 'react';
import { Box, Typography, Breadcrumbs, Link, Button, Stack } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';

const PageHeader = ({ title, breadcrumbs, action }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Breadcrumbs 
            separator={<NavigateNext fontSize="small" />} 
            aria-label="breadcrumb"
            sx={{ mb: 1 }}
          >
            <Link underline="hover" color="inherit" href="/" sx={{ fontSize: '0.875rem' }}>
              Trang chủ
            </Link>
            {breadcrumbs && breadcrumbs.map((b, index) => (
              <Typography 
                key={index} 
                color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
                sx={{ fontSize: '0.875rem' }}
              >
                {b.label}
              </Typography>
            ))}
          </Breadcrumbs>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {title}
          </Typography>
        </Box>
        {action && (
          <Button 
            variant="contained" 
            startIcon={action.icon} 
            onClick={action.onClick}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {action.label}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default PageHeader;
