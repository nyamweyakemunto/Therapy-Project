const mysql = require('mysql2/promise');
const express = require('express');
const db = require('../config/db.js');
const {getTherapists, therapistAvailability, appointments, getTherapistById} = require('../controllers/patientController.js');
const {getTherapistAvailability} = require('../controllers/availabilityController');
const {getPatientProfile} = require('../controllers/profileController');

const router = express.Router();

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'therapy_platform',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
// API Endpoints

// PATIENT PROFILE ROUTES

// Get patient's own profile
router.get('/api/patient/profile', getPatientProfile);

// THERAPIST DISCOVERY ROUTES

// Get all therapists with their specializations
router.get('/api/therapists', getTherapists);

  // Get available slots for a therapist on a specific date with query parameters (e.g. ?date=2023-12-31)
  router.get('/api/therapists/:id/availability/slots', therapistAvailability);

  // Get all availability slots for a therapist (used in patient-side therapist profile)
  router.get('/api/therapists/:therapistId/availability', getTherapistAvailability);

  // Book an appointment
  router.post('/api/appointments', appointments);

  // Add this to your router
router.get('/api/therapists/:id', getTherapistById);

  module.exports = router;