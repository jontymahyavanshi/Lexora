import express from "express";
import { getAdminStats, getAllUsers, deleteUser } from "./admin.controller";
import { protect, authorize } from "../../Common/middleware/auth";

const router = express.Router();

// 👑 Admin Stats
router.get("/stats", protect, authorize("admin"), getAdminStats);
router.get("/users", protect, authorize("admin"), getAllUsers);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

export default router;