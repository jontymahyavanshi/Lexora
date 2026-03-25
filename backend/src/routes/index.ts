import { Router } from "express";
import userRoutes from "../modules/User/user.routes";

const router = Router();

router.use("/user", userRoutes);

export default router;