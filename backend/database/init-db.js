// Database initialization script
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

async function initializeDatabase() {
  console.log('Initializing database...');

  // Create connection to MySQL server (without database)
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '0712400421',
  });

  try {
    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'therapy_platform';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Database '${dbName}' created or already exists.`);

    // Use the database
    await connection.query(`USE ${dbName}`);

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split the SQL file into individual statements
    const statements = schemaSql
      .split(';')
      .filter(statement => statement.trim() !== '');

    // Execute each statement
    for (const statement of statements) {
      try {
        await connection.query(statement);
      } catch (error) {
        // Ignore duplicate index errors
        if (error.code === 'ER_DUP_KEYNAME') {
          console.log(`Index already exists: ${error.sqlMessage}`);
        } else {
          throw error;
        }
      }
    }

    console.log('Database schema created successfully.');

    // Check if we need to add sample data
    if (process.argv.includes('--with-sample-data')) {
      // Add sample data here if needed
      console.log('Adding sample data...');

      // Sample users
      await connection.query(`
        INSERT IGNORE INTO users (email, password_hash, first_name, last_name, role, gender)
        VALUES
        ('therapist@example.com', '$2b$10$X/hX1PxoOUbmRlADPzw4UOHgYOMRYJqR.NZA.Tz.uDe5JF9jSEgXi', 'John', 'Therapist', 'therapist', 'male'),
        ('patient@example.com', '$2b$10$X/hX1PxoOUbmRlADPzw4UOHgYOMRYJqR.NZA.Tz.uDe5JF9jSEgXi', 'Jane', 'Patient', 'patient', 'female')
      `);

      // Get user IDs
      const [users] = await connection.query(`
        SELECT user_id, role FROM users WHERE email IN ('therapist@example.com', 'patient@example.com')
      `);

      const therapistUserId = users.find(u => u.role === 'therapist')?.user_id;
      const patientUserId = users.find(u => u.role === 'patient')?.user_id;

      if (therapistUserId) {
        // Add therapist profile
        await connection.query(`
          INSERT IGNORE INTO therapists (
            user_id, specialization, bio, hourly_rate, years_of_experience,
            qualifications, languages, is_verified
          )
          VALUES (
            ?, 'Cognitive Behavioral Therapy', 'Experienced therapist specializing in anxiety and depression.',
            100, 5, 'PhD in Psychology, Licensed in California',
            'English, Spanish', true
          )
        `, [therapistUserId]);

        // Get therapist ID
        const [therapistResult] = await connection.query(
          'SELECT therapist_id FROM therapists WHERE user_id = ?',
          [therapistUserId]
        );

        if (therapistResult.length > 0) {
          const therapistId = therapistResult[0].therapist_id;

          // Add therapist specializations
          await connection.query(`
            INSERT IGNORE INTO therapist_specializations (therapist_id, specialization)
            VALUES
            (?, 'anxiety'),
            (?, 'depression'),
            (?, 'stress')
          `, [therapistId, therapistId, therapistId]);

          // Add therapist availability
          await connection.query(`
            INSERT IGNORE INTO therapist_availability (
              therapist_id, day_of_week, start_time, end_time, is_recurring
            )
            VALUES
            (?, 'monday', '09:00:00', '17:00:00', true),
            (?, 'wednesday', '09:00:00', '17:00:00', true),
            (?, 'friday', '09:00:00', '17:00:00', true)
          `, [therapistId, therapistId, therapistId]);
        }
      }

      if (patientUserId) {
        // Add patient profile
        await connection.query(`
          INSERT IGNORE INTO patients (
            user_id, emergency_contact_name, emergency_contact_phone
          )
          VALUES (?, 'Emergency Contact', '555-123-4567')
        `, [patientUserId]);
      }

      // Add appointments if both exist
      if (therapistUserId && patientUserId) {
        // Get IDs
        const [therapistResult] = await connection.query(
          'SELECT therapist_id FROM therapists WHERE user_id = ?',
          [therapistUserId]
        );

        const [patientResult] = await connection.query(
          'SELECT patient_id FROM patients WHERE user_id = ?',
          [patientUserId]
        );

        if (therapistResult.length > 0 && patientResult.length > 0) {
          const therapistId = therapistResult[0].therapist_id;
          const patientId = patientResult[0].patient_id;

          // Add a future appointment
          const futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + 7);

          await connection.query(`
            INSERT IGNORE INTO appointments (
              patient_id, therapist_id, scheduled_time, duration_minutes, status, notes
            )
            VALUES (?, ?, ?, 60, 'scheduled', 'Initial consultation')
          `, [patientId, therapistId, futureDate.toISOString().slice(0, 19).replace('T', ' ')]);

          // Add a past appointment
          const pastDate = new Date();
          pastDate.setDate(pastDate.getDate() - 7);

          await connection.query(`
            INSERT IGNORE INTO appointments (
              patient_id, therapist_id, scheduled_time, duration_minutes, status, notes
            )
            VALUES (?, ?, ?, 60, 'completed', 'Follow-up session')
          `, [patientId, therapistId, pastDate.toISOString().slice(0, 19).replace('T', ' ')]);
        }
      }

      console.log('Sample data added successfully.');
    }

    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await connection.end();
  }
}

// Run the initialization
initializeDatabase().catch(console.error);
