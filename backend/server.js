const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes')
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

app.use(authRoutes);
app.use(bookingRoutes);
// Temporary test endpoint
app.get('/test-cookie', (req, res) => {
  res.cookie('test', 'value', { sameSite: 'None', secure: false });
  res.send('Cookie set');
});

app.get('/verify-cookie', (req, res) => {
  // Set test cookie with same config as auth cookie
  res.cookie('verify_test', 'works', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'development' ? 'Lax' : 'None',
      domain: process.env.NODE_ENV === 'development' ? 'localhost' : '.yourdomain.com'
  });
  
  // Return all cookies received
  res.json({
      receivedCookies: req.cookies,
      headers: req.headers,
      env: process.env.NODE_ENV
  });
});

const port = process.env.PORT || 3500;

app.listen(port, () => console.log(`Server running on port ${port}`)).on('error', (err) => {

  if (err.code === 'EADDRINUSE') {

    console.error(`Port ${port} is already in use. Trying another port...`);

  } else {

    throw err;

  }

});