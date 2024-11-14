import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Slider,
  TextField,
  Button,
  Divider,
  Alert,
  Grid
} from '@mui/material';
import { Save, RefreshCw } from 'react-feather';
import { updateSettings, getSettings } from '../services/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    faceDetectionConfidence: 0.8,
    enableNotifications: true,
    autoMarkAttendance: true,
    captureInterval: 5,
    emailNotifications: true,
    emailAddress: '',
    backupEnabled: true,
    backupFrequency: 'daily',
  });

  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  const handleSave = async () => {
    try {
      const response = await updateSettings(settings);
      if (response.success) {
        setSaveStatus({ type: 'success', message: 'Settings saved successfully!' });
      }
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to save settings.' });
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 3 }}>
      <Typography variant="h5" gutterBottom>
        System Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Face Recognition Settings
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>
                  Face Detection Confidence Threshold
                </Typography>
                <Slider
                  value={settings.faceDetectionConfidence}
                  onChange={(e, value) => 
                    setSettings(prev => ({ ...prev, faceDetectionConfidence: value }))
                  }
                  min={0.5}
                  max={1}
                  step={0.1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography>Auto-Mark Attendance</Typography>
                <Switch
                  checked={settings.autoMarkAttendance}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, autoMarkAttendance: e.target.checked }))
                  }
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography>Capture Interval (seconds)</Typography>
                <TextField
                  type="number"
                  value={settings.captureInterval}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, captureInterval: e.target.value }))
                  }
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notification Settings
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography>Enable Notifications</Typography>
                <Switch
                  checked={settings.enableNotifications}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, enableNotifications: e.target.checked }))
                  }
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography>Email Notifications</Typography>
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))
                  }
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={settings.emailAddress}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, emailAddress: e.target.value }))
                  }
                  disabled={!settings.emailNotifications}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Backup Settings
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography>Enable Automatic Backup</Typography>
                <Switch
                  checked={settings.backupEnabled}
                  onChange={(e) =>
                    setSettings(prev => ({ ...prev, backupEnabled: e.target.checked }))
                  }
                />
              </Box>

              <TextField
                select
                label="Backup Frequency"
                value={settings.backupFrequency}
                onChange={(e) =>
                  setSettings(prev => ({ ...prev, backupFrequency: e.target.value }))
                }
                SelectProps={{
                  native: true,
                }}
                disabled={!settings.backupEnabled}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </TextField>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {saveStatus.message && (
        <Alert 
          severity={saveStatus.type} 
          sx={{ mt: 2 }}
          onClose={() => setSaveStatus({ type: '', message: '' })}
        >
          {saveStatus.message}
        </Alert>
      )}

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
        >
          Save Settings
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshCw />}
          onClick={() => window.location.reload()}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default Settings; 