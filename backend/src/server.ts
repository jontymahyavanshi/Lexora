import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { createServer } from "http";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

const server = createServer(app);

// ✅ Connect database
connectDB();

// ❌ REMOVE this line (IMPORTANT)
// app.use("/api/user", userRoutes);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});