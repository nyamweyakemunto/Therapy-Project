-- Create the database
CREATE DATABASE IF NOT EXISTS therapy_platform;
USE therapy_platform;

-- Enable strict mode for better data integrity
SET sql_mode = 'STRICT_TRANS_TABLES';

-- 1. users table (Base user table for all platform users)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('patient', 'therapist', 'admin') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_picture VARCHAR(255),
    date_of_birth DATE,
    approved BOOLEAN DEFAULT FALSE,
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
);

 alter table users add column profile_picture_url varchar(255);
-- 2. patients table (Patient-specific information) - MODIFIED
CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    insurance_provider VARCHAR(100),
    insurance_policy_number VARCHAR(100),
    mental_health_history TEXT,
    current_medications TEXT,
    pregnancy_due_date DATE,
    delivery_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_patients_user (user_id)
);

-- 3. therapists table (Therapist-specific information) - MODIFIED
CREATE TABLE therapists (
    therapist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    qualifications TEXT NOT NULL,
    languages VARCHAR(255) DEFAULT 'English',
    rating DECIMAL(2,1) DEFAULT 0.0,
    reviews_count INT DEFAULT 0,
    license_number VARCHAR(100) NOT NULL,
    license_state VARCHAR(100),
    license_expiry DATE,
    years_of_experience INT,
    hourly_rate DECIMAL(10,2) NOT NULL,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_documents TEXT,
    verification_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_therapists_user (user_id)
);

-- Add columns to therapists table to accommodate all profile data
ALTER TABLE therapists
ADD COLUMN phone VARCHAR(20),
ADD COLUMN address TEXT,
ADD COLUMN profile_picture_url VARCHAR(255),
ADD COLUMN treatment_methods TEXT COMMENT 'JSON array of treatment methods',
ADD COLUMN credentials TEXT COMMENT 'JSON array of qualifications/credentials',
ADD COLUMN languages TEXT COMMENT 'JSON array of languages with proficiency';

-- Triggers to automatically create patient/therapist records
DELIMITER //

CREATE TRIGGER after_user_insert_patient
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.role = 'patient' THEN
        INSERT INTO patients (user_id)
        VALUES (NEW.user_id);
    END IF;
END//

CREATE TRIGGER after_user_insert_therapist
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.role = 'therapist' THEN
        INSERT INTO therapists (user_id, specialization, qualifications, license_number, hourly_rate)
        VALUES (NEW.user_id, 'General Therapy', 'Pending qualifications', 'TEMP-LICENSE', 0.00);
    END IF;
END//

CREATE TRIGGER before_user_update_role
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    -- Prevent role changes if corresponding records exist
    IF NEW.role <> OLD.role THEN
        IF OLD.role = 'patient' AND EXISTS (SELECT 1 FROM patients WHERE user_id = OLD.user_id) THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Cannot change role from patient - patient record exists';
        ELSEIF OLD.role = 'therapist' AND EXISTS (SELECT 1 FROM therapists WHERE user_id = OLD.user_id) THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Cannot change role from therapist - therapist record exists';
        END IF;
    END IF;
END//

DELIMITER ;

-- 4. therapist_specializations table (Many-to-many for therapist specialties)
CREATE TABLE therapist_specializations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    therapist_id INT NOT NULL,
    specialization ENUM('postpartum_depression','pregnancy_anxiety','birth_trauma''infertility','parenting_support','general_counseling') NOT NULL,
    FOREIGN KEY (therapist_id) REFERENCES therapists(therapist_id) ON DELETE CASCADE,
    INDEX idx_therapist_spec (therapist_id, specialization)
); 

-- 5. therapist_availability table (When therapists are available)
CREATE TABLE therapist_availability (
    availability_id INT AUTO_INCREMENT PRIMARY KEY,
    therapist_id INT NOT NULL,
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_recurring BOOLEAN DEFAULT TRUE,
    valid_from DATE,
    valid_until DATE,
    FOREIGN KEY (therapist_id) REFERENCES therapists(therapist_id) ON DELETE CASCADE,
    INDEX idx_availability_therapist (therapist_id),
    INDEX idx_availability_day (day_of_week)
); 

