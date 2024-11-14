import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress
} from '@mui/material';
import WebcamCapture from './WebcamCapture';
import { registerStudent } from '../services/api';

const RegisterStudent = () => {
  const [studentData, setStudentData] = useState({
    id: '',
    name: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCapture = async (captureCallback) => {
    try {
      const image = await captureCallback();
      if (image) {
        setStudentData(prev => ({
          ...prev,
          images: [...prev.images, image]
        }));
      }
    } catch (error) {
      setError('Failed to capture image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentData.id || !studentData.name || studentData.images.length === 0) {
      setError('Please fill all fields and capture at least one image');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await registerStudent(studentData);
      if (response.success) {
        setSuccess('Student registered successfully');
        setStudentData({ id: '', name: '', images: [] });
      }
    } catch (error) {
      setError(error.message || 'Failed to register student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Register New Student
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

      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Student ID"
            value={studentData.id}
            onChange={(e) => setStudentData(prev => ({ ...prev, id: e.target.value }))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Student Name"
            value={studentData.name}
            onChange={(e) => setStudentData(prev => ({ ...prev, name: e.target.value }))}
            margin="normal"
            required
          />
        </form>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Capture Face Images
        </Typography>
        <WebcamCapture onCapture={handleCapture} disabled={loading} />
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Images captured: {studentData.images.length}
          </Typography>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || studentData.images.length === 0}
            sx={{ mt: 1 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Register Student'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterStudent; 