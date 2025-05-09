// availabilityController.js
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
 * Get availability for a therapist (patient-facing)
 * This endpoint is used by patients to view a therapist's availability
 */
exports.getTherapistAvailability = async (req, res) => {
  try {
    console.log('getTherapistAvailability called with params:', req.params);
    const therapistId = req.params.therapistId;

    if (!therapistId) {
      console.error('No therapistId provided in request params');
      return res.status(400).json({ message: 'Therapist ID is required' });
    }

    console.log('Fetching availability for therapist ID:', therapistId);
    const [availability] = await pool.query(`
      SELECT * FROM therapist_availability
      WHERE therapist_id = ?
      ORDER BY FIELD(day_of_week, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
               start_time
    `, [therapistId]);

    console.log('Availability found:', availability.length, 'slots');
    res.json(availability);
  } catch (error) {
    console.error('Error fetching therapist availability:', error);
    res.status(500).json({ message: 'Error fetching availability', error: error.message });
  }
};

/**
 * Get availability for a therapist (therapist-facing management)
 * This endpoint is used by therapists to manage their availability
 */
exports.getTherapistAvailabilityForManagement = async (req, res) => {
  try {
    console.log('Therapist availability management route hit with therapistId:', req.params.therapistId);
    const therapistId = parseInt(req.params.therapistId);

    // Query the database for availability slots
    const [rows] = await pool.query(`
      SELECT * FROM therapist_availability
      WHERE therapist_id = ?
      ORDER BY day_of_week, start_time
    `, [therapistId]);

    console.log('Returning availability slots from database:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching availability slots:', error);
    res.status(500).json({ message: 'Error fetching availability slots', error: error.message });
  }
};

/**
 * Add new availability slot for a therapist
 */
exports.addAvailability = async (req, res) => {
  try {
    console.log('Add therapist availability route hit with data:', req.body);

    // Validate required fields
    const { dayOfWeek, startTime, endTime, therapistId } = req.body;

    if (!dayOfWeek || !startTime || !endTime || !therapistId) {
      return res.status(400).json({
        message: 'Day of week, start time, end time, and therapist ID are required'
      });
    }

    // Validate day of week
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (!validDays.includes(dayOfWeek.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid day of week' });
    }

    // Validate time format (HH:MM:SS or HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({ message: 'Invalid time format. Use HH:MM:SS or HH:MM' });
    }

    // Ensure start time is before end time
    if (startTime >= endTime) {
      return res.status(400).json({ message: 'Start time must be before end time' });
    }

    // Check for overlapping slots in the database
    const [existingSlots] = await pool.query(`
      SELECT * FROM therapist_availability
      WHERE therapist_id = ? AND day_of_week = ?
    `, [therapistId, dayOfWeek.toLowerCase()]);

    // Helper function to check if two time ranges overlap
    const isOverlapping = (start1, end1, start2, end2) => {
      // Convert times to minutes for easier comparison
      const toMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };

      const s1 = toMinutes(start1);
      const e1 = toMinutes(end1);
      const s2 = toMinutes(start2);
      const e2 = toMinutes(end2);

      // Check for overlap: one range starts before the other ends
      return (s1 < e2 && s2 < e1);
    };

    // Check for overlaps with existing slots
    for (const slot of existingSlots) {
      const slotStartTime = slot.start_time.substring(0, 5);
      const slotEndTime = slot.end_time.substring(0, 5);

      if (isOverlapping(startTime, endTime, slotStartTime, slotEndTime)) {
        console.log(`Overlap detected: New slot ${startTime}-${endTime} overlaps with existing ${slotStartTime}-${slotEndTime}`);

        return res.status(400).json({
          message: 'This availability slot overlaps with an existing slot',
          conflictingSlot: {
            availability_id: slot.availability_id,
            therapist_id: slot.therapist_id,
            day_of_week: slot.day_of_week,
            start_time: slot.start_time,
            end_time: slot.end_time,
            is_recurring: slot.is_recurring
          }
        });
      }
    }

    // If no overlap, add the new slot to the database
    const [result] = await pool.query(`
      INSERT INTO therapist_availability (
        therapist_id,
        day_of_week,
        start_time,
        end_time,
        is_recurring
      ) VALUES (?, ?, ?, ?, ?)
    `, [
      therapistId,
      dayOfWeek.toLowerCase(),
      `${startTime}:00`,
      `${endTime}:00`,
      req.body.isRecurring ? 1 : 0
    ]);

    console.log('Added new availability slot to database with ID:', result.insertId);

    // Return a successful response with the new ID
    res.status(201).json({
      message: 'Availability added successfully',
      availabilityId: result.insertId
    });
  } catch (error) {
    console.error('Error adding availability slot:', error);
    res.status(500).json({
      message: 'Error adding availability slot',
      error: error.message
    });
  }
};

