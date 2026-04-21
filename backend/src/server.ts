import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { createServer } from "http";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

// 🌐 Create HTTP server
const server = createServer(app);

// 🛢️ Connect DB
connectDB();

// 🚀 Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});