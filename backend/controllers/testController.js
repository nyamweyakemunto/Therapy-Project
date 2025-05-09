// testController.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

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

/**
 * Simple test endpoint to verify the API is working
 */
exports.testApi = (req, res) => {
  res.json({ message: 'API is working' });
};

/**
 * Test endpoint for therapist availability
 */
exports.testTherapistAvailability = (req, res) => {
  console.log('Test availability route hit with therapistId:', req.params.therapistId);
  res.json([
    {
      availability_id: 1,
      therapist_id: parseInt(req.params.therapistId),
      day_of_week: 'monday',
      start_time: '09:00:00',
      end_time: '17:00:00',
      is_recurring: 1
    },
    {
      availability_id: 2,
      therapist_id: parseInt(req.params.therapistId),
      day_of_week: 'wednesday',
      start_time: '10:00:00',
      end_time: '18:00:00',
      is_recurring: 1
    },
    {
      availability_id: 3,
      therapist_id: parseInt(req.params.therapistId),
      day_of_week: 'friday',
      start_time: '08:00:00',
      end_time: '16:00:00',
      is_recurring: 1
    }
  ]);
};

/**
 * Test endpoint for booking appointments
 */
exports.testBookAppointment = (req, res) => {
  console.log('Test appointment booking route hit with data:', req.body);

  // Validate required fields
  const { patientId, therapistId, scheduledTime } = req.body;

  if (!patientId || !therapistId || !scheduledTime) {
    return res.status(400).json({
      message: 'Missing required fields',
      required: ['patientId', 'therapistId', 'scheduledTime'],
      received: req.body
    });
  }

  // Return a successful response
  res.status(201).json({
    message: 'Appointment booked successfully',
    appointment: {
      id: Math.floor(Math.random() * 1000) + 1,
      patient_id: patientId,
      therapist_id: therapistId,
      scheduled_time: scheduledTime,
      status: 'pending',
      created_at: new Date().toISOString()
    }
  });
};