/**
 * Update an existing availability slot
 */
exports.updateAvailability = async (req, res) => {
  try {
    console.log('Update therapist availability route hit with ID:', req.params.availabilityId, 'and data:', req.body);

    // Validate required fields
    const { dayOfWeek, startTime, endTime } = req.body;
    const availabilityId = parseInt(req.params.availabilityId);

    if (!dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({
        message: 'Day of week, start time, and end time are required'
      });
    }

    // First, get the current slot to get the therapist_id
    const [currentSlot] = await pool.query(`
      SELECT * FROM therapist_availability WHERE availability_id = ?
    `, [availabilityId]);

    if (currentSlot.length === 0) {
      return res.status(404).json({
        message: 'Availability slot not found'
      });
    }

    const therapistId = currentSlot[0].therapist_id;

    // Check for overlapping slots in the database (excluding the current slot)
    const [existingSlots] = await pool.query(`
      SELECT * FROM therapist_availability
      WHERE therapist_id = ? AND day_of_week = ? AND availability_id != ?
    `, [therapistId, dayOfWeek.toLowerCase(), availabilityId]);

    // Helper function to check if two time ranges overlap
    const isOverlapping = (start1, end1, start2, end2) => {
      // Convert times to minutes for easier comparison
      const toMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };

      const s1 = toMinutes(start1);
      const e1 = toMinutes(end1);
      const s2 = toMinutes(start2);
      const e2 = toMinutes(end2);

      // Check for overlap: one range starts before the other ends
      return (s1 < e2 && s2 < e1);
    };

    // Check for overlaps with existing slots
    for (const slot of existingSlots) {
      const slotStartTime = slot.start_time.substring(0, 5);
      const slotEndTime = slot.end_time.substring(0, 5);

      if (isOverlapping(startTime, endTime, slotStartTime, slotEndTime)) {
        console.log(`Overlap detected: Updated slot ${startTime}-${endTime} overlaps with existing ${slotStartTime}-${slotEndTime}`);

        return res.status(400).json({
          message: 'This availability slot overlaps with an existing slot',
          conflictingSlot: {
            availability_id: slot.availability_id,
            therapist_id: slot.therapist_id,
            day_of_week: slot.day_of_week,
            start_time: slot.start_time,
            end_time: slot.end_time,
            is_recurring: slot.is_recurring
          }
        });
      }
    }

    // If no overlap, update the slot in the database
    const [result] = await pool.query(`
      UPDATE therapist_availability
      SET day_of_week = ?, start_time = ?, end_time = ?, is_recurring = ?
      WHERE availability_id = ?
    `, [
      dayOfWeek.toLowerCase(),
      `${startTime}:00`,
      `${endTime}:00`,
      req.body.isRecurring ? 1 : currentSlot[0].is_recurring,
      availabilityId
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Availability slot not found or not updated'
      });
    }

    console.log('Updated availability slot in database with ID:', availabilityId);

    // Return a successful response
    res.json({
      message: 'Availability updated successfully',
      availabilityId: availabilityId
    });
  } catch (error) {
    console.error('Error updating availability slot:', error);
    res.status(500).json({
      message: 'Error updating availability slot',
      error: error.message
    });
  }
};

/**
 * Delete an availability slot
 */
exports.deleteAvailability = async (req, res) => {
  try {
    console.log('Delete therapist availability route hit with ID:', req.params.availabilityId);
    const availabilityId = parseInt(req.params.availabilityId);

    // Delete the slot from the database
    const [result] = await pool.query(`
      DELETE FROM therapist_availability
      WHERE availability_id = ?
    `, [availabilityId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Availability slot not found'
      });
    }

    console.log('Deleted availability slot from database with ID:', availabilityId);

    // Return a successful response
    res.json({
      message: 'Availability deleted successfully',
      availabilityId: availabilityId
    });
  } catch (error) {
    console.error('Error deleting availability slot:', error);
    res.status(500).json({
      message: 'Error deleting availability slot',
      error: error.message
    });
  }
};
