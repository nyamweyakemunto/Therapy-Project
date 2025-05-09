// therapistController.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Therapist Controller
 *
 * This controller handles all therapist-related operations:
 * - Private profile management (for therapists to edit their own profiles)
 * - Public profile viewing (for patients to view therapist information)
 *
 * The data structure is carefully managed to ensure:
 * 1. Consistent JSON handling for complex fields (credentials, languages, etc.)
 * 2. Clear separation between public and private data
 * 3. Proper validation and error handling
 */

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

/**
 * Helper function to parse JSON fields safely
 * Used throughout the controller to handle JSON stored in the database
 */
const parseJsonField = (field) => {
  if (!field) return [];

  try {
    return typeof field === 'string' ? JSON.parse(field) : field;
  } catch (error) {
    console.error('Error parsing JSON field:', error);
    return [];
  }
};

/**
 * Get therapist's own profile (private)
 * Used by therapists to view and edit their own profile
 */
exports.getProfile = async (req, res) => {
  try {
    // Get therapist basic info
    const [therapists] = await pool.query(`
      SELECT t.*, u.first_name, u.last_name, u.email
      FROM therapists t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.user_id = ?
    `, [req.user.user_id]);

    if (therapists.length === 0) {
      return res.status(404).json({ message: 'Therapist profile not found' });
    }

    const therapist = therapists[0];

    // Get specializations
    const [specializations] = await pool.query(`
      SELECT specialization
      FROM therapist_specializations
      WHERE therapist_id = ?
    `, [therapist.therapist_id]);

    // Get availability
    const [availability] = await pool.query(`
      SELECT day_of_week, start_time, end_time
      FROM therapist_availability
      WHERE therapist_id = ? AND is_recurring = TRUE
    `, [therapist.therapist_id]);

    // Format the response
    const formattedResponse = {
      therapist_id: therapist.therapist_id,
      user_id: therapist.user_id,
      name: `${therapist.first_name} ${therapist.last_name}`,
      specialization: therapist.specialization || 'General Therapy',
      email: therapist.email,
      phone: therapist.phone || '',
      address: therapist.address || '',
      bio: therapist.bio || '',
      profile_picture_url: 'https://randomuser.me/api/portraits/men/32.jpg', // Default image
      qualifications: therapist.qualifications || '',
      languages: therapist.languages || 'English',
      availability: availability.map(a => ({
        day: a.day_of_week,
        startTime: a.start_time,
        endTime: a.end_time
      })),
      specializations: specializations.map(s => s.specialization),
      hourly_rate: therapist.hourly_rate,
      years_of_experience: therapist.years_of_experience,
      license_number: therapist.license_number,
      license_state: therapist.license_state,
      license_expiry: therapist.license_expiry
    };

    // Format fields for the frontend
    if (formattedResponse.qualifications) {
      formattedResponse.credentials = formattedResponse.qualifications.split(',').map(q => q.trim());
    } else {
      formattedResponse.credentials = [];
    }

    formattedResponse.treatment_methods = ['CBT', 'Mindfulness', 'Solution-Focused Therapy'];

    if (formattedResponse.languages) {
      formattedResponse.languages = formattedResponse.languages.split(',').map(l => l.trim());
    } else {
      formattedResponse.languages = ['English'];
    }

    res.json(formattedResponse);
  } catch (error) {
    console.error('Error fetching therapist profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

/**
 * Get therapist by user ID
 * Used to get therapist_id from user_id
 */
exports.getTherapistByUserId = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const [therapists] = await pool.query(
      'SELECT therapist_id FROM therapists WHERE user_id = ?',
      [userId]
    );

    if (therapists.length === 0) {
      return res.status(404).json({ message: 'Therapist not found' });
    }

    res.json(therapists[0]);
  } catch (error) {
    console.error('Error fetching therapist by user ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get public therapist profile (for patients)
 * Used by patients to view therapist information
 */
exports.getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Get therapist basic info with public fields only
    const [therapists] = await pool.query(`
      SELECT
        t.therapist_id,
        t.bio,
        t.years_of_experience,
        t.hourly_rate,
        t.qualifications,
        t.languages,
        t.rating,
        t.reviews_count,
        t.license_state,
        t.license_number,
        u.first_name,
        u.last_name,
        u.gender
      FROM therapists t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.therapist_id = ? AND u.is_active = TRUE AND t.is_verified = TRUE
    `, [id]);

    if (therapists.length === 0) {
      return res.status(404).json({ message: 'Therapist not found or not verified' });
    }

    const therapist = therapists[0];

    // Get specializations
    const [specializations] = await pool.query(`
      SELECT specialization
      FROM therapist_specializations
      WHERE therapist_id = ?
    `, [therapist.therapist_id]);

    // Get availability
    const [availability] = await pool.query(`
      SELECT day_of_week, start_time, end_time
      FROM therapist_availability
      WHERE therapist_id = ? AND is_recurring = TRUE
    `, [therapist.therapist_id]);

    // Format the public response (only include what patients should see)
    const publicProfile = {
      id: therapist.therapist_id,
      name: `Dr. ${therapist.first_name} ${therapist.last_name}`,
      gender: therapist.gender,
      bio: therapist.bio || '',
      profile_picture_url: 'https://randomuser.me/api/portraits/men/32.jpg', // Default image
      years_of_experience: therapist.years_of_experience || 0,
      hourly_rate: therapist.hourly_rate || 0,
      rating: therapist.rating || 0,
      reviews_count: therapist.reviews_count || 0,
      credentials: therapist.qualifications ? therapist.qualifications.split(',').map(q => q.trim()) : [],
      treatment_methods: ['CBT', 'Mindfulness', 'Solution-Focused Therapy'], // Default methods
      languages: therapist.languages ? therapist.languages.split(',').map(l => l.trim()) : ['English'],
      specializations: specializations.map(s => s.specialization),
      license_state: therapist.license_state || '',
      license_number: therapist.license_number || '',
      availability: availability.map(a => ({
        day: a.day_of_week,
        startTime: a.start_time,
        endTime: a.end_time
      }))
    };

    res.json(publicProfile);
  } catch (error) {
    console.error('Error fetching public therapist profile:', error);
    res.status(500).json({ message: 'Error fetching therapist profile', error: error.message });
  }
};

// Update therapist profile
exports.updateProfile = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      phone, address, bio,
      qualifications, languages,
      availability, specializations, hourly_rate,
      years_of_experience, license_number, license_state
    } = req.body;

    // Get therapist ID from user ID
    const [therapistResult] = await connection.query(
      'SELECT therapist_id FROM therapists WHERE user_id = ?',
      [req.user.user_id]
    );

    if (therapistResult.length === 0) {
      throw new Error('Therapist record not found');
    }

    const therapist_id = therapistResult[0].therapist_id;

    // Update therapist table
    await connection.query(`
      UPDATE therapists SET
        phone = ?,
        address = ?,
        bio = ?,
        qualifications = ?,
        languages = ?,
        hourly_rate = COALESCE(?, hourly_rate),
        years_of_experience = COALESCE(?, years_of_experience),
        license_number = COALESCE(?, license_number),
        license_state = COALESCE(?, license_state)
      WHERE user_id = ?
    `, [
      phone,
      address,
      bio,
      qualifications,
      languages,
      hourly_rate,
      years_of_experience,
      license_number,
      license_state,
      req.user.user_id
    ]);

    // Update specializations (many-to-many)
    if (specializations) {
      // Delete existing specializations
      await connection.query(
        'DELETE FROM therapist_specializations WHERE therapist_id = ?',
        [therapist_id]
      );

      // Insert new specializations if any
      if (specializations.length > 0) {
        const specializationValues = specializations.map(spec => [therapist_id, spec]);
        await connection.query(
          'INSERT INTO therapist_specializations (therapist_id, specialization) VALUES ?',
          [specializationValues]
        );
      }
    }

    // Update availability
    if (availability) {
      // Delete existing availability
      await connection.query(
        'DELETE FROM therapist_availability WHERE therapist_id = ?',
        [therapist_id]
      );

      // Insert new availability if any
      if (availability.length > 0) {
        const availabilityValues = availability.map(avail => [
          therapist_id,
          avail.day,
          avail.startTime,
          avail.endTime,
          true // is_recurring
        ]);

        await connection.query(
          'INSERT INTO therapist_availability (therapist_id, day_of_week, start_time, end_time, is_recurring) VALUES ?',
          [availabilityValues]
        );
      }
    }

    await connection.commit();

    // Get updated profile to return to client
    const [updatedTherapist] = await connection.query(`
      SELECT t.*, u.first_name, u.last_name, u.email
      FROM therapists t
      JOIN users u ON t.user_id = u.user_id
      WHERE t.user_id = ?
    `, [req.user.user_id]);

    res.json({
      message: 'Profile updated successfully',
      profile: updatedTherapist[0]
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating therapist profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  } finally {
    connection.release();
  }
};