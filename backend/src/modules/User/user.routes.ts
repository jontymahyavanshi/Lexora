import { Router } from "express";
import {
  signup,
  login,
  updateLanguage,
} from "./user.controller";

import {
  submitQuiz,
  getDashboard,
} from "./progress.controller";

import { protect, authorize } from "../../Common/middleware/auth";

const router = Router();

//
// 🔐 AUTH ROUTES
//
router.post("/signup", signup);
router.post("/login", login);

//
// 🌐 USER PREFERENCES
//
router.put("/language", protect, updateLanguage);

//
// 📊 PROGRESS ROUTES
//
router.post("/submit-quiz", protect, submitQuiz);
router.get("/dashboard", protect, getDashboard);

//
// 👤 USER PROFILE (PROTECTED TEST)
//
router.get("/profile", protect, (req: any, res) => {
  res.json({
    message: "Protected route working",
    userId: req.userId,
    role: req.userRole,
  });
});

//
// 👑 ADMIN TEST ROUTE
//
router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req: any, res) => {
    res.json({
      message: "Admin only access",
    });
  }
);

export default router;