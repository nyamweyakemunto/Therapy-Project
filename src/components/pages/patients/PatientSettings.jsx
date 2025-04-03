import React, { useState } from 'react';
import SideBar from '../../PatientSideBar';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  TextField,
  Paper
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  AccountCircle as AccountIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  Palette as PaletteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const PatientSettings = () => {
  const [userData, setUserData] = useState({
    name: 'Patient Name',
    email: 'patient@example.com',
    therapist: 'Dr. Smith',
    phone: '(123) 456-7890'
  });

  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    appointmentReminders: true,
    medicationReminders: false,
    therapyProgressAlerts: true
  });

  const [editMode, setEditMode] = useState(false);
  const [tempUserData, setTempUserData] = useState({...userData});

  const handleSettingChange = (setting) => (event) => {
    setSettings({...settings, [setting]: event.target.checked});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempUserData({...tempUserData, [name]: value});
  };

  const handleSaveProfile = () => {
    setUserData(tempUserData);
    setEditMode(false);
    // Add API call to save data in a real application
  };

  const handleCancelEdit = () => {
    setTempUserData(userData);
    setEditMode(false);
  };

  return (
    <SideBar>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SettingsIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            Patient Settings
          </Typography>
        </Box>

        {/* Profile Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 72, height: 72, mr: 3 }}>
              <AccountIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              {editMode ? (
                <>
                  <TextField
                    name="name"
                    label="Full Name"
                    value={tempUserData.name}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    name="email"
                    label="Email"
                    value={tempUserData.email}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    name="phone"
                    label="Phone Number"
                    value={tempUserData.phone}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                </>
              ) : (
                <>
                  <Typography variant="h5">{userData.name}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {userData.email}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {userData.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Therapist: {userData.therapist}
                  </Typography>
                </>
              )}
            </Box>
            {editMode ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </Box>
            ) : (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            )}
          </Box>
        </Paper>

        {/* Notification Settings */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notification Preferences
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Enable Notifications" />
              <Switch
                checked={settings.notifications}
                onChange={handleSettingChange('notifications')}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Appointment Reminders" inset />
              <Switch
                checked={settings.appointmentReminders}
                onChange={handleSettingChange('appointmentReminders')}
                disabled={!settings.notifications}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Medication Reminders" inset />
              <Switch
                checked={settings.medicationReminders}
                onChange={handleSettingChange('medicationReminders')}
                disabled={!settings.notifications}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Therapy Progress Alerts" inset />
              <Switch
                checked={settings.therapyProgressAlerts}
                onChange={handleSettingChange('therapyProgressAlerts')}
                disabled={!settings.notifications}
              />
            </ListItem>
          </List>
        </Paper>

        {/* App Preferences */}
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            App Preferences
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            <ListItem>
              <ListItemIcon>
                <PaletteIcon />
              </ListItemIcon>
              <ListItemText primary="Dark Mode" />
              <Switch
                checked={settings.darkMode}
                onChange={handleSettingChange('darkMode')}
              />
            </ListItem>
          </List>
        </Paper>

        {/* Account Actions */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Account Actions
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            <ListItem button>
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText primary="Change Password" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary="Help & Support" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Log Out" />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </SideBar>
  );
};

export default PatientSettings;