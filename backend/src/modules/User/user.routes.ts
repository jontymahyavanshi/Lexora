import { Router, Response } from "express";

// 👤 Controllers
import {
  signup,
  login,
  updateLanguage,
} from "./user.controller";

import {
  submitQuiz,
  getDashboard,
} from "./progress.controller";

// 🔐 Middleware
import { protect, authorize } from "../../Common/middleware/auth";

const router = Router();

//
// 🔐 AUTH
//
router.post("/signup", signup);
router.post("/login", login);

//
// 🌍 USER SETTINGS
//
router.put("/language", protect, updateLanguage);

//
// 🎮 QUIZ / PROGRESS
//
router.post("/submit-quiz", protect, submitQuiz);
router.get("/dashboard", protect, getDashboard);

//
// 👤 PROFILE (TEST)
//
router.get("/profile", protect, (req: any, res: Response) => {
  res.json({
    message: "Protected route working",
    userId: req.userId,
    role: req.userRole,
  });
});

//
// 👑 ADMIN TEST
//
router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req: any, res: Response) => {
    res.json({
      message: "Admin access granted",
    });
  }
);

export default router;