import { Router } from "express";
import userRoutes from "../modules/User/user.routes";
import aiRoutes from "../modules/AI/ai.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/ai", aiRoutes);

export default router;