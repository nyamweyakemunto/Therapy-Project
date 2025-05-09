// Simple test script to check if the route is working
const express = require('express');
const app = express();

// Import the availability controller
const { getTherapistAvailability } = require('./controllers/availabilityController');

// Register the route
app.get('/api/therapists/:therapistId/availability', getTherapistAvailability);

// Start the server
const port = 3600;
app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
  console.log(`Try accessing: http://localhost:${port}/api/therapists/1/availability`);
});
