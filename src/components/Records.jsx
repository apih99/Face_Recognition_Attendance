import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material';
import { getAttendance } from '../services/api';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await getAttendance();
        if (response.success) {
          setRecords(response.data);
        } else {
          setError('Failed to load attendance records');
        }
      } catch (error) {
        setError('Failed to load attendance records');
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
        Records
      </Typography>

      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ 
            mb: 2,
            '& .MuiAlert-message': { color: '#ef5350' }
          }}
        >
          {error}
        </Alert>
      )}

      <TableContainer 
        component={Paper} 
        sx={{ 
          bgcolor: '#1E2A3E',
          borderRadius: 2,
          '& .MuiTableCell-root': {
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.length > 0 ? (
              records.map((record, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    '&:hover': { 
                      bgcolor: 'rgba(33, 150, 243, 0.1)'
                    }
                  }}
                >
                  <TableCell>{record.student_id}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.time}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: record.status === 'Present' ? 'success.dark' : 'error.dark',
                        color: 'white',
                        fontSize: '0.875rem'
                      }}
                    >
                      {record.status}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  No attendance records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Records; 