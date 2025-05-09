# Therapy Platform

A comprehensive platform for therapists and patients to connect, schedule appointments, and manage therapy sessions.

## Features

- User authentication for therapists and patients
- Therapist profile management
- Patient profile management
- Appointment scheduling and management
- Therapist availability management
- Secure messaging between therapists and patients
- Session notes and progress tracking

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd therapy-platform
   ```

2. Install dependencies:
   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=therapy_platform
   JWT_SECRET=your_jwt_secret
   PORT=3500
   ```

4. Initialize the database:
   ```
   cd backend
   node database/init-db.js
   ```
   
   To add sample data, run:
   ```
   node database/init-db.js --with-sample-data
   ```

5. Start the development servers:
   ```
   # Start backend server
   cd backend
   npm start

   # In a separate terminal, start frontend server
   cd frontend
   npm start
   ```

6. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3500

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Therapist
- `GET /api/therapist/profile` - Get therapist's own profile
- `PUT /api/therapist/profile` - Update therapist's profile
- `GET /api/therapists` - Get therapist by user ID
- `GET /api/therapists/:id/profile` - Get public therapist profile

### Patient
- `GET /api/patient/profile` - Get patient's own profile
- `PUT /api/patient/profile` - Update patient's profile

### Appointments
- `GET /api/therapist/appointments` - Get therapist's appointments
- `GET /api/patient/appointments` - Get patient's appointments
- `POST /api/appointments` - Create a new appointment
- `PATCH /api/appointments/:appointmentId/status` - Update appointment status
- `GET /api/appointments/:appointmentId` - Get appointment by ID

### Availability
- `GET /api/therapists/:therapistId/availability` - Get therapist's availability
- `POST /api/therapist/availability` - Add availability slot
- `PUT /api/therapist/availability/:availabilityId` - Update availability slot
- `DELETE /api/therapist/availability/:availabilityId` - Delete availability slot

## Database Schema

The database consists of the following main tables:
- `users` - Stores user authentication and common profile data
- `therapists` - Stores therapist-specific profile data
- `patients` - Stores patient-specific profile data
- `appointments` - Stores appointment information
- `therapist_availability` - Stores therapist availability slots
- `reviews` - Stores patient reviews of therapists
- `messages` - Stores messages between users
- `session_notes` - Stores therapist notes on sessions

## Technologies Used

### Backend
- Node.js
- Express.js
- MySQL
- JSON Web Tokens (JWT)
- bcrypt for password hashing

### Frontend
- React
- React Router
- Tailwind CSS
- Axios
- React Icons
- Framer Motion

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- [Your Name](https://github.com/yourusername)
