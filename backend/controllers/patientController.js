const dotenv = require('dotenv');
dotenv.config();
const mysql = require('mysql2/promise');


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


exports.getTherapists = async (req, res) => {
    try {
      const [therapists] = await pool.query(`
        SELECT t.*, u.first_name, u.last_name, u.profile_picture
        FROM therapists t
        JOIN users u ON t.user_id = u.user_id
        WHERE u.is_active = TRUE AND t.is_verified = TRUE;
      `);
  
      // Get specializations for each therapist
      for (const therapist of therapists) {
        const [specializations] = await pool.query(`
          SELECT specialization 
          FROM therapist_specializations 
          WHERE therapist_id = ?
        `, [therapist.therapist_id]);
        
        therapist.specializations = specializations.map(s => s.specialization);
      }
  
      // Get availability for each therapist
      for (const therapist of therapists) {
        const [availability] = await pool.query(`
          SELECT DAYNAME(DATE_ADD('2023-01-02', INTERVAL day_of_week-2 DAY)) as day_name, 
                 start_time, end_time 
          FROM therapist_availability 
          WHERE therapist_id = ? AND is_recurring = TRUE
        `, [therapist.therapist_id]);
        
        therapist.availability = availability;
      }
  
      res.json(therapists);
    } catch (error) {
      console.error('Error fetching therapists:', error);
      res.status(500).json({ error: 'Failed to fetch therapists' });
    }
  }

exports.getTherapistById = async (req, res) => {
    try {
      const { id } = req.params;
      
      const [therapists] = await pool.query(`
        SELECT 
          t.*, 
          u.first_name, 
          u.last_name, 
          u.profile_picture_url, 
          u.gender,
          (
            SELECT JSON_ARRAYAGG(specialization)
            FROM therapist_specializations ts
            WHERE ts.therapist_id = t.therapist_id
          ) AS specializations
        FROM therapists t
        JOIN users u ON t.user_id = u.user_id
        WHERE t.therapist_id = ? AND u.is_active = TRUE AND t.is_verified = TRUE
      `, [id]);
  
      if (therapists.length === 0) {
        return res.status(404).json({ error: 'Therapist not found' });
      }
  
      const therapist = therapists[0];
      
      // Handle languages - check if it's already parsed or needs parsing
      if (typeof therapist.languages === 'string') {
        try {
          therapist.languages = JSON.parse(therapist.languages);
        } catch (e) {
          // If parsing fails, check if it's a string representation
          if (therapist.languages.startsWith('[') && therapist.languages.endsWith(']')) {
            therapist.languages = JSON.parse(therapist.languages);
          } else {
            // Handle as comma-separated string if needed
            therapist.languages = therapist.languages.split(',').map(lang => lang.trim());
          }
        }
      } else if (Array.isArray(therapist.languages)) {
        // Already in array format
      } else {
        therapist.languages = ['English']; // Default
      }
  
      // Handle specializations
      if (therapist.specializations && typeof therapist.specializations === 'string') {
        try {
          therapist.specializations = JSON.parse(therapist.specializations);
        } catch (e) {
          therapist.specializations = [];
        }
      } else if (!Array.isArray(therapist.specializations)) {
        therapist.specializations = [];
      }
  
      // Get availability
      const [availability] = await pool.query(`
        SELECT DAYNAME(DATE_ADD('2023-01-02', INTERVAL day_of_week-2 DAY)) as day_name, 
               start_time, end_time 
        FROM therapist_availability 
        WHERE therapist_id = ? AND is_recurring = TRUE
      `, [id]);
      therapist.availability = availability;
  
      res.json(therapist);
    } catch (error) {
      console.error('Error fetching therapist:', error);
      res.status(500).json({ error: 'Failed to fetch therapist' });
    }
  };
  
exports.therapistAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query;
        
        console.log('Received request with params:', req.params, 'query:', req.query); // Debug log
        
        if (!date) {
            return res.status(400).json({ 
                error: 'Date parameter is required',
                message: 'Please provide a date in the query parameters (e.g., /therapists/1/availability?date=2023-12-31)'
            });
        }

        // Validate date format (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ 
                error: 'Invalid date format',
                message: 'Date must be in YYYY-MM-DD format'
            });
        }

        // Check therapist's recurring availability
        const [availability] = await pool.query(`
            SELECT start_time, end_time 
            FROM therapist_availability 
            WHERE therapist_id = ? AND is_recurring = TRUE
            AND day_of_week = DAYOFWEEK(?)
        `, [id, date]);

        if (availability.length === 0) {
            return res.json([]);
        }

        // Check already booked appointments
        const [bookings] = await pool.query(`
            SELECT TIME(scheduled_time) as time 
            FROM appointments 
            WHERE therapist_id = ? 
            AND DATE(scheduled_time) = ?
            AND status IN ('scheduled', 'rescheduled')
        `, [id, date]);

        const bookedTimes = bookings.map(b => b.time.substring(0, 5)); // Format as HH:MM

        // Generate available slots (every 60 minutes)
        const availableSlots = [];
        const { start_time, end_time } = availability[0];
        
        let current = new Date(`${date}T${start_time}`);
        const end = new Date(`${date}T${end_time}`);

        while (current < end) {
            const timeStr = current.toTimeString().substring(0, 5);
            if (!bookedTimes.includes(timeStr)) {
                availableSlots.push(timeStr);
            }
            current.setHours(current.getHours() + 1);
        }

        res.json({
            therapist_id: id,
            date: date,
            available_slots: availableSlots,
            booked_slots: bookedTimes
        });
    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({ 
            error: 'Failed to fetch availability',
            details: error.message
        });
    }
};

exports.appointments = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        const { patient_id, therapist_id, date, time, duration_minutes, notes, therapy_type } = req.body;

        // 1. Validate patient exists and has patient role
        const [patient] = await connection.query(`
            SELECT u.user_id 
            FROM patients p
            JOIN users u ON p.user_id = u.user_id
            WHERE p.patient_id = ? AND u.role = 'patient'
        `, [patient_id]);
        
        if (patient.length === 0) {
            throw { status: 400, message: 'Invalid patient ID or role' };
        }

        // 2. Validate therapist exists and has therapist role
        const [therapist] = await connection.query(`
            SELECT u.user_id 
            FROM therapists t
            JOIN users u ON t.user_id = u.user_id
            WHERE t.therapist_id = ? AND u.role = 'therapist'
        `, [therapist_id]);
        
        if (therapist.length === 0) {
            throw { status: 400, message: 'Invalid therapist ID or role' };
        }

        // 3. Continue with booking logic...
        const scheduled_time = `${date} ${time}:00`;
        
        const [result] = await connection.query(`
            INSERT INTO appointments 
            (patient_id, therapist_id, scheduled_time, duration_minutes, status, notes, therapy_type)
            VALUES (?, ?, ?, ?, 'scheduled', ?, ?)
        `, [patient_id, therapist_id, scheduled_time, duration_minutes || 60, notes, therapy_type]);

        await connection.commit();
        
        res.status(201).json({
            appointment_id: result.insertId,
            message: 'Appointment booked successfully'
        });

    } catch (error) {
        await connection.rollback();
        res.status(error.status || 500).json({
            error: error.message || 'Booking failed',
            details: error.status === 500 ? error.message : undefined
        });
    } finally {
        connection.release();
    }
};