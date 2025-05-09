const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const {
  getTherapistAppointments,
  getPatientAppointments,
  createAppointment,
  updateAppointmentStatus,
  rescheduleAppointment,
  getAppointmentById
} = require('../controllers/appointmentController');
const {
  getTherapistAvailability,
  addAvailability,
  updateAvailability,
  deleteAvailability
} = require('../controllers/availabilityController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '0712400421',
  database: process.env.DB_NAME || 'therapy_platform',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const router = express.Router();

// Middleware to check if user is a therapist
const isTherapist = (req, res, next) => {
  if (req.user && req.user.role === 'therapist') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Therapist role required.' });
};

// Middleware to check if user is a patient
const isPatient = (req, res, next) => {
  if (req.user && req.user.role === 'patient') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Patient role required.' });
};

// Middleware to get therapist ID from user ID
const getTherapistId = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'therapist') {
      return res.status(403).json({ message: 'Access denied. Therapist role required.' });
    }

    const [therapists] = await pool.query(
      'SELECT therapist_id FROM therapists WHERE user_id = ?',
      [req.user.user_id]
    );

    if (therapists.length === 0) {
      return res.status(404).json({ message: 'Therapist profile not found' });
    }

    req.therapistId = therapists[0].therapist_id;
    next();
  } catch (error) {
    console.error('Error getting therapist ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Middleware to get patient ID from user ID
const getPatientId = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied. Patient role required.' });
    }

    const [patients] = await pool.query(
      'SELECT patient_id FROM patients WHERE user_id = ?',
      [req.user.user_id]
    );

    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    req.patientId = patients[0].patient_id;
    next();
  } catch (error) {
    console.error('Error getting patient ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Appointment routes
// Get therapist's appointments
router.get('/api/therapist/appointments',
  authMiddleware(),
  isTherapist,
  getTherapistId,
  getTherapistAppointments
);

// Get patient's appointments
router.get('/api/patient/appointments',
  authMiddleware(),
  isPatient,
  getPatientId,
  getPatientAppointments
);

// Create a new appointment
router.post('/api/appointments',
  authMiddleware(),
  isPatient,
  getPatientId,
  createAppointment
);

// Update appointment status
router.patch('/api/appointments/:appointmentId/status',
  authMiddleware(),
  updateAppointmentStatus
);

// Reschedule appointment
router.patch('/api/appointments/:appointmentId/reschedule',
  authMiddleware(),
  rescheduleAppointment
);

// Get appointment by ID
router.get('/api/appointments/:appointmentId',
  authMiddleware(),
  getAppointmentById
);

// Availability routes
// Get therapist's availability - make this a public route with no middleware
router.get('/api/therapists/:therapistId/availability', (req, res) => {
  console.log('Availability route hit with therapistId:', req.params.therapistId);
  getTherapistAvailability(req, res);
});

// Add an alternative route for availability (without the /api prefix)
router.get('/therapists/:therapistId/availability', (req, res) => {
  console.log('Alternative availability route hit with therapistId:', req.params.therapistId);
  getTherapistAvailability(req, res);
});

// Add a public test endpoint for booking appointments (no authentication required)
router.post('/api/test/book-appointment', async (req, res) => {
  try {
    console.log('Test booking endpoint hit with data:', req.body);

    const {
      patientId,
      therapistId,
      scheduledTime,
      durationMinutes = 60,
      notes,
      therapyType
    } = req.body;

    // Validate required fields
    if (!patientId || !therapistId || !scheduledTime) {
      return res.status(400).json({
        message: 'Missing required fields',
        required: ['patientId', 'therapistId', 'scheduledTime'],
        received: req.body
      });
    }

    // First, let's check the structure of the appointments table
    const [columns] = await pool.query(`SHOW COLUMNS FROM appointments`);
    console.log('Appointments table columns:', columns.map(col => col.Field));

    // Find the status column to check its type and allowed values
    const statusColumn = columns.find(col => col.Field === 'status');
    console.log('Status column details:', statusColumn);

    // Determine valid status values
    let validStatus = 'pending';
    if (statusColumn && statusColumn.Type.startsWith('enum')) {
      // Extract allowed values from enum definition
      const enumValues = statusColumn.Type.match(/'([^']+)'/g).map(val => val.replace(/'/g, ''));
      console.log('Allowed status values:', enumValues);

      // Use 'pending' if it's allowed, otherwise use the first allowed value
      validStatus = enumValues.includes('pending') ? 'pending' : enumValues[0];
    }
    console.log('Using status value:', validStatus);

    // Check if appointment_type column exists
    const hasAppointmentType = columns.some(col => col.Field === 'appointment_type');

    // Format the date in MySQL-compatible format (YYYY-MM-DD HH:MM:SS)
    const appointmentDate = new Date(scheduledTime);
    const formattedDate = appointmentDate.toISOString().slice(0, 19).replace('T', ' ');
    console.log('Original date:', scheduledTime);
    console.log('Formatted date for MySQL:', formattedDate);

    // Create the appointment directly without availability checks
    let query, params;

    if (hasAppointmentType) {
      // If appointment_type column exists
      query = `
        INSERT INTO appointments (
          patient_id,
          therapist_id,
          scheduled_time,
          duration_minutes,
          status,
          notes,
          appointment_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      params = [
        patientId,
        therapistId,
        formattedDate,
        durationMinutes,
        validStatus,
        notes || null,
        therapyType || 'video'
      ];
    } else {
      // If appointment_type column doesn't exist
      query = `
        INSERT INTO appointments (
          patient_id,
          therapist_id,
          scheduled_time,
          duration_minutes,
          status,
          notes
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;
      params = [
        patientId,
        therapistId,
        formattedDate,
        durationMinutes,
        validStatus,
        notes || null
      ];
    }

    console.log('Executing query:', query);
    console.log('With parameters:', params);

    const [result] = await pool.query(query, params);

    res.status(201).json({
      message: 'Appointment created successfully',
      appointmentId: result.insertId
    });
  } catch (error) {
    console.error('Error creating test appointment:', error);
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
});

// Add availability slot
router.post('/api/therapist/availability',
  authMiddleware(),
  isTherapist,
  getTherapistId,
  addAvailability
);

// Update availability slot
router.put('/api/therapist/availability/:availabilityId',
  authMiddleware(),
  isTherapist,
  updateAvailability
);

// Delete availability slot
router.delete('/api/therapist/availability/:availabilityId',
  authMiddleware(),
  isTherapist,
  deleteAvailability
);

module.exports = router;
