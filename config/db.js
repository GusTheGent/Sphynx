const mongoose = require("mongoose");
const dotenv = require("dotenv");

// dotenv.config({ path: "../.env" });

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI, options);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
    console.log("Connection Status: " + mongoose.connection.readyState);
  } catch (error) {
    console.error("Failed to connect: " + error);
    console.log("Connection Status: " + mongoose.connection.readyState);
  }
};
module.exports = connectDB;