-- 6. appointments table (Scheduled sessions)
CREATE TABLE appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    therapist_id INT NOT NULL,
    scheduled_time TIMESTAMP NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 60,
    status ENUM('scheduled', 'completed', 'cancelled', 'no_show', 'rescheduled') NOT NULL DEFAULT 'scheduled',
    meeting_link VARCHAR(255),
    notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (therapist_id) REFERENCES therapists(therapist_id),
    INDEX idx_appointments_patient (patient_id),
    INDEX idx_appointments_therapist (therapist_id),
    INDEX idx_appointments_status (status),
    INDEX idx_appointments_time (scheduled_time)
); 

-- 7. payments table (Financial transactions)
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT,
    patient_id INT NOT NULL,
    therapist_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('credit_card', 'debit_card', 'paypal', 'insurance', 'voucher') NOT NULL,
    transaction_id VARCHAR(255),
    status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    invoice_number VARCHAR(100),
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (therapist_id) REFERENCES therapists(therapist_id),
    INDEX idx_payments_appointment (appointment_id),
    INDEX idx_payments_status (status)
);

-- 8. reviews table (Patient feedback)
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT NOT NULL,
    patient_id INT NOT NULL,
    therapist_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_anonymous BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (therapist_id) REFERENCES therapists(therapist_id),
    INDEX idx_reviews_therapist (therapist_id),
    INDEX idx_reviews_patient (patient_id)
); 

-- 9. messages table (In-app communication)
CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    appointment_id INT,
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES users(user_id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
    INDEX idx_messages_sender (sender_id),
    INDEX idx_messages_receiver (receiver_id),
    INDEX idx_messages_appointment (appointment_id)
); 

-- 10. patient_progress table (Tracking patient mental health)
CREATE TABLE patient_progress (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    therapist_id INT NOT NULL,
    mood_rating TINYINT CHECK (mood_rating BETWEEN 1 AND 10),
    anxiety_level TINYINT CHECK (anxiety_level BETWEEN 1 AND 10),
    sleep_quality TINYINT CHECK (sleep_quality BETWEEN 1 AND 10),
    notes TEXT,
    recorded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (therapist_id) REFERENCES therapists(therapist_id),
    INDEX idx_progress_patient (patient_id),
    INDEX idx_progress_date (recorded_date)
); 

-- 11. educational_resources table (Content library)
CREATE TABLE educational_resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content_type ENUM('article', 'video', 'podcast', 'infographic') NOT NULL,
    content_url VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM(
        'prenatal_care',
        'postpartum_care',
        'mental_health',
        'parenting',
        'relationships',
        'self_care'
    ) NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_featured BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (created_by) REFERENCES users(user_id),
    INDEX idx_resources_category (category),
    INDEX idx_resources_featured (is_featured)
); 

-- 12. patient_resource_access table (Track resource access)
CREATE TABLE patient_resource_access (
    access_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    resource_id INT NOT NULL,
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_spent_seconds INT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (resource_id) REFERENCES educational_resources(resource_id),
    INDEX idx_access_patient (patient_id),
    INDEX idx_access_resource (resource_id)
);

-- 13. emergency_resources table (Crisis support information)
CREATE TABLE emergency_resources (
    resource_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    website VARCHAR(255),
    description TEXT,
    available_hours TEXT,
    languages_supported VARCHAR(255),
    is_international BOOLEAN DEFAULT FALSE,
    category ENUM('suicide_prevention', 'domestic_violence', 'medical_emergency', 'general_crisis'),
    INDEX idx_emergency_category (category)
);

-- 14. therapist_verification_logs table (Audit trail)
CREATE TABLE therapist_verification_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    therapist_id INT NOT NULL,
    admin_id INT NOT NULL,
    action ENUM('verify', 'unverify', 'request_info') NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (therapist_id) REFERENCES therapists(therapist_id),
    FOREIGN KEY (admin_id) REFERENCES users(user_id),
    INDEX idx_verification_therapist (therapist_id),
    INDEX idx_verification_admin (admin_id)
); 

-- 15. system_settings table (Platform configuration)
CREATE TABLE system_settings (
    setting_id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    FOREIGN KEY (updated_by) REFERENCES users(user_id),
    INDEX idx_settings_key (setting_key)
);




ALTER TABLE appointments DROP COLUMN scheduled_time;
ALTER TABLE appointments ADD COLUMN scheduled_time DATETIME;

