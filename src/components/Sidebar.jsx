import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import {
  Home,
  UserPlus,
  Clock,
  List as ListIcon,
  Settings
} from 'react-feather';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/register', label: 'Register Student', icon: <UserPlus size={20} /> },
    { path: '/attendance', label: 'Mark Attendance', icon: <Clock size={20} /> },
    { path: '/records', label: 'Records', icon: <ListIcon size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  return (
    <Box
      sx={{
        width: 240,
        flexShrink: 0,
        bgcolor: '#0A192F',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* App Title */}
      <Box sx={{ p: 2, color: 'white' }}>
        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 35,
              height: 35,
              bgcolor: '#2196F3',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            AS
          </Box>
          Attendance System
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.path}
            selected={location.pathname === item.path}
            sx={{
              color: 'white',
              '&.Mui-selected': {
                bgcolor: '#2196F3',
                '&:hover': {
                  bgcolor: '#2196F3',
                },
              },
              '&:hover': {
                bgcolor: 'rgba(33, 150, 243, 0.8)',
              },
              mx: 1,
              borderRadius: 1,
              mb: 0.5
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.9rem'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar; 