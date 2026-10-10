const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
let memoryServer;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      try {
        const { MongoMemoryServer } = require("mongodb-memory-server");
        const dbPath = path.join(__dirname, "..", ".data", "mongodb");
        fs.mkdirSync(dbPath, { recursive: true });
        memoryServer = await MongoMemoryServer.create({
          instance: { dbName: "roomsathi", dbPath },
        });
        const conn = await mongoose.connect(memoryServer.getUri("roomsathi"));
        console.warn(`Atlas connection failed: ${error.message}`);
        console.warn(`Using local MongoDB fallback at ${dbPath}; data is stored on disk.`);
        console.log(`MongoDB connected: ${conn.connection.host} (local development database)`);
        return;
      } catch (fallbackError) {
        console.error(`Local MongoDB fallback failed: ${fallbackError.message}`);
      }
    }

    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
