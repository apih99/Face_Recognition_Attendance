import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box
} from '@mui/material';
import { getAttendance } from '../services/api';

const AttendanceTable = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await getAttendance();
        if (response.success) {
          setAttendanceRecords(response.data);
        }
      } catch (error) {
        setError('Failed to load attendance records');
        console.error('Error fetching attendance:', error);
      }
    };

    fetchAttendance();
  }, []);

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Attendance Records
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map((record, index) => (
                <TableRow key={`${record.student_id}-${record.date}-${record.time}-${index}`}>
                  <TableCell>{record.student_id}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.time}</TableCell>
                  <TableCell>{record.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
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

export default AttendanceTable;
