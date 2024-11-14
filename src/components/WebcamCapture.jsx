import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Box, Button, CircularProgress, Alert } from '@mui/material';
import { Camera } from 'react-feather';

const WebcamCapture = ({ onCapture, disabled }) => {
  const webcamRef = useRef(null);
  const [error, setError] = useState(null);

  const captureImage = React.useCallback(() => {
    try {
      if (!webcamRef.current) {
        throw new Error('Camera not ready');
      }
      
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error('Failed to capture image');
      }
      
      return imageSrc;
    } catch (err) {
      setError('Failed to capture image. Please try again.');
      return null;
    }
  }, [webcamRef]);

  const handleCapture = () => {
    setError(null);
    onCapture(captureImage);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: 2 
    }}>
      <Box sx={{ 
        border: '2px solid rgba(255, 255, 255, 0.1)', 
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: 'background.paper'
      }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 720,
            height: 480,
            facingMode: "user"
          }}
          mirrored
        />
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        onClick={handleCapture}
        disabled={disabled}
        startIcon={disabled ? <CircularProgress size={20} /> : <Camera />}
      >
        {disabled ? 'Processing...' : 'Mark Attendance'}
      </Button>
    </Box>
  );
};

export default WebcamCapture;
