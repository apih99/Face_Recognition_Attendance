import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0A192F' }}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#0A192F',
          color: 'white',
          minHeight: '100vh',
          width: { sm: `calc(100% - 240px)` }
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 