const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    const dbUrl = "mongodb://localhost:27017/DisneyStar";

    console.log(dbUrl);

    const client = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }); 

    


    console.log("Connected To Mongodb");

    return client;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

module.exports = connectToDatabase;