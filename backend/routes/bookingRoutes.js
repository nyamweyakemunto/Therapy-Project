const mysql = require('mysql2/promise');
const express = require('express');
const db = require('../config/db.js');
const {getTherapists, therapistAvailability, appointments}= require('../controllers/bookingController.js')

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

// Get all therapists with their specializations
router.get('/api/therapists', getTherapists);
  
  // Get available slots for a therapist on a specific date
  router.get('/api/therapists/:id/availability', therapistAvailability);
  
  // Book an appointment
  router.post('/api/appointments', appointments);

  module.exports = router;