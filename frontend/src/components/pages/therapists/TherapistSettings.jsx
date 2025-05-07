import React, { useState, useRef } from 'react';
import { useContext } from 'react';
import SideBar from '../../TherapistSideBar';
import { FiCamera, FiTrash2, FiEye, FiEyeOff, FiLogOut, FiLock } from 'react-icons/fi';
import { AuthContext } from '../../../context/AuthContext';


const TherapistSettings = () => {
    const { user } = useContext(AuthContext);
  
  // State for form fields initialized with user data
  const [profile, setProfile] = useState({
    name: user ? `Dr. ${user.first_name} ${user.last_name}` : 'Dr. Sarah Johnson',
    email: user ? user.email : 'sarah.johnson@therapyclinic.com',
    phone: user?.phone || '(555) 123-4567', // Assuming phone might be in user data
    specialization: user?.specialization || null, // Not in current user data
    licenseNumber: user?.license_number || null, // Not in current user data
    bio: user?.bio || null, // Not in current user data
    profilePicture: null,
    availability: {
      monday: true,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    sessionDuration: 50,
    videoPlatform: 'Zoom',
    notificationPreferences: {
      email: true,
      sms: false,
      push: true
    },
    appPreferences: {
      darkMode: false,
      fontSize: 'medium',
      autoSave: true,
      reminderBeforeSession: 15
    },
    showPassword: false,
    password: ''
  });

  const fileInputRef = useRef(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile picture
  const removeProfilePicture = () => {
    setProfile(prev => ({
      ...prev,
      profilePicture: null
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setProfile(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', profile);
    alert('Settings saved successfully!');
  };

  // Account actions
  const handleAccountAction = (action) => {
    switch(action) {
      case 'changePassword':
        alert('Password change functionality would be implemented here');
        break;
      case 'logout':
        alert('Logging out...');
        // Typically you would handle logout logic here
        break;
      case 'deleteAccount':
        if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
          alert('Account deletion functionality would be implemented here');
        }
        break;
      default:
        break;
    }
  };

  return (
    <SideBar>
      <div style={styles.container}>
        <h1 style={styles.header}>Therapist Settings</h1>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Profile Picture Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeader}>Profile Picture</h2>
            <div style={styles.profilePictureContainer}>
              <div style={styles.profilePictureWrapper}>
                {profile.profilePicture ? (
                  <>
                    <img 
                      src={profile.profilePicture} 
                      alt="Profile" 
                      style={styles.profilePicture}
                    />
                    <button 
                      type="button" 
                      onClick={removeProfilePicture}
                      style={styles.removePictureButton}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </>
                ) : (
                  <div style={styles.profilePicturePlaceholder}>
                    <FiCamera size={32} style={styles.cameraIcon} />
                  </div>
                )}
              </div>
              <div style={styles.profilePictureActions}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfilePictureChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  style={styles.uploadButton}
                >
                  {profile.profilePicture ? 'Change Photo' : 'Upload Photo'}
                </button>
                {profile.profilePicture && (
                  <button
                    type="button"
                    onClick={removeProfilePicture}
                    style={styles.removeButton}
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeader}>Profile Information</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Specialization</label>
              <input
                type="text"
                name="specialization"
                value={profile.specialization}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={profile.licenseNumber}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                style={{...styles.input, height: '100px'}}
                rows="4"
              />
            </div>
          </div>
          
          {/* Availability Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeader}>Availability</h2>
            
            <div style={styles.availabilityGrid}>
              {Object.keys(profile.availability).map(day => (
                <div key={day} style={styles.availabilityItem}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name={`availability.${day}`}
                      checked={profile.availability[day]}
                      onChange={handleChange}
                      style={styles.checkbox}
                    />
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </label>
                </div>
              ))}
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Session Duration (minutes)</label>
              <select
                name="sessionDuration"
                value={profile.sessionDuration}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="30">30 minutes</option>
                <option value="50">50 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>
          </div>
          
          {/* Video Platform Preferences */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeader}>Video Platform Preferences</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Preferred Video Platform</label>
              <select
                name="videoPlatform"
                value={profile.videoPlatform}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="Zoom">Zoom</option>
                <option value="Google Meet">Google Meet</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="Doxy.me">Doxy.me</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          {/* Notification Preferences */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeader}>Notification Preferences</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="notificationPreferences.email"
                  checked={profile.notificationPreferences.email}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                Email Notifications
              </label>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="notificationPreferences.sms"
                  checked={profile.notificationPreferences.sms}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                SMS Notifications
              </label>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="notificationPreferences.push"
                  checked={profile.notificationPreferences.push}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                Push Notifications
              </label>
            </div>
          </div>

          {/* App Preferences */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeader}>App Preferences</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="appPreferences.darkMode"
                  checked={profile.appPreferences.darkMode}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                Dark Mode
              </label>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Text Size</label>
              <select
                name="appPreferences.fontSize"
                value={profile.appPreferences.fontSize}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="appPreferences.autoSave"
                  checked={profile.appPreferences.autoSave}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                Auto-save Changes
              </label>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Reminder Before Session (minutes)</label>
              <input
                type="number"
                name="appPreferences.reminderBeforeSession"
                value={profile.appPreferences.reminderBeforeSession}
                onChange={handleChange}
                min="5"
                max="60"
                step="5"
                style={styles.input}
              />
            </div>
          </div>

          {/* Account Actions */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeader}>Account Actions</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Current Password</label>
              <div style={styles.passwordInputContainer}>
                <input
                  type={profile.showPassword ? "text" : "password"}
                  name="password"
                  value={profile.password}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={styles.passwordToggle}
                >
                  {profile.showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>
            
            <div style={styles.accountActions}>
              <button
                type="button"
                onClick={() => handleAccountAction('changePassword')}
                style={styles.accountActionButton}
              >
                <FiLock size={16} style={styles.actionIcon} />
                Change Password
              </button>
              
              <button
                type="button"
                onClick={() => handleAccountAction('logout')}
                style={styles.accountActionButton}
              >
                <FiLogOut size={16} style={styles.actionIcon} />
                Log Out
              </button>
              
              <button
                type="button"
                onClick={() => handleAccountAction('deleteAccount')}
                style={{...styles.accountActionButton, ...styles.deleteAccountButton}}
              >
                <FiTrash2 size={16} style={styles.actionIcon} />
                Delete Account
              </button>
            </div>
          </div>
          
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.primaryButton}>
              Save Changes
            </button>
            <button type="button" style={styles.secondaryButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </SideBar>
  );
};

// CSS styles in JSX format
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    flex: 1,
    marginLeft: '20px'
  },
  header: {
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  section: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  sectionHeader: {
    color: '#3498db',
    marginTop: '0',
    marginBottom: '20px',
    fontSize: '1.2rem',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '600',
    color: '#2c3e50',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    color: '#2c3e50',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  availabilityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '10px',
    marginBottom: '20px',
  },
  availabilityItem: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  primaryButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#2980b9',
    }
  },
  secondaryButton: {
    backgroundColor: '#e0e0e0',
    color: '#2c3e50',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s',
    '&:hover': {
      backgroundColor: '#d0d0d0',
    }
  },
  // Profile picture styles
  profilePictureContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '20px',
  },
  profilePictureWrapper: {
    position: 'relative',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  profilePicturePlaceholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    color: '#999',
  },
  cameraIcon: {
    color: '#3498db',
  },
  removePictureButton: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
  },
  profilePictureActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  uploadButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: 'transparent',
    color: '#e74c3c',
    border: '1px solid #e74c3c',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  // Password input styles
  passwordInputContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordToggle: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#7f8c8d',
    cursor: 'pointer',
    padding: '5px',
  },
  // Account actions styles
  accountActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px',
  },
  accountActionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    color: '#3498db',
    border: '1px solid #3498db',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s',
    '&:hover': {
      backgroundColor: '#f0f7ff',
    }
  },
  deleteAccountButton: {
    color: '#e74c3c',
    borderColor: '#e74c3c',
    '&:hover': {
      backgroundColor: '#fff0f0',
    }
  },
  actionIcon: {
    marginRight: '5px',
  }
};

export default TherapistSettings;