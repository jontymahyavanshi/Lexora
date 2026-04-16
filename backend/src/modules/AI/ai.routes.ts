import express from "express";
import {
  createManualQuiz,
  getQuizFromDB,
} from "./ai.controller";

import { protect, authorize } from "../../Common/middleware/auth";

const router = express.Router();

//
// 👑 ADMIN ROUTES
//

// ➕ Add / Merge quiz questions
router.post(
  "/manual-quiz",
  protect,
  authorize("admin"), // 🔥 only admin
  createManualQuiz
);

//
// 🎮 USER ROUTES
//

// 📥 Fetch quiz from DB
router.post("/get-quiz", protect, getQuizFromDB);

export default router;