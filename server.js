const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDatabase = require('./CreateDatabase'); // Assuming you have a separate file for database connection
const bookingRoutes = require('./connector');
const errorHandler = require('./connector');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Connect to the MongoDB database
connectToDatabase()
  .then(() => {
    console.log('Connected to the MongoDB database');

    // Use the booking routes
    app.use('/', bookingRoutes);

    // Error handling middleware
    app.use(errorHandler);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process if the database connection fails
  });
