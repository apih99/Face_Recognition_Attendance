import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Alert,
  CircularProgress,
  Button
} from '@mui/material';
import { Camera } from 'react-feather';
import WebcamCapture from './WebcamCapture';
import { markAttendance } from '../services/api';

const AttendanceMarking = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCapture = async (captureCallback) => {
    try {
      setIsProcessing(true);
      setError(null);
      setSuccess(null);

      // Capture single image
      const image = await captureCallback();
      if (!image) {
        throw new Error('Failed to capture image');
      }

      // Send to server
      const response = await markAttendance(image);
      
      if (response.success && response.data && response.data.length > 0) {
        setSuccess(`Attendance marked for ${response.data[0].name}`);
      } else {
        setError('No face recognized. Please try again.');
      }
    } catch (error) {
      setError(error.message || 'Failed to mark attendance');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Mark Attendance
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <WebcamCapture 
        onCapture={handleCapture}
        disabled={isProcessing}
      />

      {isProcessing && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <CircularProgress size={20} />
          <Typography>Processing...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default AttendanceMarking;
