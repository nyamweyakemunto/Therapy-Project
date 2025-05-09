const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const therapistRoutes = require('./routes/therapistRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const testRoutes = require('./routes/testRoutes');
const path = require('path');
const morgan = require('morgan');


dotenv.config({ path: path.join(__dirname, '.env') });


const app = express();

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true,
  exposedHeaders: ['set-cookie']
}));

// Additional headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

// Register routes
app.use(authRoutes);
app.use(patientRoutes);
app.use(therapistRoutes);
app.use(appointmentRoutes);
app.use(testRoutes);

// Note: All endpoints have been moved to their respective route files

const port = process.env.PORT || 3500;

app.listen(port, () => console.log(`Server running on port ${port}`)).on('error', (err) => {

  if (err.code === 'EADDRINUSE') {

    console.error(`Port ${port} is already in use. Trying another port...`);

  } else {

    throw err;

  }

});