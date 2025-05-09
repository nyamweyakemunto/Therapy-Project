const express = require('express');
const {
  getProfile,
  updateProfile,
  getPublicProfile,
  getTherapistByUserId
} = require('../controllers/therapistController');
const {
  getTherapistAvailability,
  getTherapistAvailabilityForManagement,
  addAvailability,
  updateAvailability,
  deleteAvailability
} = require('../controllers/availabilityController');
const { getTherapistProfile } = require('../controllers/profileController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Middleware to check if user is a therapist
 * Used to protect therapist-only routes
 */
const isTherapist = (req, res, next) => {
  if (req.user && req.user.role === 'therapist') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Therapist role required.' });
};

// PRIVATE ROUTES (require therapist authentication)

// Get therapist's own profile (private)
// Support both paths for compatibility
router.get('/api/therapist/profile', authMiddleware(), isTherapist, getProfile);
router.get('/therapist/profile', authMiddleware(), isTherapist, getProfile);

// Update therapist's own profile
// Support both paths for compatibility
router.put('/api/therapist/profile', authMiddleware(), isTherapist, updateProfile);
router.put('/therapist/profile', authMiddleware(), isTherapist, updateProfile);

// PUBLIC ROUTES (accessible to all users)

// Get therapist by user ID
router.get('/api/therapists', getTherapistByUserId);

// Get public therapist profile (for patients to view)
// Support both paths for compatibility
router.get('/api/therapists/:id/profile', getPublicProfile);
router.get('/therapists/:id/profile', getPublicProfile);

// THERAPIST PROFILE ROUTES

// Get therapist's own profile
router.get('/api/therapist/profile', getTherapistProfile);

// AVAILABILITY MANAGEMENT ROUTES

// Get therapist's availability for management
router.get('/api/therapist/availability/manage/:therapistId', getTherapistAvailabilityForManagement);

// Add new availability slot
router.post('/api/therapist/availability', addAvailability);

// Update existing availability slot
router.put('/api/therapist/availability/:availabilityId', updateAvailability);

// Delete availability slot
router.delete('/api/therapist/availability/:availabilityId', deleteAvailability);

module.exports = router;