
Therapy Appointment Management System

A full-stack MERN (MongoDB, Express.js, React, Node.js) application designed for managing therapy appointments. This system allows therapists and patients to schedule, view,update and cancel appointments with ease.


✅ Key Features

- 🔐 User Authentication (Therapist & Patient roles)
- 📅 Appointment Scheduling with date/time selection
- ✏️ Full CRUD Operations on appointments
- 📱 Responsive UI built with Tailwind CSS
- 🔄 Real-time updates using WebSockets *(optional)*
- 🔒 Secure API with JWT authentication


🛠 Tech Stack

| Category       | Technologies                          |
|----------------|----------------------------------------|
| Frontend       | React, Tailwind CSS, Axios, React Router |
| Backend        | Node.js, Express.js, MongoDB (Mongoose) |
| Authentication | JWT (JSON Web Tokens)                 |
| Deployment     | Vercel (Frontend), Render (Backend)   |


⚙️ Installation & Setup

 Prerequisites

- Node.js (v16+)
- MongoDB Atlas or local MongoDB
- Git

 1 . Clone the Repository

```bash
git clone https://github.com/nyamweyakemunto/Therapy-Project.git
cd therapy-project
```

 2 . Backend Setup

```bash
cd backend
npm install
```

 Configure Environment Variables

Create a `.env` file inside `/backend`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the backend server:

```bash
npm start
# For development with nodemon:
npm run dev
```

3 . Frontend Setup

```bash
cd ../frontend
npm install
```

Configure Environment Variables

Create a `.env` file inside `/frontend`:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start the frontend app:

```bash
npm start
# Runs on http://localhost:3000


 Deployment Guide

 1 . Backend (Render)

- Connect your GitHub repo
- Set environment variables (`MONGODB_URI`, `JWT_SECRET`)
- Build command: `npm install`
- Start command:`node server.js`

 2 . Frontend (Vercel)

- Connect your GitHub repo
- Set `REACT_APP_API_URL` to your deployed backend URL
- Build command: `npm run build`
- Output directory:`build`


 Project Structure

 Backend (`/backend`)


├── controllers/     # Business logic (appointments, auth)
├── models/          # MongoDB schemas (User, Appointment)
├── routes/          # API endpoints
├── middleware/      # Auth & error handling
├── server.js        # Entry point
└── .env             # Environment variables


 Frontend (`/frontend`)


├── src/
│   ├── components/  # Reusable UI (AppointmentForm, Navbar)
│   ├── pages/       # Main views (Dashboard, Login)
│   ├── services/    # API calls (axios config)
│   ├── App.js       # Main router
│   └── index.js     # React entry point
├── public/          # Static files
└── .env             # Frontend config




 Authentication Flow

1. User registers as Therapist or Patient
2. JWT token is generated upon login
3. Token is stored in HTTP-only cookies
4. Protected routes validate JWT token before granting access



 API Documentation

| Method | Endpoint                | Description                |
|--------|-------------------------|----------------------------|
| POST   | `/api/auth/register`    | Register new user          |
| POST   | `/api/auth/login`       | User login (returns JWT)   |
| GET    | `/api/appointments`     | Get all appointments       |
| POST   | `/api/appointments`     | Create new appointment     |
| PUT    | `/api/appointments/:id` | Update an appointment      |
| DELETE | `/api/appointments/:id` | Delete an appointment      |

Example: Create Appointment

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

| Command         | Description                          |
|-----------------|--------------------------------------|
| `npm start`     | Runs frontend/backend                |
| `npm run build` | Builds React frontend for production |
| `npm test`      | Runs Jest tests (if configured)      |
| `npm run lint`  | Checks code style using ESLint       |


 License

This project is licensed under the [MIT License](LICENSE).

 Author

Marion Kemunto 
kemuntoisfly22@gmail.com  
 [Deployed Demo](https://therapy-project.vercel.app)

 Credits

Inspired by real-world therapy scheduling needs and modern appointment management systems.



Happy Coding! 💙




Let me know if you’d like a version with clickable badges, screenshots, or a table of contents!