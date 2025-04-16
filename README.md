 Overview
A full-stack MERN (MongoDB, Express.js, React, Node.js) application designed for managing therapy appointments. This system allows therapists and patients to schedule, view, update, and cancel appointments with ease.

 Key Features
✅ User Authentication (Therapist & Patient roles)
✅ Appointment Scheduling with date/time selection
✅ CRUD Operations (Create, Read, Update, Delete appointments)
✅ Responsive UI built with Tailwind CSS
✅ Real-time updates using WebSockets (optional)
✅ Secure API with JWT authentication

Tech Stack

Category -Technologies
Frontend - React, Tailwind CSS, Axios, React Router
Backend - Node.js, Express.js, MongoDB (Mongoose)
Authentication - JWT (JSON Web Tokens)
Deployment - Vercel (Frontend), Render (Backend)

 Installation & Setup

Prerequisites
Node.js (v16+)

MongoDB Atlas (or local MongoDB)

Git

1 . Clone the Repository

bash

git clone https://github.com/nyamweyakemunto/Therapy-Project.git
cd therapy-project

2 . Backend Setup

bash

cd backend
npm install
Configure Environment Variables
Create a .env file in /backend:

env
Copy
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
Run the Backend
bash
Copy
npm start  # For development: npm run dev (with nodemon)

3 . Frontend Setup

bash

cd ../frontend
npm install
Configure Environment Variables
Create a .env file in /frontend:

env

REACT_APP_API_URL=http://localhost:5000  
Run the Frontend
bash

npm start  Runs on http://localhost:3000

 Deployment
1 . Backend (Node.js/Express)
Recommended: Deploy on Render

Connect GitHub repo

Set MONGODB_URI and JWT_SECRET in environment variables

Build command: npm install

Start command: node server.js

2 . Frontend (React)
Recommended: Deploy on Vercel

Connect GitHub repo

Set REACT_APP_API_URL (pointing to your deployed backend)

Build command: npm run build

Output directory: build

 Project Structure
Backend (/backend)
Copy
├── controllers/      # Business logic (appointments, auth)
├── models/           # MongoDB schemas (User, Appointment)
├── routes/           # API endpoints
├── middleware/       # Auth & error handling
├── server.js         # Entry point
└── .env              # Environment variables
Frontend (/frontend)
Copy
├── src/
│   ├── components/   # Reusable UI (AppointmentForm, Navbar)
│   ├── pages/        # Main views (Dashboard, Login)
│   ├── services/     # API calls (axios config)
│   ├── App.js        # Main router
│   └── index.js      # React entry point
├── public/           # Static files
└── .env              # Frontend config


 Authentication Flow
User signs up (Therapist/Patient role)

JWT token generated upon login

Token stored in HTTP-only cookies (secure)

Protected routes validate token before access

 API Documentation
Endpoints
Method-Endpoint Description
POST-/api/auth/register Register new user
POST-/api/auth/login User login (JWT token)
GET-/api/appointments Fetch all appointments
POST-/api/appointments Create new appointment
PUT-/api/appointments/:id Update appointment
DELETE-/api/appointments/:id Delete appointment
Example Request (Create Appointment):

bash

curl -X POST http://localhost:5000/api/appointments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "therapistId": "123",
    "patientId": "456",
    "date": "2023-10-20",
    "time": "14:00"
  }'

Development Scripts
Command Description
npm start Runs frontend/backend
npm run build Builds React for production
npm test Runs Jest tests (if configured)
npm run lint hecks code style (ESLint)

 License
This project is licensed under MIT.

Credits & Contributors
Developed by Marion Kemunto

Inspired by [Therapy Management Systems]

 Support & Contact
For issues, email: kemuntoisfly22@gmail.com

 Happy Coding!
Deployed Demo:therapy-project.vercel.app

This README.md provides:
✔️ Clear setup instructions
✔️ Tech stack overview
✔️ API documentation
✔️ Deployment guide
✔️ Project structure