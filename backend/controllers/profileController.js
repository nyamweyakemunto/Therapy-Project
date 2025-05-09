// profileController.js
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
 * Get therapist profile (for therapist's own view)
 */
exports.getTherapistProfile = async (req, res) => {
  try {
    console.log('Therapist profile route hit');
    
    // In a real implementation, we would get the therapist ID from the authenticated user
    // For now, we'll return a mock profile
    res.json({
      therapist_id: 2, // Using therapist ID 2 to match the one in your frontend
      user_id: 6,
      name: "Kevin Murithi",
      specialization: "General Therapy",
      email: "murithikevin59@gmail.com",
      phone: "555-987-6543",
      years_of_experience: 5,
      hourly_rate: 100,
      bio: "Experienced therapist specializing in general therapy."
    });
  } catch (error) {
    console.error('Error fetching therapist profile:', error);
    res.status(500).json({ message: 'Error fetching therapist profile', error: error.message });
  }
};

/**
 * Get patient profile (for patient's own view)
 */
exports.getPatientProfile = async (req, res) => {
  try {
    console.log('Patient profile route hit');
    
    // In a real implementation, we would get the patient ID from the authenticated user
    // For now, we'll return a mock profile
    res.json({
      patient_id: 1,
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
      phone: "555-123-4567",
      date_of_birth: "1990-01-15",
      gender: "female",
      address: "123 Main St, Anytown, USA",
      insurance_provider: "Blue Cross",
      insurance_id: "BC123456789",
      emergency_contact_name: "John Smith",
      emergency_contact_phone: "555-987-6543"
    });
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    res.status(500).json({ message: 'Error fetching patient profile', error: error.message });
  }
};

/**
 * Get therapist profile by ID (for test purposes)
 */
exports.getTherapistProfileById = async (req, res) => {
  try {
    console.log('Test profile route hit with therapistId:', req.params.therapistId);
    res.json({
      id: parseInt(req.params.therapistId),
      name: "Dr. John Doe",
      first_name: "John",
      last_name: "Doe",
      gender: "male",
      bio: "Experienced therapist specializing in anxiety and depression.",
      years_of_experience: 5,
      hourly_rate: 100,
      rating: 4.8,
      reviews_count: 24,
      specialization: "Cognitive Behavioral Therapy",
      profile_picture_url: "https://randomuser.me/api/portraits/men/32.jpg",
      credentials: ["PhD in Clinical Psychology", "Licensed in California"],
      treatment_methods: ["CBT", "Mindfulness", "Solution-Focused Therapy"],
      languages: ["English", "Spanish"],
      specializations: ["anxiety", "depression", "stress"]
    });
  } catch (error) {
    console.error('Error fetching test therapist profile:', error);
    res.status(500).json({ message: 'Error fetching test therapist profile', error: error.message });
  }
};
