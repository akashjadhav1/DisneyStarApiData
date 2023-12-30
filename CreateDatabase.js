const mongoose = require("mongoose");
require('dotenv').config();

async function connectToDatabase() {
  try {
    const dbUrl = process.env.MONGODB_URI;

    if (!dbUrl.startsWith('mongodb://') && !dbUrl.startsWith('mongodb+srv://')) {
      throw new Error('Invalid MongoDB URI scheme. It should start with "mongodb://" or "mongodb+srv://".');
    }

    console.log(dbUrl);

    const client = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    return client;
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    throw error;
  }
}

module.exports = connectToDatabase;
