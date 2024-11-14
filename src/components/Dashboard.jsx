import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import {
  Users,
  UserCheck,
  Clock,
  AlertCircle
} from 'react-feather';
import { getDashboardStats } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        console.log('Dashboard stats:', response); // Debug log
        if (response.success) {
          setStats(response.data);
        }
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Users size={20} color="#1976d2" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Total Students
                </Typography>
              </Box>
              <Typography variant="h4">{stats?.totalStudents || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <UserCheck size={20} color="#2e7d32" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Today's Attendance
                </Typography>
              </Box>
              <Typography variant="h4">{stats?.todayAttendance || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AlertCircle size={20} color="#ed6c02" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Attendance Rate
                </Typography>
              </Box>
              <Typography variant="h4">
                {stats?.attendanceRate?.toFixed(1) || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Clock size={20} color="#9c27b0" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Active Today
                </Typography>
              </Box>
              <Typography variant="h4">
                {stats?.todayAttendance || 0}/{stats?.totalStudents || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Attendance Trend (Last 7 Days)
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.last7Days || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {stats?.recentActivity?.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#1976d2' }}>
                        {activity.name[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.name}
                      secondary={`${activity.date} ${activity.time}`}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText secondary="No recent activity" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 