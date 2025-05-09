// appointmentController.js
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
 * Get all appointments for a therapist
 */
exports.getTherapistAppointments = async (req, res) => {
  try {
    const therapistId = req.params.therapistId || req.therapistId;

    // Get appointments with patient information
    const [appointments] = await pool.query(`
      SELECT a.*,
             u.first_name, u.last_name, u.email, u.phone,
             p.patient_id
      FROM appointments a
      JOIN patients p ON a.patient_id = p.patient_id
      JOIN users u ON p.user_id = u.user_id
      WHERE a.therapist_id = ?
      ORDER BY a.scheduled_time DESC
    `, [therapistId]);

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching therapist appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

/**
 * Get all appointments for a patient
 */
exports.getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.params.patientId || req.patientId;

    // Get appointments with therapist information
    const [appointments] = await pool.query(`
      SELECT a.*,
             u.first_name, u.last_name, u.email, u.phone,
             t.specialization, t.hourly_rate
      FROM appointments a
      JOIN therapists t ON a.therapist_id = t.therapist_id
      JOIN users u ON t.user_id = u.user_id
      WHERE a.patient_id = ?
      ORDER BY a.scheduled_time DESC
    `, [patientId]);

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

/**
 * Create a new appointment
 */
exports.createAppointment = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      patientId,
      therapistId,
      scheduledTime,
      durationMinutes = 60,
      notes
    } = req.body;

    // Check if the therapist is available at the requested time
    const appointmentDate = new Date(scheduledTime);
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][appointmentDate.getDay()];
    const appointmentTime = appointmentDate.toTimeString().slice(0, 8); // HH:MM:SS format

    // Check therapist availability for the day and time
    const [availabilityResults] = await connection.query(`
      SELECT * FROM therapist_availability
      WHERE therapist_id = ?
      AND day_of_week = ?
      AND start_time <= ?
      AND end_time >= ?
    `, [
      therapistId,
      dayOfWeek,
      appointmentTime,
      appointmentTime
    ]);

    if (availabilityResults.length === 0) {
      return res.status(400).json({
        message: 'Therapist is not available at the requested time'
      });
    }

    // Check for existing appointments at the same time
    const appointmentEndTime = new Date(appointmentDate);
    appointmentEndTime.setMinutes(appointmentEndTime.getMinutes() + durationMinutes);

    const [existingAppointments] = await connection.query(`
      SELECT * FROM appointments
      WHERE therapist_id = ?
      AND scheduled_time < ?
      AND DATE_ADD(scheduled_time, INTERVAL duration_minutes MINUTE) > ?
      AND status NOT IN ('cancelled', 'no_show')
    `, [
      therapistId,
      appointmentEndTime.toISOString(),
      appointmentDate.toISOString()
    ]);

    if (existingAppointments.length > 0) {
      return res.status(400).json({
        message: 'Therapist already has an appointment at this time'
      });
    }

    // Create the appointment
    const [result] = await connection.query(`
      INSERT INTO appointments (
        patient_id,
        therapist_id,
        scheduled_time,
        duration_minutes,
        status,
        notes
      ) VALUES (?, ?, ?, ?, 'scheduled', ?)
    `, [
      patientId,
      therapistId,
      appointmentDate.toISOString(),
      durationMinutes,
      notes || null
    ]);

    await connection.commit();

    res.status(201).json({
      message: 'Appointment created successfully',
      appointmentId: result.insertId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  } finally {
    connection.release();
  }
};

/**
 * Update appointment status (approve, decline, cancel)
 */
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, cancellationReason } = req.body;

    // Validate status
    const validStatuses = ['scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Update the appointment
    const [result] = await pool.query(`
      UPDATE appointments
      SET status = ?,
          cancellation_reason = ?
      WHERE appointment_id = ?
    `, [status, cancellationReason || null, appointmentId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
};

/**
 * Reschedule an appointment
 */
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { scheduledTime, status } = req.body;

    console.log(`Rescheduling appointment ${appointmentId} to ${scheduledTime}`);

    // Format the date for MySQL
    const formattedDate = new Date(scheduledTime).toISOString().slice(0, 19).replace('T', ' ');

    // Update the appointment in the database
    const [result] = await pool.query(`
      UPDATE appointments
      SET scheduled_time = ?,
          status = ?
      WHERE appointment_id = ?
    `, [formattedDate, status || 'rescheduled', appointmentId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Get the updated appointment
    const [appointments] = await pool.query(`
      SELECT * FROM appointments WHERE appointment_id = ?
    `, [appointmentId]);

    if (appointments.length === 0) {
      return res.status(200).json({ message: 'Appointment rescheduled successfully' });
    }

    res.json(appointments[0]);
  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    res.status(500).json({ message: 'Error rescheduling appointment', error: error.message });
  }
};

/**
 * Get a single appointment by ID
 */
exports.getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const [appointments] = await pool.query(`
      SELECT a.*,
             p.patient_id,
             pt_user.first_name as patient_first_name,
             pt_user.last_name as patient_last_name,
             pt_user.email as patient_email,
             t.therapist_id,
             th_user.first_name as therapist_first_name,
             th_user.last_name as therapist_last_name,
             th_user.email as therapist_email,
             t.specialization
      FROM appointments a
      JOIN patients p ON a.patient_id = p.patient_id
      JOIN users pt_user ON p.user_id = pt_user.user_id
      JOIN therapists t ON a.therapist_id = t.therapist_id
      JOIN users th_user ON t.user_id = th_user.user_id
      WHERE a.appointment_id = ?
    `, [appointmentId]);

    if (appointments.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointments[0]);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Error fetching appointment', error: error.message });
  }
};
