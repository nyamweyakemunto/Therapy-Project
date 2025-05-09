// Simple script to test the availability endpoint
const express = require('express');
const app = express();
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

// Availability endpoint
app.get('/api/therapists/:therapistId/availability', async (req, res) => {
  try {
    console.log('Availability endpoint called with therapistId:', req.params.therapistId);
    const therapistId = req.params.therapistId;
    
    // Query the database
    const [availability] = await pool.query(`
      SELECT * FROM therapist_availability
      WHERE therapist_id = ?
      ORDER BY FIELD(day_of_week, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
               start_time
    `, [therapistId]);
    
    console.log('Found availability:', availability);
    res.json(availability);
  } catch (error) {
    console.error('Error fetching therapist availability:', error);
    res.status(500).json({ message: 'Error fetching availability', error: error.message });
  }
});

// Fallback endpoint with static data
app.get('/api/test/availability/:therapistId', (req, res) => {
  console.log('Test availability endpoint called with therapistId:', req.params.therapistId);
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
});

// Start the server
const port = 3600;
app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
  console.log(`Try accessing: http://localhost:${port}/api/therapists/1/availability`);
  console.log(`Or fallback: http://localhost:${port}/api/test/availability/1`);
});
