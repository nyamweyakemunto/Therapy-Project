const express = require('express');
const { 
  testApi, 
  testTherapistAvailability, 
  testBookAppointment 
} = require('../controllers/testController');
const { getTherapistProfileById } = require('../controllers/profileController');

const router = express.Router();

// Simple test route to verify the API is working
router.get('/api/test', testApi);

// Test route for therapist availability
router.get('/api/test/availability/:therapistId', testTherapistAvailability);

// Test route for therapist profile
router.get('/api/test/therapist/:therapistId/profile', getTherapistProfileById);

// Test route for booking appointments
router.post('/api/test/appointments', testBookAppointment);

module.exports = router;
