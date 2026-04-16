import express from "express";

import aiRoutes from "../modules/AI/ai.routes";
import userRoutes from "../modules/User/user.routes";

const router = express.Router();

// ✅ AI routes
router.use("/ai", aiRoutes);

// ✅ User routes
router.use("/user", userRoutes);

export default router;