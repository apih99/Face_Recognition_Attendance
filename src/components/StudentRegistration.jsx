import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import WebcamCapture from './WebcamCapture';
import { registerStudent } from '../services/api';

const REQUIRED_IMAGES = 50;

const StudentRegistration = () => {
  const [studentData, setStudentData] = useState({
    id: '',
    name: '',
    images: []
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);

  const startCapture = async (captureCallback) => {
    try {
      setIsCapturing(true);
      setCaptureProgress(0);
      setError(null);
      
      const newImages = [];
      
      for (let i = 0; i < REQUIRED_IMAGES; i++) {
        try {
          const image = await captureCallback();
          if (image) {
            newImages.push(image);
            setCaptureProgress(((i + 1) / REQUIRED_IMAGES) * 100);
          }
          // Add a small delay between captures
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (err) {
          console.error('Error capturing image:', err);
        }
      }

      if (newImages.length === REQUIRED_IMAGES) {
        setStudentData(prev => ({
          ...prev,
          images: newImages
        }));
        setSuccess('Face images captured successfully!');
      } else {
        setError(`Only captured ${newImages.length} images. Please try again.`);
      }
    } catch (error) {
      setError('Failed to capture images: ' + error.message);
    } finally {
      setIsCapturing(false);
      setCaptureProgress(0);
    }
  };

  const handleSubmit = async () => {
    try {
      if (studentData.images.length < REQUIRED_IMAGES) {
        setError(`Please capture all required face images`);
        return;
      }

      setIsRegistering(true);
      setError(null);
      
      const response = await registerStudent(studentData);
      if (response.success) {
        setSuccess('Student registered successfully!');
        setStudentData({ id: '', name: '', images: [] });
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsRegistering(false);
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
        <Alert severity="success" onClose={() => setSuccess(false)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Student ID"
        value={studentData.id}
        onChange={(e) => setStudentData(prev => ({...prev, id: e.target.value}))}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Student Name"
        value={studentData.name}
        onChange={(e) => setStudentData(prev => ({...prev, name: e.target.value}))}
        sx={{ mb: 2 }}
      />

      <WebcamCapture 
        onCapture={startCapture}
        disabled={isCapturing || isRegistering}
      />

      {isCapturing && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Capturing images: {Math.round(captureProgress)}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={captureProgress}
            sx={{ height: 10, borderRadius: 1 }}
          />
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Images captured: {studentData.images.length}/{REQUIRED_IMAGES}
        </Typography>

        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={
            isRegistering || 
            isCapturing ||
            !studentData.id || 
            !studentData.name || 
            studentData.images.length < REQUIRED_IMAGES
          }
        >
          {isRegistering ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Registering...
            </>
          ) : (
            'Register Student'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default StudentRegistration;
