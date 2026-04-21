import express from "express";

// 📦 Module Routes
import aiRoutes from "../modules/AI/ai.routes";
import userRoutes from "../modules/User/user.routes";
import adminRoutes from "../modules/Admin/admin.routes";

const router = express.Router();
// 👑 Admin Routes
router.use("/admin", adminRoutes);

// 🤖 AI Routes
router.use("/ai", aiRoutes);

// 👤 User Routes
router.use("/user", userRoutes);

export default router;