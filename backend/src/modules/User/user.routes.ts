import { Router } from "express";
import { signup, login } from "./user.controller";
import { protect, authorize } from "../../Common/middleware/auth";
import { submitQuiz } from "./progress.controller";
import { updateLanguage } from "./user.controller";
import { getDashboard } from "./progress.controller";

const router = Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);

// User preferences
router.put("/language", protect, updateLanguage);

// Progress route
router.post("/submit-quiz", protect, submitQuiz);
router.get("/dashboard", protect, getDashboard);

// Protected route
router.get("/profile", protect, (req: any, res) => {
  res.json({
    message: "Protected route working",
    userId: req.userId,
    role: req.userRole,
  });
});

// Admin-only route (optional test)
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Admin only access" });
});

export default router;